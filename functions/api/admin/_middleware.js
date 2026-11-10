// Cloudflare Access adds this header only after staff have logged in. Without it, refuse.
export const onRequest = async ({ request, next }) =>
  request.headers.get("Cf-Access-Jwt-Assertion") ? next() : new Response("Forbidden", { status: 403 });
