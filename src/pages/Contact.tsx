
import Layout from "@/components/Layout";
import PageHeader from "@/components/contact/PageHeader";
import ContactInformation from "@/components/contact/ContactInformation";
import ContactForm from "@/components/contact/ContactForm";
import LocationMap from "@/components/contact/LocationMap";
import SchemaOrg from "@/components/contact/SchemaOrg";

const Contact = () => {
  return (
    <Layout>
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
