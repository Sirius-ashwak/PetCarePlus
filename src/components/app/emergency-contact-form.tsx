
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EmergencyContactFormData, EmergencyContactFormSchema } from "@/lib/schemas";
import { EmergencyContactTypes, type EmergencyContact } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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

interface EmergencyContactFormProps {
  onSubmit: (data: EmergencyContactFormData) => Promise<void>;
  isSubmitting?: boolean;
  initialData?: EmergencyContact; 
  onClose?: () => void;
}

export function EmergencyContactForm({ 
  onSubmit, 
  isSubmitting = false, 
  initialData, 
  onClose 
}: EmergencyContactFormProps) {
  const form = useForm<EmergencyContactFormData>({
    resolver: zodResolver(EmergencyContactFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || undefined,
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      notes: initialData?.notes || "",
    },
  });

  async function handleSubmit(values: EmergencyContactFormData) {
    await onSubmit(values);
    if (!initialData?.id) { 
      form.reset({
        name: "",
        type: undefined,
        phone: "",
        address: "",
        notes: "",
      });
    }
    onClose?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Dr. Smith, Pet Emergency Clinic" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Type *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EmergencyContactTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number *</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="e.g., (555) 123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., 123 Vet Street, Animal City" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Prefers calls after 5 PM, Ask for Dr. Jane" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (initialData?.id ? "Saving..." : "Adding...") : (initialData?.id ? "Save Changes" : "Add Contact")}
        </Button>
      </form>
    </Form>
  );
}
