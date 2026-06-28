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

const CATEGORY_HEBREW = VOLUNTEER_SKILLS;

const SKILLS_PER_PAGE = 9;
const VOLUNTEER_SKILL_ENTRIES = Object.entries(VOLUNTEER_SKILLS);
const VOLUNTEER_SKILL_PAGES = [];
for (let i = 0; i < VOLUNTEER_SKILL_ENTRIES.length; i += SKILLS_PER_PAGE) {
  VOLUNTEER_SKILL_PAGES.push(VOLUNTEER_SKILL_ENTRIES.slice(i, i + SKILLS_PER_PAGE));
}

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
  emotional: ["לדבר", "שיחה", "תמיכה", "בודדה", "קשה לי", "לחץ", "חרדה", "פחד", "עידוד", "אוזן קשבת"]
};

const CITIES = [
  "תל אביב", "ירושלים", "חיפה", "באר שבע", "אשדוד", "הרצליה", "נתניה", "רמת גן",
  "פתח תקווה", "בני ברק", "חולון", "ראשון לציון", "אשקלון", "עפולה", "כפר סבא",
  "בת ים", "ראש העין", "מודיעין", "לוד", "רעננה", "רהט", "בית שמש", "טבריה",
  "עכו", "נצרת", "דימונה", "שדרות", "נתיבות", "ביתר עילית", "גבעתיים",
  "כרמיאל", "נהריה", "קריית גת", "חדרה", "יבנה", "אופקים",
  "קריית אתא", "קריית מוצקין", "קריית ים", "קריית ביאליק", "קריית שמונה",
  "קריית מלאכי", "קריית אונו", "אילת", "צפת", "מעלות תרשיחא", "קצרין",
  "אור יהודה", "גן יבנה", "נשר", "טירת כרמל", "זכרון יעקב", "בנימינה",
  "פרדס חנה כרכור", "אריאל", "מעלה אדומים", "אלעד", "טבעון", "יקנעם",
  "מגדל העמק", "נוף הגליל", "סח'נין", "שפרעם", "אום אל פחם",
  "באקה אל גרבייה", "טייבה", "טירה", "כפר קאסם", "ערד", "מצפה רמון",
  "אבן יהודה", "כוכב יאיר", "הוד השרון", "אבו גוש", "מבשרת ציון",
  "גבעת שמואל", "אור עקיבא", "בית שאן", "עמק חפר", "משגב", "מטולה"
];

const CITY_ALIASES = {
  "ת\"א": "תל אביב",
  "תא": "תל אביב",
  "ב\"ש": "באר שבע",
  "בש": "באר שבע",
  "פ\"ת": "פתח תקווה",
  "פת": "פתח תקווה",
  "ירושלים עיר העתיקה": "ירושלים",
  "רמת השרון": "הרצליה"
};

