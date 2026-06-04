const CATEGORY_HEBREW = {
  plumbing: 'אינסטלציה', electricity: 'חשמל', air_conditioning: 'מזגן / קירור',
  transportation: 'הסעה / שינוע', childcare: 'שמירה על ילדים', food: 'אוכל / קניות',
  medical: 'תרופות / סיוע רפואי', errands: 'סידורים ושליחויות', household: 'עזרה בבית',
  emotional: 'תמיכה ושיחה', tutoring: 'עזרה בלימודים', general: 'כללי'
};
const URGENCY_HEBREW = { critical: 'קריטי', high: 'דחוף', medium: 'רגיל', low: 'לא דחוף' };
const URGENCY_EMOJI = { critical: '🚨', high: '⚠️', medium: '📋', low: '📝' };

const KEYWORDS = {
  plumbing: ['נזילה','נוזל','דליפה','צינור','ברז','סתימה','ביוב','אסלה','כיור','מקלחת','דוד','אינסטלטור'],
  electricity: ['חשמל','קצר','שקע','תקע','מפסק','נורה','תאורה','פיוז','חשמלאי','מנורה'],
  air_conditioning: ['מזגן','קירור','חימום','לא מקרר','לא מחמם'],
  transportation: ['הסעה','טרמפ','רכב','נסיעה','לקחת','להחזיר','איסוף','בית חולים','להסיע'],
  childcare: ['ילדים','ילד','ילדה','תינוק','בייביסיטר','בייבי סיטר','שמרטף','מטפלת','גן','צהרון'],
  food: ['אוכל','アרוחה','בישול','מזון','קניות','סופר','מצרכים','חלב','לחם'],
  medical: ['תרופה','מרשם','בית מרקחת','רופא','קופת חולים','בדיקה','חום','מיון','אמבולנס'],
  errands: ['סידורים','דואר','בנק','לקנות','חבילה','מסמכים','טפסים','עירייה','שליחות'],
  household: ['ניקיון','כביסה','כלים','סידור הבית','רהיט','הרכבה','מדף','ארון','גינה'],
  emotional: ['לדבר','שיחה','תמיכה','בודדה','קשה לי','לחץ','חרדה','פחד','עידוד','אוזן קשבת'],
  tutoring: ['לימודים','שיעורי בית','מורה פרטי','מתמטיקה','אנגלית','קריאה','כתיבה']
};

const CITIES = ['תל אביב','ירושלים','חיפה','באר שבע','אשדוד','הרצליה','נתניה','רמת גן','פתח תקווה','בני ברק','חולון','ראשון לציון','אשקלון','עפולה','כפר סבא','בת ים','ראש העין','מודיעין','לוד','רעננה','רהט','בית שמש','טבריה','עכו','נצרת','דימונה','שדרות','נתיבות','ביתר עילית','גבעתיים','כרמיאל','נהריה','קריית גת','חדרה','יבנה'];
const CITY_GROUPS = [['נתיבות','שדרות','באר שבע','אופקים'], ['תל אביב','רמת גן','גבעתיים','בני ברק','חולון','בת ים','ראשון לציון'], ['ירושלים','בית שמש','ביתר עילית'], ['חיפה','קריית אתא','קריית מוצקין','נהריה','עכו'], ['אשדוד','אשקלון','קריית גת']];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. אימות ה-Webhook מול Meta (GET)
    if (request.method === "GET") {
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");
      const WEBHOOK_VERIFY_TOKEN = await env.VERIFY_TOKEN.get();

      if (mode && token && mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
        return new Response(challenge, { status: 200 });
      }
      return new Response("Forbidden", { status: 403 });
    }

    // 2. קבלת בקשות מוואטסאפ (POST)
    if (request.method === "POST") {
      try {
        const body = await request.json();

        if (body.object === "whatsapp_business_account" && body.entry?.[0]?.changes?.[0]?.value) {
          const value = body.entry[0].changes[0].value;
          const phone_number_id = value.metadata.phone_number_id;

          // טיפול בהודעת טקסט רגילה
          if (value.messages?.[0]) {
            const message = value.messages[0];
            const from = message.from; // מספר הטלפון של המשתמש
            const firstName = value.contacts?.[0]?.profile?.name || "משתמש";

            // אבחון סוג ההודעה (טקסט חופשי או לחיצה על כפתור/רשימה)
            if (message.type === "text") {
              const text = (message.text.body || "").trim();
              await handleWhatsAppText(phone_number_id, from, text, firstName, env);
            } 
            else if (message.type === "interactive") {
              // המשתמש לחץ על כפתור או בחר פריט מרשימה
              await handleWhatsAppInteractive(phone_number_id, from, message.interactive, env);
            }
          }
        }
        return new Response("OK", { status: 200 });
      } catch (err) {
        console.error("Error processing webhook:", err);
        return new Response("OK", { status: 200 }); // מחזירים 200 כדי שמטא לא תחסום אותנו
      }
    }

    return new Response("Method not allowed", { status: 405 });
  }
};

