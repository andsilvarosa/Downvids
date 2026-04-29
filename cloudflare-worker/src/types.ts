export type Bindings = {
  TELEGRAM_BOT_TOKEN: string;
  RAPIDAPI_KEY?: string;
  RAPIDAPI_HOST?: string;
  DB: any; // D1Database type checking fails in Next.js build
};
