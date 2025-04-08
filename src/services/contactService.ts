
import { ContactFormData, ContactSubmission } from "../models/ContactSubmission";
import { supabase } from "@/integrations/supabase/client";

export const submitContactForm = async (formData: ContactFormData): Promise<ContactSubmission> => {
  console.log("Form data to be submitted:", formData);
  
  try {
    // Submit the form data to our Supabase edge function
    const { data, error } = await supabase.functions.invoke('contact-us', {
      body: formData
    });
    
    if (error) {
      console.error("Error calling contact-us function:", error);
      throw new Error(`Failed to submit contact form: ${error.message}`);
    }
    
    console.log("Contact form submission response:", data);
    
    // Create a submission object for the return value
    const submission: ContactSubmission = {
      id: `contact-${Date.now()}`,
      ...formData,
      createdAt: new Date(),
    };
    
    // Store submission in localStorage for reference (can be removed in production)
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    submissions.push(submission);
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    
    return submission;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};

export const getContactSubmissions = async (): Promise<ContactSubmission[]> => {
  // This function will be replaced with actual Supabase implementation
  // For now, it returns submissions from localStorage
  return new Promise((resolve) => {
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    resolve(submissions);
  });
};
