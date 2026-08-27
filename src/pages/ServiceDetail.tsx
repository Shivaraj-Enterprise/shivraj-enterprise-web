import { Navigate, useParams } from "react-router-dom";
import ServicePageShell from "@/components/services/ServicePageShell";
import { getServicePage } from "@/data/servicePages";

const ServiceDetail = ({ slug }: { slug?: string }) => {
  const params = useParams();
  const page = getServicePage(slug ?? params.slug ?? "");
  if (!page) return <Navigate to="/services" replace />;
  return <ServicePageShell page={page} />;
};

export default ServiceDetail;
