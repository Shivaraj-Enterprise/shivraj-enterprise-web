
const SchemaOrg = () => {
  return (
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
  );
};

export default SchemaOrg;