// ==========================================
// ניהול שיחה מבוססת טקסט
// ==========================================
async function handleWhatsAppText(phone_number_id, from, text, firstName, env) {
  if (!text) return;

  // טיפול בטקסטים קצרים / פקודות בסיסיות (החלפת ה-Commands של טלגרם)
  const lowerText = text.toLowerCase();
  if (lowerText === 'ביטול' || lowerText === '/cancel') {
    await clearSession(env, from);
    await env.DB.prepare("UPDATE requests SET status='cancelled', updated_at=? WHERE phone=? AND status IN ('searching','assigned')").bind(nowIso(), from).run();
    return sendTxt(phone_number_id, from, 'הבקשה הפעילה שלכם בוטלה בהצלחה.');
  }

  const session = await getSession(env, from);
  session.last_interaction = nowIso();

  // שלב א': הבוט ממתין לעיר
  if (session.awaiting_city) {
    const city = extractCity(text);
    if (!city) {
      return sendTxt(phone_number_id, from, 'לא הצלחתי לזהות עיר ברשימה. אנא כתבו את שם העיר במפורש (למשל: תל אביב, באר שבע, ירושלים):');
    }
    session.pending_city = city;
    session.awaiting_city = false;
    session.awaiting_phone = false; // בוואטסאפ יש לנו כבר את הטלפון שלו (המשתנה `from`)!
    session.pending_phone = from;
    await setSession(env, from, session);
    
    // עוברים ישר לבקשת דחיפות
    return sendUrgencyList(phone_number_id, from, session.pending_category, city, env);
  }

  // שלב ב': הודעה ראשונית / סמול טוק
  if (isSmallTalk(text)) {
    return sendTxt(phone_number_id, from, `שלום ${escapeHtml(firstName)}! 👋\n\nאני בוט עזרה למשפחות מילואימניקים. פשוט כתבו לי כאן בהודעה חופשית מה אתם צריכים, למשל:\n• "יש לנו קצר בחשמל בבית"\n• "צריכים בייביסיטר לילדים בערב"\n• "מחפשים מישהו שיקנה לנו תרופות"`);
  }

  // זיהוי אוטומטי של קטגוריה ועיר מהטקסט החופשי
  const category = classify(text);
  const city = extractCity(text);

  await setSession(env, from, {
    pending_name: firstName,
    pending_description: text,
    pending_category: category,
    pending_phone: from,
    awaiting_city: !city,
    pending_city: city || undefined,
    last_interaction: nowIso()
  });

  if (!city) {
    return sendTxt(phone_number_id, from, `זוהה סוג עזרה: *${CATEGORY_HEBREW[category] || category}*\n\nבאיזו עיר אתם נמצאים?`);
  }

  // אם העיר כבר זוהתה בטקסט, עוברים ישר לבחירת דחיפות
  return sendUrgencyList(phone_number_id, from, category, city, env);
}

