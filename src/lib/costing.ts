export type CustomCharge = { name: string; amount: number };

export type CostInputs = {
  basic: number; da: number; overtime: boolean; workers: number; days: number;
  leave: number; pf: number; esic: number; bonus: number; service: number; cgst: number; sgst: number;
  customCharges: CustomCharge[];
};

export const DEFAULT_INPUTS: CostInputs = {
  basic: 520, da: 200, overtime: true, workers: 1, days: 26,
  leave: 5, pf: 13, esic: 3.25, bonus: 8.33, service: 12, cgst: 9, sgst: 9,
  customCharges: [],
};

const n = (v: number) => (Number.isFinite(v) ? v : 0);

export const calculateCost = (i: CostInputs) => {
  const gross = n(i.basic) + n(i.da);
  const ot = i.overtime ? gross / 2 : 0;
  const a = gross + ot;
  const leave = gross * n(i.leave) / 100;
  const pf = gross * n(i.pf) / 100;
  const esic = a * n(i.esic) / 100;
  const bonus = gross * n(i.bonus) / 100;
  const custom = (i.customCharges ?? []).reduce((s, c) => s + n(c.amount), 0);
  const b = leave + pf + esic + bonus + custom;
  const grossTotal = a + b;
  const service = grossTotal * n(i.service) / 100;
  const c = grossTotal + service;
  const cgst = c * n(i.cgst) / 100;
  const sgst = c * n(i.sgst) / 100;
  const daily = c + cgst + sgst;
  const monthly = daily * n(i.days);
  return { gross, ot, a, leave, pf, esic, bonus, b, grossTotal, service, c, cgst, sgst, daily, monthly, monthlyAll: monthly * n(i.workers) };
};

export const inr = (v: number) =>
  "₹" + v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
