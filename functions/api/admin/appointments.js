import { json } from "../../_lib/config.js";
const STATUSES = ["pending", "confirmed", "completed", "cancelled", "no-show"];
export async function onRequestGet({ request, env }) {
  const p = new URL(request.url).searchParams, w = [], a = [];
  if (p.get("from")) { w.push("appt_date>=?"); a.push(p.get("from")); }
  if (p.get("to")) { w.push("appt_date<=?"); a.push(p.get("to")); }
  if (p.get("doctor")) { w.push("doctor_id=?"); a.push(p.get("doctor")); }
  if (p.get("status")) { w.push("status=?"); a.push(p.get("status")); }
  if (p.get("q")) { const q = "%" + p.get("q") + "%"; w.push("(patient_name LIKE ? OR phone LIKE ? OR ref LIKE ? OR mr_number LIKE ?)"); a.push(q, q, q, q); }
  const sql = "SELECT * FROM appointments" + (w.length ? " WHERE " + w.join(" AND ") : "") + " ORDER BY appt_date, appt_time LIMIT 1000";
  return json({ rows: (await env.DB.prepare(sql).bind(...a).all()).results });
}
export async function onRequestPatch({ request, env }) {
  const b = await request.json();
  if (b.status !== undefined) {
    if (!STATUSES.includes(b.status)) return json({ error: "Bad status" }, 400);
    await env.DB.prepare("UPDATE appointments SET status=? WHERE id=?").bind(b.status, b.id).run();
  }
  if (b.staff_note !== undefined) await env.DB.prepare("UPDATE appointments SET staff_note=? WHERE id=?").bind(String(b.staff_note).slice(0, 500), b.id).run();
  return json({ ok: true });
}
