const CATEGORY_HEBREW = {
  plumbing: "אינסטלציה",
  electricity: "חשמל",
  air_conditioning: "מזגן / קירור",
  transportation: "הסעה / שינוע",
  childcare: "שמירה על ילדים",
  food: "אוכל / קניות",
  medical: "תרופות / סיוע רפואי",
  errands: "סידורים ושליחויות",
  household: "עזרה בבית",
  emotional: "תמיכה ושיחה",
  tutoring: "עזרה בלימודים",
  general: "כללי"
};

const URGENCY_HEBREW = {
  critical: "קריטי",
  high: "דחוף",
  medium: "רגיל",
  low: "לא דחוף"
};

const VOLUNTEER_SKILLS = {
  electricity: "⚡ חשמל",
  plumbing: "🚰 אינסטלציה",
  air_conditioning: "❄️ מיזוג אוויר",
  transportation: "🚗 הסעות",
  childcare: "👶 שמירה על ילדים",
  food: "🍲 אוכל וקניות",
  household: "🏠 עזרה בבית",
  errands: "📦 סידורים ושליחויות",
  medical: "🩺 סיוע רפואי ותרופות",
  emotional: "💙 תמיכה רגשית",
  general: "🔨 עזרה כללית בבית"
};

const URGENCY_EMOJI = {
  critical: "🚨",
  high: "⚠️",
  medium: "📋",
  low: "📝"
};

const KEYWORDS = {
  plumbing: ["נזילה", "נוזל", "דליפה", "צינור", "ברז", "סתימה", "ביוב", "אסלה", "כיור", "מקלחת", "דוד", "אינסטלטור"],
  electricity: ["חשמל", "קצר", "שקע", "תקע", "מפסק", "נורה", "תאורה", "פיוז", "חשמלאי", "מנורה"],
  air_conditioning: ["מזגן", "קירור", "חימום", "לא מקרר", "לא מחמם"],
  transportation: ["הסעה", "טרמפ", "רכב", "נסיעה", "לקחת", "להחזיר", "איסוף", "בית חולים", "להסיע"],
  childcare: ["ילדים", "ילד", "ילדה", "תינוק", "בייביסיטר", "בייבי סיטר", "שמרטף", "מטפלת", "גן", "צהרון"],
  food: ["אוכל", "ארוחה", "בישול", "מזון", "קניות", "סופר", "מצרכים", "חלב", "לחם"],
  medical: ["תרופה", "מרשם", "בית מרקחת", "רופא", "קופת חולים", "בדיקה", "חום", "מיון", "אמבולנס"],
  errands: ["סידורים", "דואר", "בנק", "לקנות", "חבילה", "מסמכים", "טפסים", "עירייה", "שליחות"],
  household: ["ניקיון", "כביסה", "כלים", "סידור הבית", "רהיט", "הרכבה", "מדף", "ארון", "גינה"],
  emotional: ["לדבר", "שיחה", "תמיכה", "בודדה", "קשה לי", "לחץ", "חרדה", "פחד", "עידוד", "אוזן קשבת"],
  tutoring: ["לימודים", "שיעורי בית", "מורה פרטי", "מתמטיקה", "אנגלית", "קריאה", "כתיבה"]
};

const CITIES = [
  "תל אביב", "ירושלים", "חיפה", "באר שבע", "אשדוד", "הרצליה", "נתניה", "רמת גן",
  "פתח תקווה", "בני ברק", "חולון", "ראשון לציון", "אשקלון", "עפולה", "כפר סבא",
  "בת ים", "ראש העין", "מודיעין", "לוד", "רעננה", "רהט", "בית שמש", "טבריה",
  "עכו", "נצרת", "דימונה", "שדרות", "נתיבות", "ביתר עילית", "גבעתיים",
  "כרמיאל", "נהריה", "קריית גת", "חדרה", "יבנה", "אופקים"
];

