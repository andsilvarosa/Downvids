'use client';

import { Terminal, Download, Code2, Database } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans p-6 md:p-12 selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <div className="inline-flex items-center space-x-2 text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full text-sm font-medium">
            <Terminal size={16} />
            <span>Cloudflare Workers + Hono.js</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Telegram Downloader Bot
          </h1>
          <p className="text-neutral-400 text-lg leading-relaxed max-w-2xl">
            Uma infraestrutura serverless completa gerada para rodar no Cloudflare. 
            Sem servidores locais. Logs no banco de dados D1 e roteamento rápido.
          </p>
        </header>

        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 lg:p-8 space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-white">
            <Download size={24} className="text-emerald-400" />
            Estrutura Gerada Pronta para Exportação
          </h2>
          <p className="text-neutral-400">
            Todo o código que você solicitou foi gerado e salvo numa pasta separada chamada <code className="bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">cloudflare-worker</code> neste ambiente e no Github Actions em <code className="bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">.github/workflows</code>.
            Você pode fazer o download do projeto clicando no menu superior direito da plataforma (Export &rarr; Download ZIP).
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { file: 'src/index.ts', desc: 'Lógica do bot e rotas Hono' },
              { file: 'schema.sql', desc: 'Instrução de criação do banco D1' },
              { file: 'wrangler.toml', desc: 'Configurações de infra do Cloudflare' },
              { file: 'package.json', desc: 'Dependências do TS e de compilação' },
            ].map(item => (
              <div key={item.file} className="bg-neutral-950 border border-neutral-800 p-4 rounded-lg flex items-start gap-3">
                <Code2 size={20} className="text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-mono text-sm text-blue-300">{item.file}</h3>
                  <p className="text-sm text-neutral-500 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-white">
            <Database size={24} className="text-purple-400" />
            Passo a Passo de Setup e Deploy
          </h2>
          
          <div className="space-y-4">
            <div className="bg-neutral-900 border-l-4 border-l-blue-500 p-5 rounded-r-xl">
              <h3 className="font-medium text-lg text-white mb-2">1. Criar o Banco D1 no Cloudflare</h3>
              <p className="text-neutral-400 mb-3">Execute no seu terminal local com o Wrangler logado:</p>
              <pre className="bg-neutral-950 p-3 rounded font-mono text-sm overflow-x-auto text-blue-200">
                npx wrangler d1 create telegram_bot_logs
              </pre>
              <p className="text-neutral-400 mt-3">Copie o <code className="text-neutral-300">database_id</code> gerado e cole dentro do arquivo <code className="text-neutral-300">wrangler.toml</code>.</p>
            </div>

            <div className="bg-neutral-900 border-l-4 border-l-purple-500 p-5 rounded-r-xl">
              <h3 className="font-medium text-lg text-white mb-2">2. Rodar a Migration (Tabela)</h3>
              <p className="text-neutral-400 mb-3">No repositório local, crie as tabelas com o SQL:</p>
              <pre className="bg-neutral-950 p-3 rounded font-mono text-sm overflow-x-auto text-purple-200">
                npm run db:prod
              </pre>
            </div>

            <div className="bg-neutral-900 border-l-4 border-l-emerald-500 p-5 rounded-r-xl">
              <h3 className="font-medium text-lg text-white mb-2">3. Configurar CI/CD no Github Actions</h3>
              <p className="text-neutral-400 mb-2">Vá nas <strong>Settings &rarr; Secrets and Variables &rarr; Actions</strong> do seu repositório Github e adicione as chaves:</p>
              <ul className="list-disc pl-5 space-y-2 text-neutral-400 text-sm">
                <li><strong className="text-white">CF_API_TOKEN:</strong> Gerado no dashboard do Cloudflare (Em "My Profile" &gt; "API Tokens" com template "Edit Cloudflare Workers").</li>
                <li><strong className="text-white">CF_ACCOUNT_ID:</strong> O ID da sua conta Cloudflare (Fica no canto inferior direito das configurações do domínio/worker).</li>
                <li><strong className="text-white">TELEGRAM_BOT_TOKEN:</strong> O token obtido via BotFather no Telegram.</li>
              </ul>
            </div>

            <div className="bg-neutral-900 border-l-4 border-l-orange-500 p-5 rounded-r-xl">
              <h3 className="font-medium text-lg text-white mb-2">4. Vincular o Webhook ao Telegram</h3>
              <p className="text-neutral-400 mb-3">Após o deploy, o seu Worker terá uma URL (ex: <code className="text-neutral-300">https://telegram-downloader-bot.usuario.workers.dev</code>). Você precisa informar ao Telegram para enviar as mensagens pra ela.</p>
              <pre className="bg-neutral-950 p-3 rounded font-mono text-sm overflow-x-auto text-orange-200">
                curl -F "url=https://SEU_WORKER_URL/webhook" https://api.telegram.org/bot[SEU_TELEGRAM_BOT_TOKEN]/setWebhook
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
