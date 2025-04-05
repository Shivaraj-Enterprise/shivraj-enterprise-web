
export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone: string; // Now expected to include country code
  inquiryType: 'service' | 'job' | 'quote' | 'other';
  message: string;
  createdAt: Date;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string; // Now expected to include country code
  inquiryType: 'service' | 'job' | 'quote' | 'other';
  message: string;
}
