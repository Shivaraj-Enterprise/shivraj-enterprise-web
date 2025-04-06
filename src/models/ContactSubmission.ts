
export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone: string; // Now expected to include country code
  whatsapp?: string; // Optional WhatsApp number
  inquiryType: 'service' | 'job' | 'quote' | 'other';
  message: string;
  createdAt: Date;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string; // Now expected to include country code
  whatsapp?: string; // Optional WhatsApp number
  inquiryType: 'service' | 'job' | 'quote' | 'other';
  message: string;
}

export interface CountryCode {
  code: string;
  name: string;
  dial_code: string;
}
