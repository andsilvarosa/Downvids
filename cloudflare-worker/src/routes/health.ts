import { Hono } from 'hono';

const healthRoute = new Hono();

healthRoute.get('/', (c) => {
  return c.text('🤖 Video Downloader Bot is online and healthy!');
});

export default healthRoute;
