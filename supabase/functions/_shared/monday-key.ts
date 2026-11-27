// Calendar-week identifiers use India time, independently of the server's UTC date.
export function mondayKey(now = new Date()) {
  const local = new Date(now.getTime() + 330 * 60_000);
  local.setUTCDate(local.getUTCDate() - (local.getUTCDay() + 6) % 7);
  return local.toISOString().slice(0, 10);
}