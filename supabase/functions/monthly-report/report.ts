export type ReportRow = Record<string, unknown>;

const IST_OFFSET = 330 * 60 * 1000;
export function reportPeriod(now = new Date(), from?: string | null, to?: string | null) {
  const local = new Date(now.getTime() + IST_OFFSET);
  const first = (month: number) => new Date(Date.UTC(local.getUTCFullYear(), month, 1)).toISOString().slice(0, 10);
  const start = from ?? first(local.getUTCMonth() - 1);
  const end = to ?? first(local.getUTCMonth());
  const valid = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date;
  if (!valid(start) || !valid(end) || start >= end) throw new Error('Invalid date range');
  return { from: start, to: end, start: `${start}T00:00:00+05:30`, end: `${end}T00:00:00+05:30` };
}

export function splitLeads(rows: ReportRow[]) {
  return {
    profiles: rows.filter(row => row.source === 'company-profile-download'),
    chats: rows.filter(row => row.source === 'ai-sales-agent' || row.source === 'ai-handoff'),
    other: rows.filter(row => !['company-profile-download', 'ai-sales-agent', 'ai-handoff'].includes(String(row.source))),
  };
}

export function toCsv(rows: ReportRow[], headers: string[]) {
  const cell = (value: unknown) => {
    const text = typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value ?? '');
    const safe = /^[\s\u0000-\u001f]*[=+@-]/.test(text) ? `'${text}` : text;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  return '\uFEFF' + [headers.join(','), ...rows.map(row => headers.map(key => cell(row[key])).join(','))].join('\r\n');
}

export const contactColumns = ['id', 'created_at', 'name', 'email', 'phone', 'whatsapp', 'inquiry_type', 'message', 'email_sent'];
export const jobColumns = ['id', 'created_at', 'name', 'phone', 'whatsapp', 'email', 'role', 'skill_level', 'experience_years', 'qualification', 'current_location', 'message', 'cv_path', 'cv_download_url', 'email_sent'];
export const leadColumns = ['id', 'created_at', 'source', 'company_name', 'contact_person', 'mobile', 'email', 'location', 'industry', 'workers_required', 'worker_type', 'shift_details', 'start_date', 'duration', 'notes', 'handoff', 'handoff_reason', 'conversation'];