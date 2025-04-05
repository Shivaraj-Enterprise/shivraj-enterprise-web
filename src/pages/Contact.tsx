
import { useState, FormEvent } from "react";
import { Phone, Mail, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Layout from "@/components/Layout";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState("service");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission - in a real app, this would send data to a backend
    setTimeout(() => {
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setInquiryType("service");
      setMessage("");
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-shivraj-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-shivraj-100 max-w-3xl mx-auto">
            Get in touch with our team for inquiries, quotes, or any questions
          </p>
        </div>
      </section>
      
      {/* Contact Information & Form */}
      <section className="section bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-shivraj-800 mb-6">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                Have questions about our services? Looking for staffing solutions? 
                Our team is ready to assist you. Contact us using any of the methods below 
                or fill out the form and we'll get back to you as soon as possible.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-shivraj-100 text-shivraj-600 flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-shivraj-800">Phone</h3>
                    <a href="tel:+919998498311" className="text-gray-600 hover:text-shivraj-600">
                      +91 99984 98311
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-shivraj-100 text-shivraj-600 flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-shivraj-800">Email</h3>
                    <a href="mailto:shivrajenterprise1234@gmail.com" className="text-gray-600 hover:text-shivraj-600 break-all">
                      shivrajenterprise1234@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-shivraj-100 text-shivraj-600 flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-shivraj-800">Location</h3>
                    <p className="text-gray-600">Vapi, Gujarat, India</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-shivraj-50 p-6 rounded-lg border border-shivraj-100">
                <h3 className="text-xl font-semibold text-shivraj-800 mb-4">Our Service Areas</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-shivraj-600 mr-2" />
                    <span>GIDC Vapi</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-shivraj-600 mr-2" />
                    <span>Daman</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-shivraj-600 mr-2" />
                    <span>Dadra and Nagar Haveli</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-shivraj-600 mr-2" />
                    <span>Daman and Diu</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h2 className="text-2xl font-bold text-shivraj-800 mb-6">Send Us a Message</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input 
                        type="text" 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-shivraj-500 focus:border-shivraj-500" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-shivraj-500 focus:border-shivraj-500" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input 
                        type="tel" 
                        id="phone" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-shivraj-500 focus:border-shivraj-500" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-1">
                        Inquiry Type *
                      </label>
                      <select 
                        id="inquiryType" 
                        value={inquiryType} 
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-shivraj-500 focus:border-shivraj-500" 
                        required
                      >
                        <option value="service">Service Inquiry</option>
                        <option value="job">Job Application</option>
                        <option value="quote">Request a Quote</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message *
                      </label>
                      <textarea 
                        id="message" 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-shivraj-500 focus:border-shivraj-500" 
                        required
                      ></textarea>
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        className="w-full bg-shivraj-600 hover:bg-shivraj-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
