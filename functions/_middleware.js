// Staff password check. The password is stored as a secret named ADMIN_KEY in Cloudflare (never in GitHub).
const same = (a, b) => {
  const x = new TextEncoder().encode(a), y = new TextEncoder().encode(b);
  let d = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) d |= (x[i] || 0) ^ (y[i] || 0);
  return d === 0;
};
export const onRequest = async ({ request, env, next }) => {
  if (!env.ADMIN_KEY || env.ADMIN_KEY.length < 12) return new Response("Admin password is not configured", { status: 503 });
  if (!same(request.headers.get("X-Admin-Key") || "", env.ADMIN_KEY)) {
    await new Promise(r => setTimeout(r, 1000));          // slows down password guessing
    return new Response("Unauthorized", { status: 401 });
  }
  return next();
};
