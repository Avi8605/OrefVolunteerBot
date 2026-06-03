const CATEGORY_HEBREW = {
  plumbing: 'אינסטלציה', electricity: 'חשמל', air_conditioning: 'מזגן / קירור',
  transportation: 'הסעה / שינוע', childcare: 'שמירה על ילדים', food: 'אוכל / קניות',
  medical: 'תרופות / סיוע רפואי', errands: 'סידורים ושליחויות', household: 'עזרה בבית',
  emotional: 'תמיכה ושיחה', tutoring: 'עזרה בלימודים', general: 'כללי'
};
const URGENCY_HEBREW = { critical: 'קריטי', high: 'דחוף', medium: 'רגיל', low: 'לא דחוף' };
const URGENCY_EMOJI = { critical: '🚨', high: '⚠️', medium: '📋', low: '📝' };
const ADMIN_IDS_DEFAULT = '8605935603';

const KEYWORDS = {
  plumbing: ['נזילה','נוזל','דליפה','צינור','ברז','סתימה','ביוב','אסלה','כיור','מקלחת','דוד','אינסטלטור'],
  electricity: ['חשמל','קצר','שקע','תקע','מפסק','נורה','תאורה','פיוז','חשמלאי','מנורה'],
  air_conditioning: ['מזגן','קירור','חימום','לא מקרר','לא מחמם'],
  transportation: ['הסעה','טרמפ','רכב','נסיעה','לקחת','להחזיר','איסוף','בית חולים','להסיע'],
  childcare: ['ילדים','ילד','ילדה','תינוק','בייביסיטר','בייבי סיטר','שמרטף','מטפלת','גן','צהרון'],
  food: ['אוכל','ארוחה','בישול','מזון','קניות','סופר','מצרכים','חלב','לחם'],
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
    if (request.method === 'GET') return new Response('OREF Telegram Bot is running on Cloudflare Workers.');
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
    if (env.WEBHOOK_SECRET && url.pathname !== `/webhook/${env.WEBHOOK_SECRET}`) return new Response('Not Found', { status: 404 });
    const update = await request.json();
    await handleUpdate(update, env);
    return new Response('OK');
  }
};

async function handleUpdate(update, env) {
  if (update.callback_query) return handleCallback(update.callback_query, env);
  const msg = update.message;
  if (!msg || !msg.chat) return;
  const text = (msg.text || '').trim();
  const chatId = msg.chat.id;
  const userId = msg.from?.id || chatId;
  const firstName = msg.from?.first_name || msg.from?.username || 'משתמש';
  if (!text) return;

  if (text.startsWith('/')) return handleCommand(text, msg, env);

  const session = await getSession(env, chatId);
  session.last_interaction = nowIso();

  if (session.awaiting_city) {
    const city = extractCity(text);
    if (!city) return send(env, chatId, 'לא הצלחתי לזהות עיר. אפשר לכתוב את שם העיר? לדוגמה: תל אביב, ירושלים, חיפה, באר שבע.');
    session.pending_city = city;
    session.awaiting_city = false;
    session.awaiting_phone = true;
    await setSession(env, chatId, session);
    return send(env, chatId, `סוג עזרה: <b>${CATEGORY_HEBREW[session.pending_category] || session.pending_category}</b>\nעיר: <b>${city}</b>\n\nכדי שנוכל ליצור קשר, אנא שלח את מספר הטלפון שלך:`, { parse_mode: 'HTML' });
  }

  if (session.awaiting_phone) {
    const phone = text.replace(/[\s\-+]/g, '');
    if (!/^05\d{8}$/.test(phone)) return send(env, chatId, 'מספר הטלפון לא נראה תקין. נא לשלוח מספר ישראלי בפורמט 05XXXXXXXX.');
    session.pending_phone = phone;
    session.awaiting_phone = false;
    session.awaiting_urgency = true;
    await setSession(env, chatId, session);
    return send(env, chatId, 'מה רמת הדחיפות?', { reply_markup: { inline_keyboard: [[
      { text: '📝 לא דחוף', callback_data: 'urgency_low' }, { text: '📋 רגיל', callback_data: 'urgency_medium' }
    ], [{ text: '⚠️ דחוף', callback_data: 'urgency_high' }, { text: '🚨 קריטי', callback_data: 'urgency_critical' }]] }});
  }

  if (isSmallTalk(text)) return send(env, chatId, `היי ${escapeHtml(firstName)}! 👋\n\nאני בוט העזרה למשפחות מילואימניקים. פשוט כתבו לי מה אתם צריכים, למשל:\n• יש לנו נזילה במטבח\n• צריכים הסעה לבית החולים\n• מחפשים בייביסיטר לערב`, { parse_mode: 'HTML' });

  const category = classify(text);
  const city = extractCity(text);
  await setSession(env, chatId, {
    pending_name: firstName,
    pending_description: text,
    pending_category: category,
    requester_chat_id: chatId,
    requester_user_id: userId,
    awaiting_city: !city,
    awaiting_phone: !!city,
    pending_city: city || undefined,
    last_interaction: nowIso()
  });
  if (!city) return send(env, chatId, `זוהה סוג עזרה: <b>${CATEGORY_HEBREW[category] || category}</b>\n\nבאיזו עיר אתם נמצאים?`, { parse_mode: 'HTML' });
  return send(env, chatId, `סוג עזרה: <b>${CATEGORY_HEBREW[category] || category}</b>\nעיר: <b>${city}</b>\n\nכדי שנוכל ליצור קשר, אנא שלח את מספר הטלפון שלך:`, { parse_mode: 'HTML' });
}