const CITY_GROUPS = [
  ["נתיבות", "שדרות", "באר שבע", "אופקים"],
  ["תל אביב", "רמת גן", "גבעתיים", "בני ברק", "חולון", "בת ים", "ראשון לציון", "הרצליה"],
  ["ירושלים", "בית שמש", "ביתר עילית", "מעלה אדומים", "מבשרת ציון", "אבו גוש"],
  ["חיפה", "קריית אתא", "קריית מוצקין", "נהריה", "עכו", "קריית ים", "קריית ביאליק", "נשר", "טירת כרמל"],
  ["אשדוד", "אשקלון", "קריית גת", "קריית מלאכי"],
  ["נתניה", "כפר סבא", "רעננה", "הוד השרון", "כוכב יאיר", "אבן יהודה"],
  ["צפת", "קריית שמונה", "מטולה", "מעלות תרשיחא"],
  ["טבריה", "עפולה", "מגדל העמק", "נוף הגליל", "יקנעם", "בית שאן"]
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/requests") {
      const result = await env.DB.prepare(`
        SELECT *
        FROM requests
        ORDER BY created_at DESC
      `).all();

      return Response.json(result.results || []);
    }

    if (request.method === "GET" && url.pathname === "/api/volunteers") {
      const result = await env.DB.prepare(`
        SELECT *
        FROM volunteers
        ORDER BY created_at DESC
      `).all();

      return Response.json(result.results || []);
    }

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
  const ADMIN_PHONE = env.ADMIN_PHONE || "972533400219";

  if (from === ADMIN_PHONE && lowerText.startsWith("אשר ")) {
    const volunteerId = Number(lowerText.replace("אשר", "").trim());

    const vol = await env.DB.prepare(
      "SELECT * FROM volunteers WHERE id=?"
    ).bind(volunteerId).first();

    if (!vol) {
      return sendTxt(phoneNumberId, from, "לא נמצא בעל מקצוע עם מספר זה במערכת.", env);
    }

    await env.DB.prepare(
      "UPDATE volunteers SET approved=1, rejected=0, approved_at=?, updated_at=? WHERE id=?"
    ).bind(nowIso(), nowIso(), volunteerId).run();

    await sendTxt(
      phoneNumberId,
      vol.phone,
      "🎉 בקשתך אושרה!\n\nאתה עכשיו חלק ממערך בעלי המקצוע של OREF, שעומד לצד משפחות המילואימניקים בזמן השירות. תודה שבחרת לקחת חלק.",
      env
    );

    return sendTxt(phoneNumberId, from, `✅ ${vol.name} אושר ומצטרף למערך.`, env);
  }

  if (from === ADMIN_PHONE && lowerText.startsWith("דחה ")) {
    const volunteerId = Number(lowerText.replace("דחה", "").trim());

    const vol = await env.DB.prepare(
      "SELECT * FROM volunteers WHERE id=?"
    ).bind(volunteerId).first();

    if (!vol) {
      return sendTxt(phoneNumberId, from, "לא נמצא בעל מקצוע עם מספר זה במערכת.", env);
    }

    await env.DB.prepare(
      "UPDATE volunteers SET approved=0, rejected=1, updated_at=? WHERE id=?"
    ).bind(nowIso(), volunteerId).run();

    await sendTxt(
      phoneNumberId,
      vol.phone,
      "תודה שפנית להצטרף למערך בעלי המקצוע של OREF. בשלב זה לא נוכל לאשר את הבקשה, אך אנו מעריכים מאוד את הרצון שלך לעזור למשפחות המילואימניקים.",
      env
    );

    return sendTxt(phoneNumberId, from, `❌ ${vol.name} נדחה.`, env);
  }
  
  if (from === ADMIN_PHONE && (lowerText === "מתנדבים" || lowerText === "/volunteers")) {
  const volunteersText = await getVolunteersText(env);
  return sendTxt(phoneNumberId, from, volunteersText, env);
  }
  
  if (from === ADMIN_PHONE && (lowerText === "סטטיסטיקה" || lowerText === "/stats" || lowerText === "סטטיסטיקות")) {
    const statsText = await getStatsText(env);
    return sendTxt(phoneNumberId, from, statsText, env);
  }

  if (lowerText === "הצטרפות") {
    await setSession(env, from, {
      volunteer_signup: true,
      step: "name",
      skills: [],
      last_interaction: nowIso()
    });

    return sendTxt(
      phoneNumberId,
      from,
      "ברוכים הבאים למערך בעלי המקצוע של OREF 🇮🇱\n\nאתם עומדים לקחת חלק ממשי בעורף הביתי ולעמוד לצד משפחות שבן או בת הזוג שלהן משרתים במילואים.\n\nכדי להתחיל, מה שמך המלא?",
      env
    );
  }

  const session = await getSession(env, from);
  session.last_interaction = nowIso();

  if (session.volunteer_signup) {
    if (session.step === "name") {
      session.name = text.trim();
      session.step = "city";
      await setSession(env, from, session);

      return sendTxt(
        phoneNumberId,
        from,
        "מעולה. באיזו עיר אתה נמצא?\n\nאנא כתוב שם עיר מוכר בלבד, למשל: נתיבות, באר שבע, ירושלים או חיפה.",
        env
      );
    }

    if (session.step === "city") {
      const matchedCity = extractCity(text.trim());

      if (!matchedCity) {
        return sendTxt(
          phoneNumberId,
          from,
          "לא הצלחתי לזהות את העיר.\n\nאנא כתוב שם עיר מוכר בלבד, למשל: נתיבות, באר שבע, ירושלים או חיפה.",
          env
        );
      }

      session.city = matchedCity;
      session.step = "skills";
      session.skills = [];
      await setSession(env, from, session);

      return sendVolunteerSkillsList(phoneNumberId, from, env, 0);
    }

    if (session.step === "skills") {
      return sendTxt(
        phoneNumberId,
        from,
        "כדי לבחור תחומי עזרה, השתמש ברשימה שנשלחה אליך.\n\nלאחר כל בחירה תוכל להוסיף תחום נוסף או ללחוץ: סיימתי.",
        env
      );
    }
  }

  if (lowerText === "ביטול" || lowerText === "/cancel") {
    await clearSession(env, from);

    await env.DB.prepare(
      "UPDATE requests SET status='cancelled', updated_at=? WHERE phone=? AND status IN ('searching','assigned')"
    ).bind(nowIso(), from).run();

    return sendTxt(phoneNumberId, from, "הבקשה הפעילה שלכם בוטלה. אנחנו כאן בכל עת שתצטרכו.", env);
  }

  if (lowerText === "/start" || lowerText === "start" || lowerText === "התחל") {
    await clearSession(env, from);

    return sendTxt(
      phoneNumberId,
      from,
      `שלום ${firstName} 👋\n\nכאן OREF — אנחנו כאן בשבילך ובשביל המשפחה, בזמן ששירות המילואים ממשיך.\n\nכתבו בהודעה חופשית מה אתם צריכים, ונדאג למצוא בעל מקצוע מתאים בקרבת מקום.\n\nרוצים לעזור כבעלי מקצוע למשפחות אחרות? כתבו: הצטרפות`,
      env
    );
  }

  if (isSmallTalk(text)) {
    await clearSession(env, from);

    return sendTxt(
      phoneNumberId,
      from,
      `שלום ${firstName} 👋\n\nכאן OREF — אנחנו כאן בשבילך ובשביל המשפחה, בזמן ששירות המילואים ממשיך.\n\nכתבו בהודעה חופשית מה אתם צריכים, ונדאג למצוא בעל מקצוע מתאים בקרבת מקום.\n\nרוצים לעזור כבעלי מקצוע למשפחות אחרות? כתבו: הצטרפות`,
      env
    );
  }

  if (session.awaiting_city) {
    const city = extractCity(text);

    if (!city) {
      return sendTxt(
        phoneNumberId,
        from,
        "לא הצלחתי לזהות את העיר.\n\nאנא כתבו שם עיר מוכר בלבד, למשל: נתיבות, באר שבע, ירושלים או חיפה.",
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
  const ADMIN_PHONE = env.ADMIN_PHONE || "972533400219";

  if (interactive.type === "button_reply") {
    const buttonId = interactive.button_reply.id;

    if (buttonId === "confirm_category_yes") {
      const session = await getSession(env, from);
      session.pending_category = session.suggested_category || "general";
      session.awaiting_category_confirm = false;

      if (!session.pending_city) {
        session.awaiting_city = true;
        await setSession(env, from, session);

        return sendTxt(
          phoneNumberId,
          from,
          "באיזו עיר אתם נמצאים?\n\nאנא כתבו שם עיר מוכר בלבד, למשל: נתיבות, באר שבע, ירושלים או חיפה.",
          env
        );
      }

      await setSession(env, from, session);
      return sendUrgencyList(phoneNumberId, from, session.pending_category, session.pending_city, env);
    }

    if (buttonId === "confirm_category_no") {
      await clearSession(env, from);

      return sendTxt(
        phoneNumberId,
        from,
        "אין בעיה 👍\n\nכתבו שוב, בקצרה, מה אתם צריכים — לדוגמה:\nיש נזילה במטבח בנתיבות\nאו:\nצריך הסעה לבית חולים מנתיבות",
        env
      );
    }

    if (buttonId === "add_more_skills") {
      const session = await getSession(env, from);

      if (!session.volunteer_signup || session.step !== "skills") {
        return sendTxt(phoneNumberId, from, "לא נמצאה הרשמה פעילה. כתבו: הצטרפות, כדי להתחיל.", env);
      }

      return sendVolunteerSkillsList(phoneNumberId, from, env, 0);
    }

    if (buttonId === "finish_skills") {
      const session = await getSession(env, from);

      if (!session.volunteer_signup || session.step !== "skills") {
        return sendTxt(phoneNumberId, from, "לא נמצאה הרשמה פעילה. כתבו: הצטרפות, כדי להתחיל.", env);
      }

      if (!session.skills || !session.skills.length) {
        return sendTxt(phoneNumberId, from, "יש לבחור לפחות תחום אחד כדי להשלים את ההצטרפות.", env);
      }

      const skillsText = session.skills.map((s) => VOLUNTEER_SKILLS[s] || s).join(", ");

      const existing = await env.DB.prepare(
        "SELECT * FROM volunteers WHERE phone=?"
      ).bind(from).first();

      if (existing) {
        await env.DB.prepare(
          "UPDATE volunteers SET name=?, city=?, skills=?, approved=0, rejected=0, available=1, updated_at=? WHERE phone=?"
        ).bind(
          session.name,
          session.city,
          JSON.stringify(session.skills),
          nowIso(),
          from
        ).run();

        await clearSession(env, from);

        await sendTxt(
          phoneNumberId,
          from,
          "תודה! הפרטים שלך עודכנו ונשלחו לאישור מחדש. נעדכן אותך בקרוב.",
          env
        );

        return sendTxt(
          phoneNumberId,
          ADMIN_PHONE,
          `🆕 פרטי בעל מקצוע עודכנו\n\n#${existing.id}\nשם: ${session.name}\nעיר: ${session.city}\nטלפון: ${from}\nתחומים: ${skillsText}\n\nלאישור כתוב:\nאשר ${existing.id}\n\nלדחייה כתוב:\nדחה ${existing.id}`,
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
        JSON.stringify(session.skills),
        nowIso()
      ).run();

      const volunteerId = result.meta.last_row_id;

      await clearSession(env, from);

      await sendTxt(
        phoneNumberId,
        from,
        "תודה שהצטרפת! הבקשה שלך נשלחה לאישור, ונחזור אליך בקרוב כדי לצרף אותך רשמית למערך.",
        env
      );

      return sendTxt(
        phoneNumberId,
        ADMIN_PHONE,
        `🆕 בעל מקצוע חדש מבקש להצטרף\n\n#${volunteerId}\nשם: ${session.name}\nעיר: ${session.city}\nטלפון: ${from}\nתחומים: ${skillsText}\n\nלאישור כתוב:\nאשר ${volunteerId}\n\nלדחייה כתוב:\nדחה ${volunteerId}`,
        env
      );
    }

    const parts = buttonId.split("_");
    if (parts.length < 3) return;

    const [action, requestId, volunteerId] = parts;

    const req = await env.DB.prepare("SELECT * FROM requests WHERE id=?").bind(requestId).first();
    const vol = await env.DB.prepare("SELECT * FROM volunteers WHERE id=?").bind(Number(volunteerId)).first();

    if (!req || !vol) {
      return sendTxt(phoneNumberId, from, "❌ הבקשה או בעל המקצוע לא נמצאו במערכת.", env);
    }

    if (action === "accept") {
      if (req.status === "assigned") {
        return sendTxt(phoneNumberId, from, "תודה רבה על הנכונות לעזור — בקשה זו כבר שויכה לבעל מקצוע אחר. 💙", env);
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
        `✅ *תודה רבה — הבקשה שויכה אליך.*\n\nמשפחה שמישהו ממנה משרת במילואים זקוקה לעזרתך. הנה הפרטים:\n\nשם: ${req.name}\nטלפון: ${req.phone}\nעיר: ${req.city}\nתיאור: ${req.description}\n\nניתן ליצור קשר ישירות.`,
        env
      );

      await sendTxt(
        phoneNumberId,
        req.phone,
        `🎉 בשורות טובות! מצאנו בעל מקצוע לבקשתכם (${req.id}).\n\n${vol.name} ייצור עמכם קשר בהקדם.`,
        env
      );
    }

    if (action === "reject") {
      await env.DB.prepare(
        "UPDATE volunteers SET available=0, updated_at=? WHERE id=?"
      ).bind(nowIso(), vol.id).run();

      return sendTxt(phoneNumberId, from, `אין בעיה, ${vol.name} — סומנת כלא זמין כרגע, ונפנה אליך בפעם הבאה.`, env);
    }
  }

  if (interactive.type === "list_reply") {
    const selectedId = interactive.list_reply.id;

    if (selectedId.startsWith("volskill_more_")) {
      const nextPage = Number(selectedId.replace("volskill_more_", ""));
      return sendVolunteerSkillsList(phoneNumberId, from, env, nextPage);
    }

    if (selectedId.startsWith("volskill_")) {
      const skill = selectedId.replace(/^volskill_p\d+_/, "");
      const session = await getSession(env, from);

      if (!session.volunteer_signup || session.step !== "skills") {
        return sendTxt(phoneNumberId, from, "לא נמצאה הרשמה פעילה. כתבו: הצטרפות, כדי להתחיל.", env);
      }

      if (!VOLUNTEER_SKILLS[skill]) {
        return sendTxt(phoneNumberId, from, "התחום שנבחר לא תקין. נסה לבחור שוב מהרשימה.", env);
      }

      session.skills = session.skills || [];

      if (!session.skills.includes(skill)) {
        session.skills.push(skill);
      }

      await setSession(env, from, session);

      const selectedSkillsText = session.skills.map((s) => VOLUNTEER_SKILLS[s] || s).join(", ");

      return sendButtons(
        phoneNumberId,
        from,
        `הוספתי: ${VOLUNTEER_SKILLS[skill]}\n\nהתחומים שבחרת עד עכשיו:\n${selectedSkillsText}\n\nרוצה להוסיף תחום נוסף?`,
        [
          { id: "add_more_skills", title: "➕ להוסיף עוד" },
          { id: "finish_skills", title: "✅ סיימתי" }
        ],
        env
      );
    }

    const urgency = selectedId;
    const session = await getSession(env, from);

    if (!["low", "medium", "high", "critical"].includes(urgency)) {
      return sendTxt(phoneNumberId, from, "בחירת הדחיפות לא תקינה. אפשר להתחיל מחדש ולתאר את הבקשה.", env);
    }

    if (!session.pending_description) {
      return sendTxt(phoneNumberId, from, "לא מצאנו את הפנייה במערכת. אפשר לתאר שוב, בקצרה, מה אתם צריכים.", env);
    }

    const req = await createRequest(env, session, urgency);
    await clearSession(env, from);

    const volunteers = await findVolunteers(env, req.city, req.category);

    if (!volunteers.length) {
      return sendTxt(
        phoneNumberId,
        from,
        `${URGENCY_EMOJI[urgency] || "📋"} הבקשה שלכם התקבלה.\n\nמספר בקשה: ${req.id}\nכרגע אין בעל מקצוע פנוי בתחום זה באזורכם, אך הבקשה נשארת פתוחה ונעדכן אתכם ברגע שיימצא מישהו.`,
        env
      );
    }

    let notified = 0;

    for (const v of volunteers) {
      const msgForVolunteer =
        `${URGENCY_EMOJI[urgency]} *בקשת עזרה ממשפחת מילואימניק* (${URGENCY_HEBREW[urgency]})\n\n` +
        `משפחה באזור *${req.city}* זקוקה לעזרה בתחום *${CATEGORY_HEBREW[req.category] || req.category}*, בזמן ששירות המילואים ממשיך.\n\n` +
        `*תיאור:* ${req.description}`;

      const ok = await sendButtons(
        phoneNumberId,
        v.phone,
        msgForVolunteer,
        [
          { id: `accept_${req.id}_${v.id}`, title: "✅ אני יכול לעזור" },
          { id: `reject_${req.id}_${v.id}`, title: "❌ לא זמין כעת" }
        ],
        env
      );

      if (ok) notified++;
    }

    return sendTxt(
      phoneNumberId,
      from,
      `${URGENCY_EMOJI[urgency]} הבקשה שלכם התקבלה ונרשמה.\n\nמספר: ${req.id}\nסוג: ${CATEGORY_HEBREW[req.category] || req.category}\nעיר: ${req.city}\nדחיפות: ${URGENCY_HEBREW[urgency]}\n\nפנינו ל-${notified} בעלי מקצוע באזורכם, ונעדכן אתכם ברגע שמישהו יענה.`,
      env
    );
  }
}

async function sendCategoryConfirmButtons(phoneNumberId, to, category, env) {
  return sendButtons(
    phoneNumberId,
    to,
    `הבנתי שאתם צריכים עזרה בתחום: *${CATEGORY_HEBREW[category] || category}*.\n\nזה נכון?`,
    [
      { id: "confirm_category_yes", title: "✅ כן" },
      { id: "confirm_category_no", title: "❌ לא" }
    ],
    env
  );
}

async function sendVolunteerSkillsList(phoneNumberId, to, env, pageIndex = 0) {
  const token = await env.WHATSAPP_TOKEN.get();

  const page = VOLUNTEER_SKILL_PAGES[pageIndex] || VOLUNTEER_SKILL_PAGES[0];
  const hasNextPage = pageIndex + 1 < VOLUNTEER_SKILL_PAGES.length;

  const rows = page.map(([id, title]) => ({
    id: `volskill_p${pageIndex}_${id}`,
    title: title.slice(0, 24)
  }));

  if (hasNextPage) {
    rows.push({
      id: `volskill_more_${pageIndex + 1}`,
      title: "➡️ תחומים נוספים"
    });
  }

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
        header: { type: "text", text: "תחום מקצועי" },
        body: {
          text: hasNextPage
            ? "באיזה תחום תוכל לעזור למשפחות המילואימניקים? אפשר לבחור כמה תחומים — כל פעם תחום אחד."
            : "בחר תחום נוסף או סיים לאחר הבחירה."
        },
        action: {
          button: "בחר תחום",
          sections: [{ title: "תחומים מקצועיים", rows }]
        }
      }
    })
  });

  const result = await res.text();
  console.log("sendVolunteerSkillsList status:", res.status);
  console.log("sendVolunteerSkillsList result:", result);

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
        header: { type: "text", text: "שלב אחרון" },
        body: {
          text: `סוג עזרה: *${CATEGORY_HEBREW[category] || category}*\nעיר: *${city}*\n\nכמה דחוף זה בשבילכם?`
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

  return (rows.results || [])
    .map((v) => ({
      ...v,
      skillsArr: safeJsonArray(v.skills)
    }))
    .filter((v) => v.city === city || nearby.includes(v.city))
    .filter((v) => category === "general" || v.skillsArr.includes(category) || v.skillsArr.includes("general"))
    .slice(0, 5);
}

