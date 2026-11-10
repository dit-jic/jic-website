import { DOCTORS, OPD, json } from "../_lib/config.js";
export const onRequestGet = () => json({ doctors: DOCTORS, opd: OPD });