async function handleCommand(text, msg, env) {
  const chatId = msg.chat.id;
  const userId = msg.from?.id || chatId;
  const cmd = text.split(/\s+/)[0].replace('@', '').toLowerCase();
  if (cmd === '/start') return send(env, chatId, `User ID: ${userId}\n\nשלום! 👋 אני בוט העזרה למשפחות מילואימניקים.\n\nשלח לי הודעה חופשית המתארת את סוג העזרה שאתם צריכים, ואנסה למצוא מתנדב באזור שלך.`);
  if (cmd === '/help') return send(env, chatId, '📖 <b>איך להשתמש בבוט:</b>\n\n1️⃣ שלח הודעה חופשית המתארת את סוג העזרה\n2️⃣ הבוט יבקש עיר וטלפון\n3️⃣ בחר רמת דחיפות\n4️⃣ נשלח התראה למתנדבים מתאימים\n\nפקודות: /start /help /about /volunteer /status /cancel', { parse_mode: 'HTML' });
  if (cmd === '/about') return send(env, chatId, '🇮🇱 <b>About Oref Volunteer Bot</b>\n\nThis bot connects families of reserve-duty soldiers with approved volunteers who can help with practical daily needs. 💙', { parse_mode: 'HTML' });
  if (cmd === '/cancel') { await clearSession(env, chatId); await env.DB.prepare("UPDATE requests SET status='cancelled', updated_at=? WHERE requester_chat_id=? AND status IN ('searching','assigned')").bind(nowIso(), chatId).run(); return send(env, chatId, 'הבקשה הפעילה בוטלה, אם הייתה כזו.'); }
  if (cmd === '/status') return statusCommand(text, chatId, env);
  if (cmd === '/volunteer') return startVolunteer(text, msg, env);
  if (cmd.startsWith('/admin')) return adminCommand(cmd, chatId, userId, env);
  return send(env, chatId, 'פקודה לא מוכרת. אפשר לכתוב /help');
}

