import { ContactFormData, ContactSubmission } from "../models/ContactSubmission";
import { supabase } from "@/integrations/supabase/client";

export const submitContactForm = async (formData: ContactFormData): Promise<ContactSubmission> => {
  try {
    const { data, error } = await supabase.functions.invoke('contact-us', {
      body: formData
    });

    if (error) {
      throw new Error("Failed to submit contact form");
    }

    const submission: ContactSubmission = {
      id: `contact-${Date.now()}`,
      ...formData,
      createdAt: new Date(),
    };

    return submission;
  } catch (error) {
    throw error;
  }
};

export const getContactSubmissions = async (): Promise<ContactSubmission[]> => {
  return [];
};
