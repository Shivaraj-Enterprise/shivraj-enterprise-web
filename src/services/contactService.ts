
import { ContactFormData, ContactSubmission } from "../models/ContactSubmission";
import { supabase } from "@/integrations/supabase/client";

export const submitContactForm = async (formData: ContactFormData): Promise<ContactSubmission> => {
  console.log("Contact form submission initiated with data:", formData);
  
  try {
    // Submit the form data to our Supabase edge function
    console.log("Calling contact-us edge function...");
    const { data, error } = await supabase.functions.invoke('contact-us', {
      body: formData
    });
    
    if (error) {
      console.error("Error calling contact-us function:", error);
      throw new Error(`Failed to submit contact form: ${error.message}`);
    }
    
    console.log("Contact form submission successful. Response:", data);
    
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
  try {
    console.log("Retrieving contact submissions from localStorage");
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    console.log(`Found ${submissions.length} contact submissions`);
    return submissions;
  } catch (error) {
    console.error("Error retrieving submissions:", error);
    return [];
  }
};
