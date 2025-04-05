
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Phone, Mail, MapPin, CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import Layout from "@/components/Layout";
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

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  inquiryType: z.string(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const Contact = () => {
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
    <Layout>
      {/* Page Header with animation */}
      <motion.section 
        className="bg-shivraj-800 text-white py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-shivraj-100 max-w-3xl mx-auto">
            Get in touch with our team for inquiries, quotes, or any questions
          </p>
        </div>
      </motion.section>
      
      {/* Contact Information & Form */}
      <section className="section bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-shivraj-800 mb-6">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                Have questions about our services? Looking for staffing solutions? 
                Our team is ready to assist you. Contact us using any of the methods below 
                or fill out the form and we'll get back to you as soon as possible.
              </p>
              
              <div className="space-y-6 mb-8">
                <motion.div 
                  className="flex items-start"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-12 h-12 rounded-full bg-shivraj-100 text-shivraj-600 flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-shivraj-800 text-lg">Phone</h3>
                    <a href="tel:+919998498311" className="text-gray-600 hover:text-shivraj-600 transition-colors">
                      +91 99984 98311
                    </a>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-12 h-12 rounded-full bg-shivraj-100 text-shivraj-600 flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-shivraj-800 text-lg">Email</h3>
                    <a href="mailto:shivrajenterprise1234@gmail.com" className="text-gray-600 hover:text-shivraj-600 transition-colors break-all">
                      shivrajenterprise1234@gmail.com
                    </a>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-12 h-12 rounded-full bg-shivraj-100 text-shivraj-600 flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-shivraj-800 text-lg">Location</h3>
                    <p className="text-gray-600">Vapi, Gujarat, India</p>
                  </div>
                </motion.div>
              </div>
              
              <div className="bg-shivraj-50 p-6 rounded-lg border border-shivraj-100 shadow-sm">
                <h3 className="text-xl font-semibold text-shivraj-800 mb-4">Our Service Areas</h3>
                <ul className="space-y-3">
                  {["GIDC Vapi", "Daman", "Dadra and Nagar Haveli", "Daman and Diu"].map((area, index) => (
                    <motion.li 
                      key={area} 
                      className="flex items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (index * 0.1), duration: 0.4 }}
                    >
                      <CheckCircle size={18} className="text-shivraj-600 mr-2" />
                      <span>{area}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
            
            {/* Contact Form */}
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
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-shivraj-800 mb-8 text-center">Find Us</h2>
          <div className="h-96 rounded-lg overflow-hidden shadow-md">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59940.32068729654!2d72.87068389221193!3d20.371612300000012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0ce6b7f146def%3A0xc11695a453f24ab8!2sVapi%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1712336964509!5m2!1sen!2sin"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Shivraj Enterprise Location"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Schema.org structured data for better SEO */}
      <script type="application/ld+json">
        {`
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Shivraj Enterprise Pvt. Ltd.",
          "url": "https://shivrajenterprise.com",
          "logo": "https://shivrajenterprise.com/logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+919998498311",
            "contactType": "customer service",
            "email": "shivrajenterprise1234@gmail.com",
            "areaServed": ["Vapi", "Daman", "Dadra and Nagar Haveli", "Daman and Diu"],
            "availableLanguage": ["en", "hi", "gu"]
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Vapi",
            "addressRegion": "Gujarat",
            "addressCountry": "IN"
          },
          "description": "Trusted manpower supply and staffing services company in Gujarat, India. Providing skilled, semi-skilled and unskilled labor across various industries."
        }
        `}
      </script>
    </Layout>
  );
};

export default Contact;
