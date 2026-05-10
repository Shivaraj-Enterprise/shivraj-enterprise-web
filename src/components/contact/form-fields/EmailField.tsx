
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ContactFormData } from "@/models/ContactSubmission";

interface EmailFieldProps {
  form: UseFormReturn<any>;
}

const EmailField = ({ form }: EmailFieldProps) => (
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

export default EmailField;
