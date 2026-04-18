import { Hono } from 'hono';
import { Bindings } from './types';
import webhookRoute from './routes/webhook';
import healthRoute from './routes/health';
import setwebhookRoute from './routes/setwebhook';

const app = new Hono<{ Bindings: Bindings }>();

// Mount routes
app.route('/', healthRoute);
app.route('/health', healthRoute);
app.route('/webhook', webhookRoute);
app.route('/setwebhook', setwebhookRoute);

export default app;
