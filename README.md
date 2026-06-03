# OREF Telegram Bot – Cloudflare Worker

This is a Cloudflare Worker version of the OREF Telegram bot.
It runs with Telegram Webhook, not polling.

## What is included

- `src/index.js` – the Worker bot code
- `db/schema.sql` – D1 database tables
- `db/seed.sql` – initial volunteer from the old `volunteers.json`
- `wrangler.toml` – Cloudflare Worker config
- `package.json` – Wrangler commands

## Required secrets

Do not create a `.env` file for Cloudflare production. Use Wrangler secrets:

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put WEBHOOK_SECRET
npx wrangler secret put ADMIN_IDS
```

Recommended values:

```text
TELEGRAM_BOT_TOKEN=your BotFather token
WEBHOOK_SECRET=long-random-secret-string
ADMIN_IDS=8605935603
```

## Deployment steps

### 1. Install dependencies

```bash
npm install
```

### 2. Login to Cloudflare

```bash
npx wrangler login
```

### 3. Create D1 database

```bash
npx wrangler d1 create oref-db
```

Copy the `database_id` printed by Cloudflare into `wrangler.toml`.

### 4. Create tables

```bash
npx wrangler d1 execute oref-db --remote --file=./db/schema.sql
```

### 5. Seed existing volunteer

```bash
npx wrangler d1 execute oref-db --remote --file=./db/seed.sql
```

### 6. Add secrets

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put WEBHOOK_SECRET
npx wrangler secret put ADMIN_IDS
```

### 7. Deploy

```bash
npx wrangler deploy
```

Cloudflare will give you a URL like:

```text
https://oref-bot.YOUR_SUBDOMAIN.workers.dev
```

### 8. Set Telegram webhook

Replace the values and run:

```bash
curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://oref-bot.YOUR_SUBDOMAIN.workers.dev/webhook/<WEBHOOK_SECRET>"
```

Check webhook:

```bash
curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getWebhookInfo"
```

## Supported commands

- `/start`
- `/help`
- `/about`
- `/cancel`
- `/status`
- `/volunteer`
- `/admin_stats`
- `/admin_requests`
- `/admin_volunteers`

## Volunteer registration format

```text
/volunteer שם | טלפון | עיר | skills
```

Example:

```text
/volunteer אברהם | 0533400219 | נתיבות | plumbing,electricity,general
```

New volunteers are saved with `approved=0`. For now, approve them in D1 manually:

```bash
npx wrangler d1 execute oref-db --remote --command="UPDATE volunteers SET approved=1, approved_at=datetime('now') WHERE id=2"
```

## Important difference from the old Python version

The old bot used local JSON files and `run_polling()`.
This version uses Cloudflare D1 and Telegram Webhook.
That is required because Cloudflare Workers do not run a permanent Python process.

## Notes

This version keeps the core MVP logic: request intake, city/phone flow, urgency buttons, volunteer notification, accept/reject, status, cancellation, and basic admin commands.
The AI/OpenAI classification from the Python version was replaced with deterministic keyword matching so the Worker can run cheaply and independently.