const CITY_GROUPS = [
  ["נתיבות", "שדרות", "באר שבע", "אופקים"],
  ["תל אביב", "רמת גן", "גבעתיים", "בני ברק", "חולון", "בת ים", "ראשון לציון"],
  ["ירושלים", "בית שמש", "ביתר עילית"],
  ["חיפה", "קריית אתא", "קריית מוצקין", "נהריה", "עכו"],
  ["אשדוד", "אשקלון", "קריית גת"]
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET") {
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");
      const verifyToken = await env.VERIFY_TOKEN.get();

      if (mode === "subscribe" && token === verifyToken) {
        return new Response(challenge, { status: 200 });
      }

      return new Response("OREF WhatsApp Worker is running", { status: 200 });
    }

    if (request.method === "POST") {
      try {
        const body = await request.json();
        console.log("WEBHOOK:", JSON.stringify(body));

        const value = body.entry?.[0]?.changes?.[0]?.value;
        const phoneNumberId = value?.metadata?.phone_number_id;
        const message = value?.messages?.[0];
        const from = message?.from;
        const firstName = value?.contacts?.[0]?.profile?.name || "משתמש";

        if (!message || !from || !phoneNumberId) {
          return new Response("OK", { status: 200 });
        }

        if (message.type === "text") {
          const text = (message.text?.body || "").trim();
          await handleWhatsAppText(phoneNumberId, from, text, firstName, env);
        }

        if (message.type === "interactive") {
          await handleWhatsAppInteractive(phoneNumberId, from, message.interactive, env);
        }

        return new Response("OK", { status: 200 });
      } catch (err) {
        console.error("Error processing webhook:", err?.message || err);
        return new Response("OK", { status: 200 });
      }
    }

    return new Response("Method not allowed", { status: 405 });
  }
};

