
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface MessageFieldProps {
  form: UseFormReturn<any>;
}

const MessageField = ({ form }: MessageFieldProps) => (
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

export default MessageField;
