# Especificação Técnica (SPEC) - Video Downloader Bot

## Arquitetura
A aplicação adota um modelo *Serverless* com divisão de responsabilidades guiada pelo framework Hono.js rodando no Cloudflare Workers.

### Componentes:
- **Routes (`src/routes`)**: Camada de roteamento onde vive a lógica de orquestração de endpoints (ex: `webhook`, `health`, `setwebhook`).
- **Services (`src/services`)**: Regras de negócio, comunicações de terceiros e abstrações de banco de dados (`telegram`, `downloader`, `analytics`).
- **Utils (`src/utils`)**: Funções de escopo único como parsers de regex e detectores de plataformas.

## Armazenamento
Utiliza o **Cloudflare D1**, banco de dados SQLite global distribuído. Os logs efetuados são desacoplados do request/response model com `waitUntil()`, zerando a latência adicionada ao usuário final.

## Variáveis (Env & Secrets)
A aplicação prevê uma tipagem rígida em `src/types.ts`:
- `TELEGRAM_BOT_TOKEN`: Comunicação primária.
- `RAPIDAPI_KEY` / `RAPIDAPI_HOST`: Usado pelo service *Downloader* para realizar scrape/download dinâmico.
- `DB`: Binding do banco D1 providenciada automaticamente pelo ambiente Workers.
