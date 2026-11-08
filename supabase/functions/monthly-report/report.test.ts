import { describe, expect, test } from 'bun:test';
import { contactColumns, jobColumns, leadColumns, reportPeriod, splitLeads, toCsv } from './report';

describe('monthly owner report', () => {
  test('covers the previous complete Indian calendar month', () => {
    expect(reportPeriod(new Date('2026-10-31T21:00:00Z'))).toEqual({ from: '2026-10-01', to: '2026-11-01', start: '2026-10-01T00:00:00+05:30', end: '2026-11-01T00:00:00+05:30' });
  });
  test('counts profile requests separately from saved AI chat leads', () => {
    const result = splitLeads([{source:'company-profile-download'}, {source:'ai-sales-agent'}, {source:'ai-handoff'}]);
    expect(result.profiles.length).toBe(1);
    expect(result.chats.length).toBe(2);
  });
  test('exports submitted job details including the CV link', () => {
    const csv = toCsv([{name:'Applicant', role:'Fitter', qualification:'ITI', cv_download_url:'https://example.com/cv'}], jobColumns);
    expect(csv).toContain('"Applicant"');
    expect(csv).toContain('"Fitter"');
    expect(csv).toContain('"ITI"');
    expect(csv).toContain('"https://example.com/cv"');
  });
  test('exports saved AI conversation and manpower requirements', () => {
    const csv = toCsv([{workers_required:'25', conversation:[{role:'user',content:'Need fitters'}]}], leadColumns);
    expect(csv).toContain('"25"');
    expect(csv).toContain('Need fitters');
  });
  test('exports contact details and prevents spreadsheet formula execution', () => {
    const csv = toCsv([{name:'=HYPERLINK("bad")', whatsapp:'9998498311', message:'Need workers'}], contactColumns);
    expect(csv).toContain('"\'=HYPERLINK');
    expect(csv).toContain('"9998498311"');
    expect(csv).toContain('"Need workers"');
  });
  test('rejects invalid or reversed date windows', () => {
    expect(() => reportPeriod(new Date(), '2026-02-30','2026-03-01')).toThrow();
    expect(() => reportPeriod(new Date(), '2026-11-01','2026-10-01')).toThrow();
  });
});