async function handleWhatsAppText(phoneNumberId, from, text, firstName, env) {
  if (!text) return;

  const lowerText = text.toLowerCase().trim();
  const ADMIN_PHONE = "972533400219";

  // Admin approve volunteer
  if (from === ADMIN_PHONE && lowerText.startsWith("אשר ")) {
    const volunteerId = Number(lowerText.replace("אשר", "").trim());

    const vol = await env.DB.prepare(
      "SELECT * FROM volunteers WHERE id=?"
    ).bind(volunteerId).first();

    if (!vol) {
      return sendTxt(phoneNumberId, from, "לא נמצא מתנדב עם מספר זה.", env);
    }

    await env.DB.prepare(
      "UPDATE volunteers SET approved=1, rejected=0, approved_at=?, updated_at=? WHERE id=?"
    ).bind(nowIso(), nowIso(), volunteerId).run();

    await sendTxt(
      phoneNumberId,
      vol.phone,
      "🎉 בקשת ההתנדבות שלך אושרה!\n\nתודה שהצטרפת למערך המתנדבים.",
      env
    );

    return sendTxt(phoneNumberId, from, `✅ המתנדב ${vol.name} אושר בהצלחה.`, env);
  }

  // Admin reject volunteer
  if (from === ADMIN_PHONE && lowerText.startsWith("דחה ")) {
    const volunteerId = Number(lowerText.replace("דחה", "").trim());

    const vol = await env.DB.prepare(
      "SELECT * FROM volunteers WHERE id=?"
    ).bind(volunteerId).first();

    if (!vol) {
      return sendTxt(phoneNumberId, from, "לא נמצא מתנדב עם מספר זה.", env);
    }

    await env.DB.prepare(
      "UPDATE volunteers SET approved=0, rejected=1, updated_at=? WHERE id=?"
    ).bind(nowIso(), volunteerId).run();

    await sendTxt(
      phoneNumberId,
      vol.phone,
      "בקשת ההתנדבות שלך לא אושרה בשלב זה. תודה על הרצון הטוב.",
      env
    );

    return sendTxt(phoneNumberId, from, `❌ המתנדב ${vol.name} נדחה.`, env);
  }

  // Start volunteer signup
  if (lowerText === "הצטרפות") {
    await setSession(env, from, {
      volunteer_signup: true,
      step: "name",
      last_interaction: nowIso()
    });

    return sendTxt(
      phoneNumberId,
      from,
      "ברוכים הבאים למערך המתנדבים 🇮🇱\n\nמה שמך המלא?",
      env
    );
  }

  const session = await getSession(env, from);
  session.last_interaction = nowIso();

  // Volunteer signup flow
  if (session.volunteer_signup) {
    if (session.step === "name") {
      session.name = text.trim();
      session.step = "city";
      await setSession(env, from, session);

      return sendTxt(phoneNumberId, from, "באיזו עיר אתה גר?", env);
    }

    if (session.step === "city") {
      session.city = text.trim();
      session.step = "skills";
      await setSession(env, from, session);

      return sendVolunteerSkillsList(phoneNumberId, from, env);
    }

    if (session.step === "skills") {
      const skillsText = text.trim();

      const existing = await env.DB.prepare(
        "SELECT * FROM volunteers WHERE phone=?"
      ).bind(from).first();

      if (existing) {
        await env.DB.prepare(
          "UPDATE volunteers SET name=?, city=?, skills=?, approved=0, rejected=0, available=1, updated_at=? WHERE phone=?"
        ).bind(
          session.name,
          session.city,
          JSON.stringify([skillsText]),
          nowIso(),
          from
        ).run();

        await clearSession(env, from);

        await sendTxt(
          phoneNumberId,
          from,
          "תודה! הפרטים שלך עודכנו ונשלחו שוב לאישור.",
          env
        );

        return sendTxt(
          phoneNumberId,
          ADMIN_PHONE,
          `🆕 בקשת התנדבות עודכנה\n\n#${existing.id}\nשם: ${session.name}\nעיר: ${session.city}\nטלפון: ${from}\nתחום: ${skillsText}\n\nלאישור כתוב:\nאשר ${existing.id}\n\nלדחייה כתוב:\nדחה ${existing.id}`,
          env
        );
      }

      const result = await env.DB.prepare(`
        INSERT INTO volunteers
        (name, phone, city, skills, approved, rejected, available, assignment_count, created_at)
        VALUES (?, ?, ?, ?, 0, 0, 1, 0, ?)
      `).bind(
        session.name,
        from,
        session.city,
        JSON.stringify([skillsText]),
        nowIso()
      ).run();

      const volunteerId = result.meta.last_row_id;

      await clearSession(env, from);

      await sendTxt(
        phoneNumberId,
        from,
        "תודה! בקשת ההתנדבות שלך נשלחה לאישור.",
        env
      );

      return sendTxt(
        phoneNumberId,
        ADMIN_PHONE,
        `🆕 מתנדב חדש\n\n#${volunteerId}\nשם: ${session.name}\nעיר: ${session.city}\nטלפון: ${from}\nתחום: ${skillsText}\n\nלאישור כתוב:\nאשר ${volunteerId}\n\nלדחייה כתוב:\nדחה ${volunteerId}`,
        env
      );
    }
  }

  if (lowerText === "ביטול" || lowerText === "/cancel") {
    await clearSession(env, from);
    await env.DB.prepare(
      "UPDATE requests SET status='cancelled', updated_at=? WHERE phone=? AND status IN ('searching','assigned')"
    ).bind(nowIso(), from).run();

    return sendTxt(phoneNumberId, from, "הבקשה הפעילה שלכם בוטלה בהצלחה.", env);
  }

  if (lowerText === "/start" || lowerText === "start" || lowerText === "התחל") {
    await clearSession(env, from);
    return sendTxt(
      phoneNumberId,
      from,
      `שלום ${firstName}! 👋\n\nאני בוט עזרה למשפחות מילואימניקים.\n\nלהצטרפות כמתנדב כתבו: הצטרפות\n\nאו כתבו לי בהודעה חופשית מה אתם צריכים.`,
      env
    );
  }

  if (isSmallTalk(text)) {
    await clearSession(env, from);
    return sendTxt(
      phoneNumberId,
      from,
      `שלום ${firstName}! 👋\n\nלהצטרפות כמתנדב כתבו: הצטרפות\n\nלבקשת עזרה כתבו מה אתם צריכים.`,
      env
    );
  }

  if (session.awaiting_city) {
    const city = extractCity(text);

    if (!city) {
      return sendTxt(
        phoneNumberId,
        from,
        "לא הצלחתי לזהות עיר. כתבו את שם העיר במפורש, למשל: תל אביב, באר שבע, ירושלים, נתיבות.",
        env
      );
    }

    session.pending_city = city;
    session.awaiting_city = false;
    session.pending_phone = from;

    await setSession(env, from, session);

    return sendUrgencyList(phoneNumberId, from, session.pending_category, city, env);
  }

  const category = await classifyWithAI(env, text);
  const city = extractCity(text);

  await setSession(env, from, {
    pending_name: firstName,
    pending_description: text,
    suggested_category: category,
    pending_phone: from,
    pending_city: city || undefined,
    awaiting_category_confirm: true,
    awaiting_city: false,
    last_interaction: nowIso()
  });

  return sendCategoryConfirmButtons(phoneNumberId, from, category, env);
}
async function handleWhatsAppInteractive(phoneNumberId, from, interactive, env) {
  if (interactive.type === "button_reply") {
    const buttonId = interactive.button_reply.id;

    if (buttonId === "confirm_category_yes") {
      const session = await getSession(env, from);
      session.pending_category = session.suggested_category || "general";
      session.awaiting_category_confirm = false;

      if (!session.pending_city) {
        session.awaiting_city = true;
        await setSession(env, from, session);
        return sendTxt(phoneNumberId, from, "באיזו עיר אתם נמצאים?", env);
      }

      await setSession(env, from, session);
      return sendUrgencyList(phoneNumberId, from, session.pending_category, session.pending_city, env);
    }

    if (buttonId === "confirm_category_no") {
      const session = await getSession(env, from);
      session.awaiting_category_confirm = false;
      session.awaiting_manual_category = true;
      await setSession(env, from, session);

      return sendCategoryList(phoneNumberId, from, env);
    }

    const parts = buttonId.split("_");
    if (parts.length < 3) return;

    const [action, requestId, volunteerId] = parts;

    const req = await env.DB.prepare("SELECT * FROM requests WHERE id=?").bind(requestId).first();
    const vol = await env.DB.prepare("SELECT * FROM volunteers WHERE id=?").bind(Number(volunteerId)).first();

    if (!req || !vol) {
      return sendTxt(phoneNumberId, from, "❌ הבקשה או המתנדב לא נמצאו במערכת.", env);
    }

    if (action === "accept") {
      if (req.status === "assigned") {
        return sendTxt(phoneNumberId, from, "בקשה זו כבר שויכה למתנדב אחר. תודה על הרצון הטוב! 💙", env);
      }

      const assigned = JSON.stringify({
        id: vol.id,
        name: vol.name,
        phone: vol.phone,
        city: vol.city,
        assigned_at: nowIso()
      });

      await env.DB.prepare(
        "UPDATE requests SET status='assigned', assigned_volunteer=?, assigned_at=? WHERE id=?"
      ).bind(assigned, nowIso(), requestId).run();

      await env.DB.prepare(
        "UPDATE volunteers SET assignment_count=assignment_count+1, last_response_time=? WHERE id=?"
      ).bind(nowIso(), vol.id).run();

      await sendTxt(
        phoneNumberId,
        vol.phone,
        `✅ *תודה רבה! הבקשה שויכה אליך.*\n\n*פרטי המשפחה:*\nשם: ${req.name}\nטלפון: ${req.phone}\nעיר: ${req.city}\nתיאור: ${req.description}`,
        env
      );

      await sendTxt(
        phoneNumberId,
        req.phone,
        `🎉 בשורות טובות! נמצא מתנדב לבקשתכם (${req.id}). המתנדב ${vol.name} ייצור עמכם קשר בהקדם.`,
        env
      );
    }

    if (action === "reject") {
      await env.DB.prepare(
        "UPDATE volunteers SET available=0, updated_at=? WHERE id=?"
      ).bind(nowIso(), vol.id).run();

      return sendTxt(phoneNumberId, from, `אין בעיה, ${vol.name}. סומנת כלא זמין זמנית.`, env);
    }
  }

  if (interactive.type === "list_reply") {
    const selectedId = interactive.list_reply.id;

    if (selectedId.startsWith("cat_")) {
      const category = selectedId.replace("cat_", "");
      const session = await getSession(env, from);

      session.pending_category = category;
      session.awaiting_manual_category = false;

      if (!session.pending_city) {
        session.awaiting_city = true;
        await setSession(env, from, session);
        return sendTxt(phoneNumberId, from, "באיזו עיר אתם נמצאים?", env);
      }

      await setSession(env, from, session);
      return sendUrgencyList(phoneNumberId, from, category, session.pending_city, env);
    }

    const urgency = selectedId;
    const session = await getSession(env, from);

    if (!session.pending_description) {
      return sendTxt(phoneNumberId, from, "הפנייה לא נמצאה במערכת. נא לתאר שוב מה אתם צריכים.", env);
    }

    const req = await createRequest(env, session, urgency);
    await clearSession(env, from);

    const volunteers = await findVolunteers(env, req.city, req.category);

    if (!volunteers.length) {
      return sendTxt(
        phoneNumberId,
        from,
        `${URGENCY_EMOJI[urgency] || "📋"} בקשתך התקבלה בהצלחה.\n\nמספר בקשה: ${req.id}\nאין כרגע מתנדבים זמינים בעיר שלך בתחום זה.`,
        env
      );
    }

    let notified = 0;

    for (const v of volunteers) {
      const msgForVolunteer =
        `${URGENCY_EMOJI[urgency]} *בקשת עזרה חדשה!* (${URGENCY_HEBREW[urgency]})\n\n` +
        `משפחה באזור *${req.city}* צריכה עזרה בתחום *${CATEGORY_HEBREW[req.category] || req.category}*.\n\n` +
        `*תיאור:* ${req.description}`;

      const ok = await sendButtons(phoneNumberId, v.phone, msgForVolunteer, [
        { id: `accept_${req.id}_${v.id}`, title: "✅ אני יכול לעזור" },
        { id: `reject_${req.id}_${v.id}`, title: "❌ לא זמין כעת" }
      ], env);

      if (ok) notified++;
    }

    return sendTxt(
      phoneNumberId,
      from,
      `${URGENCY_EMOJI[urgency]} בקשתך התקבלה ונרשמה.\n\nמספר: ${req.id}\nסוג: ${CATEGORY_HEBREW[req.category] || req.category}\nעיר: ${req.city}\nדחיפות: ${URGENCY_HEBREW[urgency]}\n\nשלחנו התראה ל-${notified} מתנדבים.`,
      env
    );
  }
}

