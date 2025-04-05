
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { ContactFormData } from "@/models/ContactSubmission";

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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Full Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your name" 
                      {...field} 
                      className="w-full focus:ring-2 focus:ring-shivraj-500 focus:border-shivraj-500" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Email Address *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your email" 
                      type="email" 
                      {...field} 
                      className="w-full focus:ring-2 focus:ring-shivraj-500 focus:border-shivraj-500" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Phone Number *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your phone number" 
                      type="tel" 
                      {...field} 
                      className="w-full focus:ring-2 focus:ring-shivraj-500 focus:border-shivraj-500" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="inquiryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Inquiry Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full focus:ring-2 focus:ring-shivraj-500 focus:border-shivraj-500">
                        <SelectValue placeholder="Select an inquiry type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="service">Service Inquiry</SelectItem>
                      <SelectItem value="job">Job Application</SelectItem>
                      <SelectItem value="quote">Request a Quote</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Message *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="How can we help you?" 
                      {...field}
                      rows={5}
                      className="w-full focus:ring-2 focus:ring-shivraj-500 focus:border-shivraj-500" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
