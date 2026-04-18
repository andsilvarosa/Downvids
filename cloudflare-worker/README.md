# Video Downloader Bot 🚀

Bot do Telegram Serverless que utiliza Cloudflare Workers, Hono.js e Cloudflare D1.

## Estrutura de Arquivos

```text
video-downloader-bot/
├── src/
│   ├── index.ts              # Entry point com Hono.js
│   ├── routes/
│   │   ├── webhook.ts        # Recebe updates do Telegram
│   │   ├── health.ts         # Health check endpoint
│   │   └── setwebhook.ts     # Configuração do webhook
│   ├── services/
│   │   ├── telegram.ts       # Cliente Telegram Bot API
│   │   ├── downloader.ts     # Integração RapidAPI/Cobalt
│   │   └── analytics.ts      # Logging e métricas D1
│   └── utils/
│       ├── url-parser.ts     # Detecção de plataforma
│       └── validators.ts     # Validação de entrada
├── schema.sql                # Schema completo do D1
├── wrangler.toml             # Configuração Cloudflare
└── package.json
```

## Plataformas Suportadas
✅ YouTube (youtube.com, youtu.be)
✅ TikTok (tiktok.com)
✅ Instagram (instagram.com)
✅ Facebook (facebook.com, fb.watch)

## Passo a Passo para Deploy Rápido

**1. DB Creation**
```bash
wrangler d1 create video-downloader-db
```
*Copie o id impresso para o seu `wrangler.toml`.*

**2. Migration**
```bash
wrangler d1 execute video-downloader-db --file=./schema.sql --remote
```

**3. Secrets Setup**
```bash
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put RAPIDAPI_KEY
wrangler secret put RAPIDAPI_HOST
```

**4. Publish**
```bash
npm run deploy
```

**5. Wire Webhook (Telegram)**
```bash
# Você pode utilizar o endpoint utilitário nativo via browser:
# Acesse: https://seu-worker.workers.dev/setwebhook
```