async function sendCategoryConfirmButtons(phoneNumberId, to, category, env) {
  return sendButtons(
    phoneNumberId,
    to,
    `זיהיתי שסוג העזרה הוא: *${CATEGORY_HEBREW[category] || category}*.\n\nהאם זה סוג העזרה שהתכוונת אליו?`,
    [
      { id: "confirm_category_yes", title: "✅ כן" },
      { id: "confirm_category_no", title: "❌ לא" }
    ],
    env
  );
}
async function sendVolunteerSkillsList(phoneNumberId, to, env) {
  const token = await env.WHATSAPP_TOKEN.get();

  const rows = Object.entries(VOLUNTEER_SKILLS).map(([id, title]) => ({
    id: `volskill_${id}`,
    title: title.slice(0, 24)
  }));

  const res = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "list",
        header: { type: "text", text: "תחום התנדבות" },
        body: { text: "בחר את תחום ההתנדבות המרכזי שלך:" },
        action: {
          button: "בחר תחום",
          sections: [{ title: "תחומי התנדבות", rows }]
        }
      }
    })
  });

  const result = await res.text();
  console.log("sendVolunteerSkillsList status:", res.status);
  console.log("sendVolunteerSkillsList result:", result);

  return res.ok;
}
async function sendCategoryList(phoneNumberId, to, env) {
  const token = await env.WHATSAPP_TOKEN.get();

  const allowedCategories = [
    "plumbing",
    "electricity",
    "air_conditioning",
    "transportation",
    "childcare",
    "food",
    "medical",
    "errands",
    "household",
    "general"
  ];

  const rows = allowedCategories.map((id) => ({
    id: `cat_${id}`,
    title: CATEGORY_HEBREW[id].slice(0, 24)
  }));

  const res = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "list",
        header: { type: "text", text: "בחירת סוג עזרה" },
        body: { text: "בחרו את סוג העזרה המתאים מהרשימה:" },
        action: {
          button: "בחר סוג",
          sections: [{ title: "סוגי עזרה", rows }]
        }
      }
    })
  });

  const result = await res.text();
  console.log("sendCategoryList status:", res.status);
  console.log("sendCategoryList result:", result);

  return res.ok;
}