// ==========================================
// טיפול בלחיצות על כפתורים ותפריטים (Interactive)
// ==========================================
async function handleWhatsAppInteractive(phone_number_id, from, interactive, env) {
  const whatsappToken = await env.WHATSAPP_TOKEN.get();
  
  // 1. קבלת בחירה מתוך רשימת הדחיפות (List Message)
  if (interactive.type === "list_reply") {
    const urgency = interactive.list_reply.id; // למשל 'low', 'medium', 'high', 'critical'
    const session = await getSession(env, from);
    
    if (!session.pending_description) {
      return sendTxt(phone_number_id, from, 'הפנייה לא נמצאה במערכת. אנא תארו שוב מה אתם צריכים.');
    }

    const req = await createRequest(env, session, urgency);
    await clearSession(env, from);

    // חיפוש מתנדבים זמינים
    const volunteers = await findVolunteers(env, req.city, req.category);
    if (!volunteers.length) {
      return sendTxt(phone_number_id, from, `${URGENCY_EMOJI[urgency] || '📋'} בקשתך התקבלה בהצלחה (מספר בקשה: ${req.id}).\n\nאין כרגע מתנדבים זמינים בעיר שלך בתחום זה, ננסה לעדכן בהמשך.`);
    }

    let notified = 0;
    for (const v of volunteers) {
      // שליחת הודעה למתנדבים בוואטסאפ שלהם!
      const msgForVolunteer = `${URGENCY_EMOJI[urgency]} *בקשת עזרה חדשה!* (${URGENCY_HEBREW[urgency]})\n\nמשפחת מילואימניק באזור *${req.city}* צריכה עזרה בתחום *${CATEGORY_HEBREW[req.category] || req.category}*.\n\n*תיאור הצורך:* ${req.description}`;
      
      // שליחת הודעה עם 2 כפתורים אינטראקטיביים למתנדב
      const ok = await sendButtons(phone_number_id, v.phone, msgForVolunteer, [
        { id: `accept_${req.id}_${v.id}`, title: "✅ אני יכול לעזור" },
        { id: `reject_${req.id}_${v.id}`, title: "❌ לא זמין כעת" }
      ], env);
      
      if (ok) notified++;
    }

    return sendTxt(phone_number_id, from, `${URGENCY_EMOJI[urgency]} בקשתך התקבלה ונרשמה (מספר: ${req.id}).\n\nסוג: ${CATEGORY_HEBREW[req.category] || req.category}\nעיר: ${req.city}\nדחיפות: ${URGENCY_HEBREW[urgency]}\n\nשלחנו התראה ל-${notified} מתנדבים באזורך.`);
  }

  // 2. קבלת תגובה מכפתורי המתנדב (Button Reply)
  if (interactive.type === "button_reply") {
    const buttonId = interactive.button_reply.id;
    const parts = buttonId.split('_');
    if (parts.length < 3) return;

    const [action, requestId, volunteerId] = parts;
    const req = await env.DB.prepare('SELECT * FROM requests WHERE id=?').bind(requestId).first();
    const vol = await env.DB.prepare('SELECT * FROM volunteers WHERE id=?').bind(Number(volunteerId)).first();

    if (!req || !vol) return sendTxt(phone_number_id, from, '❌ הבקשה או המתנדב לא נמצאו במערכת.');

    if (action === 'accept') {
      if (req.status === 'assigned') {
        return sendTxt(phone_number_id, from, 'בקשה זו כבר שויכה למתנדב אחר. תודה על הרצון הטוב! 💙');
      }

      const assigned = JSON.stringify({ id: vol.id, name: vol.name, phone: vol.phone, city: vol.city, assigned_at: nowIso() });
      await env.DB.prepare("UPDATE requests SET status='assigned', assigned_volunteer=?, assigned_at=? WHERE id=?").bind(assigned, nowIso(), requestId).run();
      await env.DB.prepare('UPDATE volunteers SET assignment_count=assignment_count+1, last_response_time=? WHERE id=?').bind(nowIso(), vol.id).run();

      // שליחת פרטי הקשר למתנדב
      await sendTxt(phone_number_id, vol.phone, `✅ *תודה רבה! הבקשה שויכה אליך.*\n\n*פרטי המשפחה ליצירת קשר:*\nשם: ${req.name}\nטלפון: ${req.phone}\nעיר: ${req.city}\nתיאור הצורך: ${req.description}`);
      
      // עדכון המשפחה
      await sendTxt(phone_number_id, req.phone, `🎉 בשורות טובות! נמצא מתנדב לבקשתכם (מספר ${req.id}). המתנדב (${vol.name}) יצור עמכם קשר טלפוני בהקדם.`);
    }

    if (action === 'reject') {
      await env.DB.prepare('UPDATE volunteers SET available=0, updated_at=? WHERE id=?').bind(nowIso(), vol.id).run();
      await sendTxt(phone_number_id, from, `אין בעיה, ${vol.name}. סומנת כלא זמין זמנית.`);
    }
  }
}

// ==========================================
// פונקציות שליחה מותאמות לוואטסאפ (Meta API)
// ==========================================

// 1. שליחת הודעת טקסט פשוטה
async function sendTxt(phone_number_id, to, text, env) {
  const token = await env.WHATSAPP_TOKEN.get();
  const res = await fetch(`https://graph.facebook.com/v18.0/${phone_number_id}/messages`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: text }
    })
  });
  return res.ok;
}

