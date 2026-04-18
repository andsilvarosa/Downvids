import { Hono } from 'hono';
import { Bindings } from '../types';

const setwebhookRoute = new Hono<{ Bindings: Bindings }>();

setwebhookRoute.get('/', async (c) => {
  const currentUrl = new URL(c.req.url);
  const webhookTarget = `${currentUrl.origin}/webhook`;
  const token = c.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return c.json({ error: 'TELEGRAM_BOT_TOKEN is not configured.' }, 500);
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookTarget)}`);
    const data = await response.json();
    
    return c.json({ 
      success: true, 
      target: webhookTarget, 
      telegramContext: data 
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

export default setwebhookRoute;
