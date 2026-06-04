
const SchemaOrg = () => {
  return (
    <script type="application/ld+json">
      {`
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Shivraj Enterprise Pvt. Ltd.",
        "url": "https://shivraj-enterprise.lovable.app/",
        "logo": "https://shivraj-enterprise.lovable.app/placeholder.svg",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+919998498311",
          "contactType": "customer service",
          "email": "shivrajenterprise1234@gmail.com",
          "areaServed": ["Vapi GIDC Phase 1","Vapi GIDC Phase 2","Vapi GIDC Phase 3","Vapi GIDC Phase 4","Vapi","Ambheti","Balitha","Chala","Chandor","Chhiri","Karaya","Koparli","Morai","Mota Pondha","Namdha","Ozar","Pandor","Rata","Salvav","Vatar","Chanod","Chharwada","Dabhel","Dungra","Karvad","Chanvai","Daman","Dadra and Nagar Haveli"],
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
  );
};

export default SchemaOrg;
