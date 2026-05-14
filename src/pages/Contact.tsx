
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import PageHeader from "@/components/contact/PageHeader";
import ContactInformation from "@/components/contact/ContactInformation";
import ContactForm from "@/components/contact/ContactForm";
import LocationMap from "@/components/contact/LocationMap";
import SchemaOrg from "@/components/contact/SchemaOrg";

const Contact = () => {
  return (
    <Layout>
      <Helmet>
        <title>Contact Shivraj Enterprise – Vapi, Gujarat</title>
        <meta name="description" content="Get in touch with Shivraj Enterprise for manpower supply and housekeeping services in Vapi GIDC. Call +91 99984 98311 or send an inquiry." />
        <link rel="canonical" href="https://shivraj-enterprise.lovable.app/#/contact" />
        <meta property="og:title" content="Contact Shivraj Enterprise" />
        <meta property="og:description" content="Reach out for manpower and housekeeping services in Vapi GIDC, Gujarat." />
        <meta property="og:url" content="https://shivraj-enterprise.lovable.app/#/contact" />
      </Helmet>
      {/* Page Header */}
      <PageHeader />
      
      {/* Contact Information & Form */}
      <section className="section bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <ContactInformation />
            
            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <LocationMap />

      {/* Schema.org structured data for better SEO */}
      <SchemaOrg />
    </Layout>
  );
};

export default Contact;
