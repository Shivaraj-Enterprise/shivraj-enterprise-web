
import { ContactFormData, ContactSubmission } from "../models/ContactSubmission";

export const submitContactForm = async (formData: ContactFormData): Promise<ContactSubmission> => {
  // This function will be replaced with actual Supabase implementation
  // For now, it simulates a successful submission
  console.log("Form data to be submitted:", formData);
  
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const submission: ContactSubmission = {
        id: `contact-${Date.now()}`,
        ...formData,
        createdAt: new Date(),
      };
      
      // Store submission in localStorage for reference
      const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
      submissions.push(submission);
      localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
      
      resolve(submission);
    }, 1000);
  });
};

export const getContactSubmissions = async (): Promise<ContactSubmission[]> => {
  // This function will be replaced with actual Supabase implementation
  // For now, it returns submissions from localStorage
  return new Promise((resolve) => {
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    resolve(submissions);
  });
};
