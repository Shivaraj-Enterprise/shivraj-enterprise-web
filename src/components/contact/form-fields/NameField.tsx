
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

interface NameFieldProps {
  form: UseFormReturn<any>;
}

const NameField = ({ form }: NameFieldProps) => (
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

export default NameField;
