import { DOCTORS, OPD, allSlots, isOpenDay, inRange, pastSlot, pkDate, json } from "../_lib/config.js";
const clean = (v, n = 200) => String(v ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n);
export async function onRequestPost({ request, env }) {
  let b; try { b = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
  if (b.website) return json({ ok: true, ref: "JIC-0" });                    // honeypot: bots only
  const doc = DOCTORS.find(d => d.id === b.doctor), date = clean(b.date, 10), time = clean(b.time, 5);
  const name = clean(b.name, 100), phone = clean(b.phone, 20).replace(/\D/g, "");
  if (!doc) return json({ error: "Please select a doctor." }, 400);
  if (!isOpenDay(date) || !inRange(date)) return json({ error: "Please choose a valid OPD date." }, 400);
  if (!allSlots().includes(time) || pastSlot(date, time)) return json({ error: "Please choose a valid time slot." }, 400);
  if (name.length < 3) return json({ error: "Please enter the patient's full name." }, 400);
  if (phone.length < 10 || phone.length > 13) return json({ error: "Please enter a valid mobile number." }, 400);
  if (!b.consent) return json({ error: "Please accept the consent statement." }, 400);
  const active = await env.DB.prepare("SELECT COUNT(*) c FROM appointments WHERE phone=? AND appt_date>=? AND status IN ('pending','confirmed')").bind(phone, pkDate()).first();
  if (active.c >= OPD.maxActivePerPhone) return json({ error: "This number already has the maximum number of upcoming requests. Please call us to change them." }, 429);
  const ref = "JIC-" + date.slice(2).replace(/-/g, "") + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  try {
    await env.DB.prepare("INSERT INTO appointments (ref,doctor_id,doctor_name,appt_date,appt_time,patient_name,gender,age,phone,email,cnic,city,visit_type,mr_number,reason) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
      .bind(ref, doc.id, doc.name, date, time, name, clean(b.gender, 10), clean(b.age, 3), phone, clean(b.email, 120), clean(b.cnic, 15), clean(b.city, 60), clean(b.visitType, 20), clean(b.mrNumber, 30), clean(b.reason, 500)).run();
  } catch (e) {
    if (String(e).includes("UNIQUE")) return json({ error: "Sorry, that time was just booked. Please pick another slot." }, 409);
    return json({ error: "Could not save your request. Please try again." }, 500);
  }
  return json({ ok: true, ref, doctor: doc.name, date, time });
}
