export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.URL ? process.env.URL : '') ||
  'https://oando.co.in'
).replace(/\/+$/, '');
