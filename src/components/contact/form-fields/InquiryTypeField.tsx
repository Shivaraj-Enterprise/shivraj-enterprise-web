
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ContactFormData } from "@/models/ContactSubmission";

interface InquiryTypeFieldProps {
  form: UseFormReturn<ContactFormData>;
}

const InquiryTypeField = ({ form }: InquiryTypeFieldProps) => (
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

export default InquiryTypeField;