// 2. שליחת תפריט בחירה (רשימה) עבור רמות הדחיפות
async function sendUrgencyList(phone_number_id, to, category, city, env) {
  const token = await env.WHATSAPP_TOKEN.get();
  const res = await fetch(`https://graph.facebook.com/v18.0/${phone_number_id}/messages`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to,
      type: "interactive",
      interactive: {
        type: "list",
        header: { type: "text", text: "שלב אחרון!" },
        body: { text: `סוג עזרה: *${CATEGORY_HEBREW[category] || category}*\nעיר: *${city}*\n\nמה רמת הדחיפות של הבקשה?` },
        action: {
          button: "בחר דחיפות",
          sections: [
            {
              title: "רמות דחיפות",
              rows: [
                { id: "low", title: "📝 לא דחוף", description: "יכול להמתין מספר ימים" },
                { id: "medium", title: "📋 רגיל", description: "עזרה רגילה ליומיום" },
                { id: "high", title: "⚠️ דחוף", description: "נדרש טיפול ב-24 שעות הקרובות" },
                { id: "critical", title: "🚨 קריטי", description: "דחוף ומיידי לחלוטין" }
              ]
            }
          ]
        }
      }
    })
  });
  return res.ok;
}

// 3. שליחת הודעה עם כפתורים (עבור אישור/דחייה של מתנדבים)
async function sendButtons(phone_number_id, to, text, buttons, env) {
  const token = await env.WHATSAPP_TOKEN.get();
  const whatsappButtons = buttons.map(b => ({
    type: "reply",
    reply: { id: b.id, title: b.title }
  }));

  const res = await fetch(`https://graph.facebook.com/v18.0/${phone_number_id}/messages`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: text },
        action: { buttons: whatsappButtons }
      }
    })
  });
  return res.ok;
}

// ==========================================
// לוגיקה פנימית ופונקציות עזר (ללא שינוי מהמקור שלך)
// ==========================================
async function createRequest(env, session, urgency) {
  const id = crypto.randomUUID().replaceAll('-', '').slice(0, 8);
  const req = { id, name: session.pending_name || 'משתמש', phone: session.pending_phone, city: session.pending_city, description: session.pending_description, category: session.pending_category || 'general', urgency, status: 'searching', requester_chat_id: null, requester_user_id: null, created_at: nowIso() };
  await env.DB.prepare('INSERT INTO requests (id,name,phone,city,description,category,urgency,status,created_at) VALUES (?,?,?,?,?,?,?,?,?)')
    .bind(req.id, req.name, req.phone, req.city, req.description, req.category, req.urgency, req.status, req.created_at).run();
  return req;
}

async function findVolunteers(env, city, category) {
  const rows = await env.DB.prepare('SELECT * FROM volunteers WHERE approved=1 AND available=1').all();
  const nearby = nearbyCities(city);
  return rows.results.map(v => ({ ...v, skillsArr: JSON.parse(v.skills || '[]') }))
    .filter(v => v.city === city || nearby.includes(v.city))
    .filter(v => category === 'general' || v.skillsArr.includes(category) || v.skillsArr.includes('general'))
    .slice(0, 5);
}

function nearbyCities(city) { const g = CITY_GROUPS.find(x => x.includes(city)); return g ? g.filter(x => x !== city) : []; }
function classify(text) { const t = text.toLowerCase(); let best = 'general', bestScore = 0; for (const [cat, words] of Object.entries(KEYWORDS)) { const score = words.filter(w => t.includes(w)).length; if (score > bestScore) { best = cat; bestScore = score; } } return best; }
function extractCity(text) { return CITIES.sort((a,b)=>b.length-a.length).find(c => text.includes(c)) || null; }
function isSmallTalk(text) { const t = text.toLowerCase().trim(); return ['שלום','היי','הי','אהלן','תודה','מה נשמע','מה קורה','עזרה'].includes(t) || (t.length < 3); }
function nowIso() { return new Date().toISOString(); }
async function getSession(env, chatId) { const row = await env.DB.prepare('SELECT data FROM sessions WHERE chat_id=?').bind(chatId).first(); return row ? JSON.parse(row.data) : {}; }
async function setSession(env, chatId, data) { await env.DB.prepare('INSERT OR REPLACE INTO sessions (chat_id,data,updated_at) VALUES (?,?,?)').bind(chatId, JSON.stringify(data), nowIso()).run(); }
async function clearSession(env, chatId) { await env.DB.prepare('DELETE FROM sessions WHERE chat_id=?').bind(chatId).run(); }
function escapeHtml(s) { return String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
