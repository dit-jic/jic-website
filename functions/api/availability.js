import { DOCTORS, allSlots, isOpenDay, inRange, pastSlot, json } from "../_lib/config.js";
export async function onRequestGet({ request, env }) {
  const u = new URL(request.url), doc = u.searchParams.get("doctor"), date = u.searchParams.get("date");
  if (!DOCTORS.some(d => d.id === doc) || !isOpenDay(date) || !inRange(date)) return json({ slots: [] });
  const { results } = await env.DB.prepare("SELECT appt_time FROM appointments WHERE doctor_id=? AND appt_date=? AND status IN ('pending','confirmed')").bind(doc, date).all();
  const taken = new Set(results.map(r => r.appt_time));
  return json({ slots: allSlots().map(t => ({ t, free: !taken.has(t) && !pastSlot(date, t) })) });
}