async function handleCallback(q, env) {
  const data = q.data || '';
  const chatId = q.message?.chat?.id;
  await answerCallback(env, q.id);
  if (data.startsWith('urgency_')) {
    const urgency = data.replace('urgency_', '');
    const session = await getSession(env, chatId);
    if (!session.pending_description) return edit(env, chatId, q.message.message_id, 'הפנייה לא נמצאה. נא להתחיל מחדש עם /start');
    const req = await createRequest(env, session, urgency);
    await clearSession(env, chatId);
    const volunteers = await findVolunteers(env, req.city, req.category);
    if (!volunteers.length) return edit(env, chatId, q.message.message_id, `${URGENCY_EMOJI[urgency] || '📋'} בקשתך התקבלה (מספר ${req.id}).\n\nאין כרגע מתנדבים זמינים בעיר שלך בתחום זה.`);
    let notified = 0;
    for (const v of volunteers) {
      const ok = await send(env, v.telegram_chat_id, `${URGENCY_EMOJI[urgency]} <b>בקשת עזרה חדשה!</b> (${URGENCY_HEBREW[urgency]})\n\nמשפחת מילואימניק באזור <b>${escapeHtml(req.city)}</b> צריכה עזרה בתחום <b>${CATEGORY_HEBREW[req.category] || req.category}</b>.\nהאם תוכל לעזור?`, { parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text:'✅ אני יכול לעזור', callback_data:`accept_${req.id}_${v.id}` }, { text:'❌ לא זמין', callback_data:`reject_${req.id}_${v.id}` }]] }});
      if (ok) notified++;
    }
    return edit(env, chatId, q.message.message_id, `${URGENCY_EMOJI[urgency]} בקשתך התקבלה (מספר ${req.id}).\n\nסוג: ${CATEGORY_HEBREW[req.category] || req.category}\nעיר: ${req.city}\nדחיפות: ${URGENCY_HEBREW[urgency]}\n\nנשלחה התראה ל-${notified} מתנדב(ים).`);
  }

  const parts = data.split('_');
  if (parts.length < 3) return;
  const [action, requestId, volunteerId] = parts;
  const req = await env.DB.prepare('SELECT * FROM requests WHERE id=?').bind(requestId).first();
  const vol = await env.DB.prepare('SELECT * FROM volunteers WHERE id=?').bind(Number(volunteerId)).first();
  if (!req || !vol) return edit(env, chatId, q.message.message_id, '❌ הבקשה או המתנדב לא נמצאו.');
  if (action === 'accept') {
    const assigned = JSON.stringify({ id: vol.id, name: vol.name, telegram_chat_id: vol.telegram_chat_id, city: vol.city, assigned_at: nowIso() });
    await env.DB.prepare("UPDATE requests SET status='assigned', assigned_volunteer=?, assigned_at=? WHERE id=?").bind(assigned, nowIso(), requestId).run();
    await env.DB.prepare('UPDATE volunteers SET assignment_count=assignment_count+1, last_response_time=? WHERE id=?').bind(nowIso(), vol.id).run();
    await send(env, vol.telegram_chat_id, `✅ <b>פרטי מבקש העזרה:</b>\n\nשם: ${escapeHtml(req.name)}\nטלפון: ${escapeHtml(req.phone || '')}\nעיר: ${escapeHtml(req.city)}\nתיאור: ${escapeHtml(req.description)}\nסוג: ${CATEGORY_HEBREW[req.category] || req.category}`, { parse_mode: 'HTML' });
    if (req.requester_chat_id) await send(env, req.requester_chat_id, `🎉 נמצא מתנדב לבקשה ${req.id}. המתנדב ייצור קשר בהקדם.`);
    return edit(env, chatId, q.message.message_id, `🎉 תודה, ${vol.name}! קיבלת את הבקשה. פרטי המבקש נשלחו לך.`);
  }
  if (action === 'reject') {
    await env.DB.prepare('UPDATE volunteers SET available=0, updated_at=? WHERE id=?').bind(nowIso(), vol.id).run();
    return edit(env, chatId, q.message.message_id, `אין בעיה, ${vol.name}. סומנת כלא זמין.`);
  }
}