async function sendTxt(phoneNumberId, to, text, env) {
  const token = await env.WHATSAPP_TOKEN.get();

  const res = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text }
    })
  });

  const result = await res.text();
  console.log("sendTxt status:", res.status);
  console.log("sendTxt result:", result);

  return res.ok;
}

async function sendUrgencyList(phoneNumberId, to, category, city, env) {
  const token = await env.WHATSAPP_TOKEN.get();

  const res = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "list",
        header: { type: "text", text: "שלב אחרון!" },
        body: {
          text: `סוג עזרה: *${CATEGORY_HEBREW[category] || category}*\nעיר: *${city}*\n\nמה רמת הדחיפות של הבקשה?`
        },
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

  const result = await res.text();
  console.log("sendUrgencyList status:", res.status);
  console.log("sendUrgencyList result:", result);

  return res.ok;
}

async function sendButtons(phoneNumberId, to, text, buttons, env) {
  const token = await env.WHATSAPP_TOKEN.get();

  const whatsappButtons = buttons.map((b) => ({
    type: "reply",
    reply: { id: b.id, title: b.title }
  }));

  const res = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text },
        action: { buttons: whatsappButtons }
      }
    })
  });

  const result = await res.text();
  console.log("sendButtons status:", res.status);
  console.log("sendButtons result:", result);

  return res.ok;
}

