
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { CountryCode, ContactFormData } from "@/models/ContactSubmission";

// Common country codes
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

interface PhoneFieldProps {
  form: UseFormReturn<any>;
}

const PhoneField = ({ form }: PhoneFieldProps) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(commonCountryCodes[0]);

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    const currentValue = form.getValues("phone") || "";
    const numberPart = currentValue.replace(/^\+\d+\s?/, "");
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

export default PhoneField;
