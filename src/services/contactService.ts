
import { ContactFormData, ContactSubmission } from "../models/ContactSubmission";

// Admin WhatsApp number where messages will be forwarded to
const ADMIN_WHATSAPP_NUMBER = "919998498311"; // Replace with your WhatsApp number (without + sign)

export const submitContactForm = async (formData: ContactFormData): Promise<ContactSubmission> => {
  console.log("Form data to be submitted:", formData);
  
  // Format the message for WhatsApp
  const inquiryTypes = {
    service: "Service Inquiry",
    job: "Job Application",
    quote: "Quote Request",
    other: "Other Inquiry"
  };
  
  const whatsappMessage = encodeURIComponent(
    `*New Contact Form Submission*\n\n` +
    `*Name:* ${formData.name}\n` +
    `*Email:* ${formData.email}\n` +
    `*Phone:* ${formData.phone}\n` +
    `*WhatsApp:* ${formData.whatsapp || 'Not provided'}\n` +
    `*Inquiry Type:* ${inquiryTypes[formData.inquiryType]}\n\n` +
    `*Message:*\n${formData.message}\n\n` +
    `Sent from Shivraj Enterprise website`
  );
  
  try {
    // This sends a WhatsApp message using WhatsApp Business API
    // Note: For production, you'd need a proper WhatsApp Business API integration
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${ADMIN_WHATSAPP_NUMBER}&text=${whatsappMessage}`;
    
    // For development/testing: Open the WhatsApp link in a new window
    window.open(whatsappUrl, '_blank');
    
    // In a real implementation with WhatsApp Business API, you'd do something like:
    // await fetch('your-whatsapp-api-endpoint', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     phone: ADMIN_WHATSAPP_NUMBER,
    //     message: decodeURIComponent(whatsappMessage)
    //   })
    // });
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
  }
  
  // Simulate API call delay and store submission
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