async function getStatsText(env) {
  const volunteerTotals = await env.DB.prepare(
    `SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN approved=1 THEN 1 ELSE 0 END) AS approved,
      SUM(CASE WHEN rejected=1 THEN 1 ELSE 0 END) AS rejected,
      SUM(CASE WHEN approved=0 AND rejected=0 THEN 1 ELSE 0 END) AS pending,
      SUM(CASE WHEN approved=1 AND available=1 THEN 1 ELSE 0 END) AS active
    FROM volunteers`
  ).first();

  const requestTotals = await env.DB.prepare(
    `SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN status='searching' THEN 1 ELSE 0 END) AS searching,
      SUM(CASE WHEN status='assigned' THEN 1 ELSE 0 END) AS assigned,
      SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END) AS cancelled
    FROM requests`
  ).first();

  return (
    `📊 *סטטיסטיקה כללית*\n\n` +
    `*בעלי מקצוע:*\n` +
    `סה"כ: ${volunteerTotals.total || 0}\n` +
    `מאושרים: ${volunteerTotals.approved || 0}\n` +
    `ממתינים לאישור: ${volunteerTotals.pending || 0}\n` +
    `נדחו: ${volunteerTotals.rejected || 0}\n` +
    `פעילים וזמינים כרגע: ${volunteerTotals.active || 0}\n\n` +
    `*בקשות עזרה ממשפחות:*\n` +
    `סה"כ: ${requestTotals.total || 0}\n` +
    `בחיפוש אחר בעל מקצוע: ${requestTotals.searching || 0}\n` +
    `שויכו לבעל מקצוע: ${requestTotals.assigned || 0}\n` +
    `בוטלו: ${requestTotals.cancelled || 0}`
  );
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
  const clean = text.trim();

  const direct = [...CITIES]
    .sort((a, b) => b.length - a.length)
    .find((c) => clean.includes(c));

  if (direct) return direct;

  for (const [alias, canonical] of Object.entries(CITY_ALIASES)) {
    if (clean.includes(alias)) return canonical;
  }

  return null;
}

