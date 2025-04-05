
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
import { 
  NameField, 
  EmailField, 
  PhoneField, 
  InquiryTypeField, 
  MessageField 
} from "./ContactFormFields";

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
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
      phone: "",
      inquiryType: "service",
      message: "",
    },
  });
  
  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    console.log("Form submitted:", data);
    
    // Simulate form submission for now - in a real app, this would send data to a backend
    setTimeout(() => {
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      form.reset();
      setIsSubmitting(false);
    }, 1500);
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
