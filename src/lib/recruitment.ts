export const careersUrl = "https://shivraj-enterprise.lovable.app/careers";
export function recruitmentMessage(role: string) {
  return `Shivraj Enterprise — industrial recruitment in Vapi GIDC and nearby areas.\nRole: ${role}\nApply with your CV: ${careersUrl}\nShare your experience and current location. Our team will confirm availability and job details. No application fee.\nContact: +91 99984 98311`;
}
export function candidateMatches(candidate: { name: string; role: string; current_location: string | null; skill_level: string }, query: string, level: string, role: string) {
  return (level === "All" || candidate.skill_level === level) && (role === "All" || candidate.role === role) &&
    `${candidate.name} ${candidate.role} ${candidate.current_location ?? ""}`.toLowerCase().includes(query.trim().toLowerCase());
}
export function candidateWhatsapp(phone: string | null) {
  const digits = (phone ?? "").replace(/\D/g, "");
  const normalized = digits.length === 10 ? `91${digits}` : digits;
  return normalized.length >= 11 && normalized.length <= 15 ? `https://wa.me/${normalized}` : null;
}