async function createRequest(env, session, urgency) {
  const id = crypto.randomUUID().replaceAll("-", "").slice(0, 8);

  const req = {
    id,
    name: session.pending_name || "משתמש",
    phone: session.pending_phone,
    city: session.pending_city,
    description: session.pending_description,
    category: session.pending_category || "general",
    urgency,
    status: "searching",
    created_at: nowIso()
  };

  await env.DB.prepare(
    "INSERT INTO requests (id,name,phone,city,description,category,urgency,status,created_at) VALUES (?,?,?,?,?,?,?,?,?)"
  ).bind(
    req.id,
    req.name,
    req.phone,
    req.city,
    req.description,
    req.category,
    req.urgency,
    req.status,
    req.created_at
  ).run();

  return req;
}

async function findVolunteers(env, city, category) {
  const rows = await env.DB.prepare(
    "SELECT * FROM volunteers WHERE approved=1 AND available=1"
  ).all();

  const nearby = nearbyCities(city);

  return rows.results
    .map((v) => ({ ...v, skillsArr: JSON.parse(v.skills || "[]") }))
    .filter((v) => v.city === city || nearby.includes(v.city))
    .filter((v) => category === "general" || v.skillsArr.includes(category) || v.skillsArr.includes("general"))
    .slice(0, 5);
}

function nearbyCities(city) {
  const group = CITY_GROUPS.find((x) => x.includes(city));
  return group ? group.filter((x) => x !== city) : [];
}

function classify(text) {
  const t = text.toLowerCase();
  let best = "general";
  let bestScore = 0;

  for (const [cat, words] of Object.entries(KEYWORDS)) {
    const score = words.filter((w) => t.includes(w)).length;
    if (score > bestScore) {
      best = cat;
      bestScore = score;
    }
  }

  return best;
}

function extractCity(text) {
  return CITIES.sort((a, b) => b.length - a.length).find((c) => text.includes(c)) || null;
}

function isSmallTalk(text) {
  const t = text.toLowerCase().trim();
  return ["שלום", "היי", "הי", "אהלן", "תודה", "מה נשמע", "מה קורה", "עזרה"].includes(t) || t.length < 3;
}

function nowIso() {
  return new Date().toISOString();
}

async function getSession(env, chatId) {
  const row = await env.DB.prepare("SELECT data FROM sessions WHERE chat_id=?").bind(chatId).first();
  return row ? JSON.parse(row.data) : {};
}

async function setSession(env, chatId, data) {
  await env.DB.prepare(
    "INSERT OR REPLACE INTO sessions (chat_id,data,updated_at) VALUES (?,?,?)"
  ).bind(chatId, JSON.stringify(data), nowIso()).run();
}

async function clearSession(env, chatId) {
  await env.DB.prepare("DELETE FROM sessions WHERE chat_id=?").bind(chatId).run();
}
async function classifyWithAI(env, text) {
  try {
    const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      temperature: 0,
      max_tokens: 8,
      messages: [
        {
          role: "system",
          content:
            "You are a strict text classifier. Return exactly one category key and nothing else. Allowed categories: plumbing, electricity, air_conditioning, transportation, childcare, food, medical, errands, household, emotional, tutoring, general. Do not explain. Do not answer the user. Output only one allowed category key."
        },
        {
          role: "user",
          content:
            `Classify this Hebrew help request into exactly one allowed category.\n\nRequest: ${text}\n\nCategory:`
        }
      ]
    });

    console.log("AI raw result:", JSON.stringify(result));

    const raw = String(result.response || "").trim().toLowerCase();
    const category = raw
      .replace(/```/g, "")
      .replace(/[^a-z_]/g, "")
      .trim();

    console.log("AI category:", category);

    if (CATEGORY_HEBREW[category]) {
      return category;
    }

    return classify(text);
  } catch (err) {
    console.error("AI classify error:", err?.message || err);
    return classify(text);
  }
}