function isSmallTalk(text) {
  const t = text.toLowerCase().trim();

  return ["שלום", "היי", "הי", "אהלן", "תודה", "מה נשמע", "מה קורה", "עזרה"].includes(t) || t.length < 3;
}

function nowIso() {
  return new Date().toISOString();
}

function safeJsonArray(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
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

async function getVolunteersText(env) {
  const result = await env.DB.prepare(`
    SELECT id, name, phone, city, skills, approved, rejected, available, created_at
    FROM volunteers
    ORDER BY created_at DESC
    LIMIT 30
  `).all();

  const rows = result.results || [];

  if (!rows.length) {
    return "אין עדיין מתנדבים רשומים במערכת.";
  }

  return rows.map((v) => {
    const skills = safeJsonArray(v.skills)
      .map((s) => VOLUNTEER_SKILLS[s] || s)
      .join(", ");

    const status =
      v.approved
        ? "מאושר"
        : v.rejected
          ? "נדחה"
          : "ממתין לאישור";

    const available = v.available ? "זמין" : "לא זמין";

    return (
      `#${v.id} - ${v.name}\n` +
      `עיר: ${v.city}\n` +
      `טלפון: ${v.phone}\n` +
      `תחומים: ${skills || "לא צוין"}\n` +
      `סטטוס: ${status} | ${available}`
    );
  }).join("\n\n");
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
            "You are a strict text classifier. Return exactly one category key and nothing else. Allowed categories: plumbing, electricity, air_conditioning, transportation, childcare, food, medical, errands, household, emotional, general. Do not explain. Do not answer the user. Output only one allowed category key."
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
