
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { motion } from "framer-motion";
import { ContactFormData } from "@/models/ContactSubmission";
import { submitContactForm } from "@/services/contactService";
import { 
  NameField, 
  EmailField, 
  PhoneField, 
  WhatsAppField,
  InquiryTypeField, 
  MessageField 
} from "./form-fields";

// Phone number regex that supports international format with country code
// Accepts formats like: +1 123-456-7890, +44 1234 567890, etc.
const phoneRegex = /^\+[1-9]\d{0,2}[\s-]?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,9}$/;

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 characters")
    .refine(val => phoneRegex.test(val), {
      message: "Please enter a valid phone number with country code (e.g. +91 99984 98311)",
    }),
  whatsapp: z.string().optional(),
  inquiryType: z.enum(["service", "job", "quote", "other"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "+91 ",
      whatsapp: "",
      inquiryType: "service",
      message: "",
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    console.log("Form submitted:", data);
    
    try {
      // Create a properly typed ContactFormData object
      const contactData: ContactFormData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        whatsapp: data.whatsapp,
        inquiryType: data.inquiryType,
        message: data.message,
      };
      
      // Submit form data and forward to WhatsApp (handled in the service)
      const submission = await submitContactForm(contactData);
      console.log("Submission created:", submission);
      
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error Sending Message",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-shivraj-800 mb-6">Send Us a Message</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <NameField form={form} />
            <EmailField form={form} />
            <PhoneField form={form} />
            <WhatsAppField form={form} />
            <InquiryTypeField form={form} />
            <MessageField form={form} />
            
            <Button 
              type="submit" 
              className="w-full bg-shivraj-600 hover:bg-shivraj-700 transition-colors flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : (
                <>
                  Send Message
                  <Send size={16} />
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </motion.div>
  );
};

export default ContactForm;
