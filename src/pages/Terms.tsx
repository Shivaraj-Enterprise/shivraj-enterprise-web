import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import logo from "@/assets/logo.png";

const generalTerms = [
  ["Work Order", "Written purchase order issued by the company or organization for agreed terms."],
  ["Labour Licence", "Will be obtained after finalization of contract at client cost; copy submitted to the client within one month."],
  ["Supervisor", "One supervisor deployed for every 20 workers to ensure smooth & efficient supervision; charges as per price schedule."],
  ["Government Compliance", "All government liabilities and minimum wages will be revised periodically per the latest rules of the Government and Labour Department."],
  ["Safety Equipment", "Necessary safety gear and tools, if required, will be provided to all contract workers."],
  ["Uniform Provision", "If uniforms are required for the workmen, they will be supplied by the company."],
  ["Leave Policy", "A minimum of two contingency leaves per month will be granted to casual workers."],
  ["Official Travel Allowance", "Casual workers assigned tasks outside premises receive two hours of overtime allowance plus transport and accommodation expenses."],
  ["Commitment to Quality", "We are committed to providing honest, hardworking, and high-quality labour to your organization."],
];

const statutory = [
  ["Provident Fund", "Employee contribution @12% deducted from wages; Employer contribution @13% paid by the company; remitted to Government by the contractor."],
  ["E.S.I.C (where applicable)", "Employee contribution @0.75% deducted from wages; Employer contribution @3.75% paid by the company; remitted to Government by the contractor."],
  ["T.D.S", "Tax deducted at source as per applicable rate; TDS certificate issued by the company after the financial year."],
  ["Other Payments", "Bonus @8.33%, leave @6%, and paid holidays to be borne by the company."],
  ["Service Charges", "12% on the gross bill amount."],
  ["Overtime Payment", "Charged extra at double the normal contract rates."],
  ["Terms of Payment", "Monthly bill submitted by month-end; payment to be released by the 7th of every month."],
  ["Medical Assistance", "Client is responsible for medical assistance and vehicle arrangement against any accident at site. The contractor shall not be held responsible."],
  ["Notice", "One month advance notice or one month notice pay required for discontinuation of services."],
  ["Workman Compensation Policy", "Policy charges 2%."],
  ["Accommodation & Allowances", "HRA and Conveyance applicable. Any housing/accommodation for workmen will be provided by the Client Company."],
  ["Correspondence", "All correspondence at office address: Plot No. 228, A/303, Ved Vihar, Near Oswal Samaj Hall, Chharwada, Vapi-396191."],
];

const Terms = () => {
  return (
    <Layout>
      <section className="bg-shivraj-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-3 shadow-md">
              <img src={logo} alt="Shivraj Enterprise logo" className="h-12 w-12 object-contain" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-lg text-shivraj-100 max-w-3xl mx-auto">
            General terms of contract and statutory obligations for our services
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-shivraj-800 mb-6">General Terms of Contract</h2>
          <div className="space-y-4 mb-12">
            {generalTerms.map(([title, desc]) => (
              <div key={title} className="border-l-4 border-shivraj-600 bg-shivraj-50 p-4 rounded-r">
                <p className="font-semibold text-shivraj-800">{title}</p>
                <p className="text-gray-700 text-sm mt-1">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-shivraj-800 mb-6">Statutory Obligations</h2>
          <div className="space-y-4">
            {statutory.map(([title, desc]) => (
              <div key={title} className="border-l-4 border-shivraj-600 bg-shivraj-50 p-4 rounded-r">
                <p className="font-semibold text-shivraj-800">{title}</p>
                <p className="text-gray-700 text-sm mt-1">{desc}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-10 text-center">
            These terms are summarized from the official Shivraj Enterprise quotation document.
            For full terms, please refer to our company profile.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
