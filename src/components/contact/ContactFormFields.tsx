
import React from "react";
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
import { UseFormReturn } from "react-hook-form";

interface FormFieldsProps {
  form: UseFormReturn<any>;
}

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

export const PhoneField = ({ form }: FormFieldsProps) => (
  <FormField
    control={form.control}
    name="phone"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-sm font-medium text-gray-700">Phone Number *</FormLabel>
        <FormControl>
          <Input
            placeholder="+1 555-123-4567"
            type="tel"
            {...field}
            className="w-full focus:ring-2 focus:ring-shivraj-500 focus:border-shivraj-500"
          />
        </FormControl>
        <FormDescription className="text-xs text-gray-500">
          Include country code (e.g., +1 for US, +44 for UK)
        </FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
);

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
