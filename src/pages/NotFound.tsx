import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import logo from "@/assets/logo.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Helmet>
        <title>Page not found (404) – Shivraj Enterprise</title>
        <meta name="description" content="The page you are looking for does not exist. Return to Shivraj Enterprise's homepage for manpower and housekeeping services in Vapi GIDC." />
        <meta name="robots" content="noindex,follow" />
      </Helmet>
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Shivraj Enterprise logo" className="h-20 w-20 object-contain" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