async function startVolunteer(text, msg, env) {
  const chatId = msg.chat.id;
  const userId = msg.from?.id || chatId;
  const parts = text.replace('/volunteer','').trim().split('|').map(s => s.trim());
  if (parts.length < 4) return send(env, chatId, 'להרשמה כמתנדב כתוב כך:\n/volunteer שם | טלפון | עיר | skills\n\nלדוגמה:\n/volunteer אברהם | 0533400219 | נתיבות | plumbing,electricity,general');
  const [name, phone, city, skillsText] = parts;
  const skills = skillsText.split(',').map(s => s.trim()).filter(Boolean);
  await env.DB.prepare('INSERT INTO volunteers (name,phone,city,skills,telegram_chat_id,telegram_user_id,telegram_username,available,approved,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
    .bind(name, phone, city, JSON.stringify(skills), chatId, userId, msg.from?.username || null, 1, 0, nowIso(), nowIso()).run();
  return send(env, chatId, 'נרשמת כמתנדב. מנהל צריך לאשר אותך לפני שתקבל פניות.');
}

async function statusCommand(text, chatId, env) {
  const id = text.split(/\s+/)[1];
  const row = id ? await env.DB.prepare('SELECT * FROM requests WHERE id=?').bind(id).first() : await env.DB.prepare('SELECT * FROM requests WHERE requester_chat_id=? ORDER BY created_at DESC LIMIT 1').bind(chatId).first();
  if (!row) return send(env, chatId, 'לא נמצאה בקשה. אפשר לכתוב /status מספר_בקשה');
  return send(env, chatId, `סטטוס בקשה ${row.id}: ${row.status}\nעיר: ${row.city}\nסוג: ${CATEGORY_HEBREW[row.category] || row.category}`);
}

async function adminCommand(cmd, chatId, userId, env) {
  const admins = (env.ADMIN_IDS || ADMIN_IDS_DEFAULT).split(',').map(x => Number(x.trim()));
  if (!admins.includes(Number(userId))) return send(env, chatId, 'אין הרשאת מנהל.');
  if (cmd === '/admin_stats') {
    const v = await env.DB.prepare('SELECT COUNT(*) total, SUM(approved) approved, SUM(available) available FROM volunteers').first();
    const r = await env.DB.prepare('SELECT COUNT(*) total FROM requests').first();
    return send(env, chatId, `📊 סטטיסטיקה\nמתנדבים: ${v.total}\nמאושרים: ${v.approved || 0}\nזמינים: ${v.available || 0}\nבקשות: ${r.total}`);
  }
  if (cmd === '/admin_requests') {
    const rows = await env.DB.prepare('SELECT id,city,category,status,urgency FROM requests ORDER BY created_at DESC LIMIT 10').all();
    return send(env, chatId, rows.results.map(x => `${x.id} | ${x.city} | ${CATEGORY_HEBREW[x.category] || x.category} | ${x.status} | ${x.urgency}`).join('\n') || 'אין בקשות.');
  }
  if (cmd === '/admin_volunteers') {
    const rows = await env.DB.prepare('SELECT id,name,city,approved,available,skills FROM volunteers ORDER BY id DESC LIMIT 20').all();
    return send(env, chatId, rows.results.map(x => `${x.id} | ${x.name} | ${x.city} | approved=${x.approved} | available=${x.available}`).join('\n') || 'אין מתנדבים.');
  }
  return send(env, chatId, 'פקודות מנהל: /admin_stats /admin_requests /admin_volunteers');
}

async function createRequest(env, session, urgency) {
  const id = crypto.randomUUID().replaceAll('-', '').slice(0, 8);
  const req = { id, name: session.pending_name || 'משתמש', phone: session.pending_phone, city: session.pending_city, description: session.pending_description, category: session.pending_category || 'general', urgency, status: 'searching', requester_chat_id: session.requester_chat_id, requester_user_id: session.requester_user_id, created_at: nowIso() };
  await env.DB.prepare('INSERT INTO requests (id,name,phone,city,description,category,urgency,status,requester_chat_id,requester_user_id,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
    .bind(req.id, req.name, req.phone, req.city, req.description, req.category, req.urgency, req.status, req.requester_chat_id, req.requester_user_id, req.created_at).run();
  return req;
}

async function findVolunteers(env, city, category) {
  const rows = await env.DB.prepare('SELECT * FROM volunteers WHERE approved=1 AND available=1 AND telegram_chat_id IS NOT NULL').all();
  const nearby = nearbyCities(city);
  return rows.results.map(v => ({ ...v, skillsArr: JSON.parse(v.skills || '[]') }))
    .filter(v => v.city === city || nearby.includes(v.city))
    .filter(v => category === 'general' || v.skillsArr.includes(category) || v.skillsArr.includes('general'))
    .slice(0, 5);
}
function nearbyCities(city) { const g = CITY_GROUPS.find(x => x.includes(city)); return g ? g.filter(x => x !== city) : []; }
function classify(text) { const t = text.toLowerCase(); let best = 'general', bestScore = 0; for (const [cat, words] of Object.entries(KEYWORDS)) { const score = words.filter(w => t.includes(w)).length; if (score > bestScore) { best = cat; bestScore = score; } } return best; }
function extractCity(text) { return CITIES.sort((a,b)=>b.length-a.length).find(c => text.includes(c)) || null; }
function isSmallTalk(text) { const t = text.toLowerCase().trim(); return ['שלום','היי','הי','אהלן','תודה','מה נשמע','מה קורה','help','עזרה'].includes(t) || (t.length < 3); }
function nowIso() { return new Date().toISOString(); }
async function getSession(env, chatId) { const row = await env.DB.prepare('SELECT data FROM sessions WHERE chat_id=?').bind(chatId).first(); return row ? JSON.parse(row.data) : {}; }
async function setSession(env, chatId, data) { await env.DB.prepare('INSERT OR REPLACE INTO sessions (chat_id,data,updated_at) VALUES (?,?,?)').bind(chatId, JSON.stringify(data), nowIso()).run(); }
async function clearSession(env, chatId) { await env.DB.prepare('DELETE FROM sessions WHERE chat_id=?').bind(chatId).run(); }
async function send(env, chatId, text, extra = {}) { const res = await telegram(env, 'sendMessage', { chat_id: chatId, text, ...extra }); return res.ok; }
async function edit(env, chatId, messageId, text, extra = {}) { return telegram(env, 'editMessageText', { chat_id: chatId, message_id: messageId, text, ...extra }); }
async function answerCallback(env, callback_query_id) { return telegram(env, 'answerCallbackQuery', { callback_query_id }); }
async function telegram(env, method, payload) { const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }); return res.json(); }
function escapeHtml(s) { return String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
