import { Hono } from 'hono';
import { Bindings } from './types';
import webhookRoute from './routes/webhook';
import healthRoute from './routes/health';
import setwebhookRoute from './routes/setwebhook';
import { getDirectMediaUrl } from './services/downloader';

const app = new Hono<{ Bindings: Bindings }>();

// Mount routes
app.route('/', healthRoute);
app.route('/health', healthRoute);
app.route('/webhook', webhookRoute);
app.route('/setwebhook', setwebhookRoute);

app.get('/test-dl', async (c) => {
  const url = c.req.query('url');
  if (!url) return c.json({ error: 'Missing url parameter' }, 400);

  // Aqui vamos retornar o debug log se der pra modificar o getDirectMediaUrl...
  // Mas por enquanto só testar
  try {
    const resultUrl = await getDirectMediaUrl(url, c.env);
    return c.json({ result: resultUrl, url_requested: url });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;
