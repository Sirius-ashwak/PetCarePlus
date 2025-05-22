
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SymptomCheckerData } from "@/lib/schemas";
import { SymptomCheckerSchema } from "@/lib/schemas";
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

interface SymptomCheckerFormProps {
  onSubmit: (data: SymptomCheckerData) => void;
  isSubmitting?: boolean;
}

export function SymptomCheckerForm({ onSubmit, isSubmitting = false }: SymptomCheckerFormProps) {
  const form = useForm<SymptomCheckerData>({
    resolver: zodResolver(SymptomCheckerSchema),
    defaultValues: {
      petType: undefined,
      symptoms: "",
      breed: "",
      age: undefined,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="petType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pet Type *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pet type (Dog or Cat)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="dog">Dog</SelectItem>
                  <SelectItem value="cat">Cat</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="symptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symptoms *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your pet's symptoms (e.g., lethargy, vomiting, coughing)"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breed (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Labrador, Siamese" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age in years (Optional)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 5" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Analyzing Symptoms..." : "Get AI Advice"}
        </Button>
      </form>
    </Form>
  );
}
