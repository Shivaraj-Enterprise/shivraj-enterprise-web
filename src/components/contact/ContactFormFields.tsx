import React, { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Phone, ChevronDown } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CountryCode } from "@/models/ContactSubmission";

interface FormFieldsProps {
  form: UseFormReturn<any>;
}

// Common country codes - this would ideally be in a separate file
const commonCountryCodes: CountryCode[] = [
  { code: "IN", name: "India", dial_code: "+91" },
  { code: "US", name: "United States", dial_code: "+1" },
  { code: "GB", name: "United Kingdom", dial_code: "+44" },
  { code: "CA", name: "Canada", dial_code: "+1" },
  { code: "AU", name: "Australia", dial_code: "+61" },
  { code: "DE", name: "Germany", dial_code: "+49" },
  { code: "FR", name: "France", dial_code: "+33" },
  { code: "JP", name: "Japan", dial_code: "+81" },
  { code: "CN", name: "China", dial_code: "+86" },
  { code: "BR", name: "Brazil", dial_code: "+55" },
];

export const NameField = ({ form }: FormFieldsProps) => (
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
);

export const EmailField = ({ form }: FormFieldsProps) => (
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
);

export const PhoneField = ({ form }: FormFieldsProps) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(commonCountryCodes[0]);

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    const currentValue = form.getValues("phone") || "";
    // Extract the number part without country code
    const numberPart = currentValue.replace(/^\+\d+\s?/, "");
    // Set the new value with the selected country code
    form.setValue("phone", `${country.dial_code} ${numberPart}`, { shouldValidate: true });
  };

  return (
    <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-gray-700">Phone Number *</FormLabel>
          <FormControl>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-24 flex justify-between items-center">
                    {selectedCountry.dial_code} <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-56 overflow-y-auto w-60">
                  {commonCountryCodes.map((country) => (
                    <DropdownMenuItem 
                      key={country.code}
                      onClick={() => handleCountrySelect(country)}
                      className="cursor-pointer"
                    >
                      <span className="font-semibold mr-2">{country.dial_code}</span> {country.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Input
                placeholder="99984 98311"
                type="tel"
                className="w-full focus:ring-2 focus:ring-shivraj-500 focus:border-shivraj-500"
                value={field.value.replace(/^\+\d+\s?/, "")}
                onChange={(e) => {
                  field.onChange(`${selectedCountry.dial_code} ${e.target.value}`);
                }}
              />
            </div>
          </FormControl>
          <FormDescription className="text-xs text-gray-500">
            Example format: {selectedCountry.dial_code} 99984 98311
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const WhatsAppField = ({ form }: FormFieldsProps) => {
  const [usePhoneNumber, setUsePhoneNumber] = useState(false);
  const phoneValue = form.getValues("phone");

  React.useEffect(() => {
    if (usePhoneNumber && phoneValue) {
      form.setValue("whatsapp", phoneValue);
    }
  }, [usePhoneNumber, phoneValue, form]);

  return (
    <FormField
      control={form.control}
      name="whatsapp"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-gray-700">
            WhatsApp Number <span className="text-xs font-normal">(optional)</span>
          </FormLabel>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="use-same-number"
              checked={usePhoneNumber}
              onChange={() => {
                setUsePhoneNumber(!usePhoneNumber);
                if (!usePhoneNumber) {
                  form.setValue("whatsapp", phoneValue);
                }
              }}
              className="mr-2 h-4 w-4"
            />
            <label htmlFor="use-same-number" className="text-sm text-gray-600">
              Same as phone number
            </label>
          </div>
          <FormControl>
            <Input
              placeholder="+91 99984 98311"
              type="tel"
              {...field}
              disabled={usePhoneNumber}
              className="w-full focus:ring-2 focus:ring-shivraj-500 focus:border-shivraj-500"
            />
          </FormControl>
          <FormDescription className="text-xs text-gray-500">
            Include country code (e.g., +91 for India)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const InquiryTypeField = ({ form }: FormFieldsProps) => (
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
);

export const MessageField = ({ form }: FormFieldsProps) => (
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
);
