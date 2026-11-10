// EDIT HERE: doctors and OPD timings. Ids must equal the doctor's name without "Dr.", lowercase, hyphenated.
export const OPD = { days: [1,2,3,4,5,6], start: "08:00", end: "15:00", slotMinutes: 15, maxDaysAhead: 30, maxActivePerPhone: 3 };
export const DOCTORS = [
  { id: "hasnat-ahmad-khan", name: "Dr. Hasnat Ahmad Khan", title: "Dean - JIC" },
  { id: "imran-khan", name: "Dr. Imran Khan", title: "Senior Consultant Cardiac Surgery" },
  { id: "kaleem-ahmad", name: "Dr. Kaleem Ahmad", title: "Senior Consultant Cardiac Anaesthesia" },
  { id: "muhammad-ahmed-tariq", name: "Dr. Muhammad Ahmed Tariq", title: "Senior Consultant Cardiac Anaesthesia" },
  { id: "syeda-atiqa-batul", name: "Dr. Syeda Atiqa Batul", title: "Senior Consultant Cardiac EP" },
  { id: "waseem-sajjad", name: "Dr. Waseem Sajjad", title: "Senior Consultant Cardiac EP" },
  { id: "tahira-sadiq", name: "Dr. Tahira Sadiq", title: "Consultant Interventional Cardiology" },
  { id: "hamza-iqbal", name: "Dr. Hamza Iqbal", title: "Consultant Cardiac Surgery" },
  { id: "waqas-khalid", name: "Dr. Waqas Khalid", title: "Consultant Cardiac Surgery" },
  { id: "khawar-naeem-satti", name: "Dr. Khawar Naeem Satti", title: "Consultant Interventional Cardiology" },
  { id: "sidra-liaqat", name: "Dr. Sidra Liaqat", title: "Consultant Pathology" },
  { id: "saima-rasheed-khan", name: "Dr. Saima Rasheed Khan", title: "Consultant Heart Failure & Devices" }
];
const toMin = t => +t.slice(0, 2) * 60 + +t.slice(3);
const pad = n => String(n).padStart(2, "0");
export const allSlots = () => { const o = []; for (let m = toMin(OPD.start); m + OPD.slotMinutes <= toMin(OPD.end); m += OPD.slotMinutes) o.push(pad(Math.floor(m / 60)) + ":" + pad(m % 60)); return o; };
export const pkNow = () => new Date(Date.now() + 5 * 3600000);              // Pakistan time (UTC+5)
export const pkDate = () => pkNow().toISOString().slice(0, 10);
export const isOpenDay = d => /^\d{4}-\d{2}-\d{2}$/.test(d) && OPD.days.includes(new Date(d + "T00:00:00Z").getUTCDay());
export const inRange = d => { const max = new Date(pkNow().getTime() + OPD.maxDaysAhead * 864e5).toISOString().slice(0, 10); return d >= pkDate() && d <= max; };
export const pastSlot = (d, t) => d === pkDate() && toMin(t) <= pkNow().getUTCHours() * 60 + pkNow().getUTCMinutes() + 30;
export const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
