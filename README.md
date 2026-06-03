# OREF Telegram Bot – Cloudflare Worker

Cloudflare Worker version of the OREF Telegram bot for supporting families of reservists.

## Includes

- `src/index.js` – Telegram webhook bot code
- `db/schema.sql` – D1 database schema
- `db/seed.sql` – seed volunteer from the original project
- `wrangler.toml` – Cloudflare config for Worker `oref`

## Cloudflare bindings needed

- `DB` – D1 database `oref-db`
- `TELEGRAM_BOT_TOKEN` – Telegram bot token from BotFather

## Run D1 schema

From the project folder:

```bash
npm install
npx wrangler d1 execute oref-db --remote --file=./db/schema.sql
npx wrangler d1 execute oref-db --remote --file=./db/seed.sql
```

## Set Telegram webhook

Replace `<BOT_TOKEN>` with the BotFather token:

```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://oref.avi8605.workers.dev"
```

Check webhook:

```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
```

## Main commands

- `/start`
- `/help`
- `/about`
- `/volunteer name | phone | city | skill1,skill2,general`
- `/status`
- `/cancel`
- `/admin_stats`
- `/admin_requests`
- `/admin_volunteers`
