
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { DailyLogFormData } from "@/lib/schemas";
import { DailyLogFormSchema } from "@/lib/schemas";
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
import { useState } from "react";

interface LogFormProps {
  petId: string;
  onSubmit: (data: DailyLogFormData & { petId: string }) => void;
  isSubmitting?: boolean;
}

export function LogForm({ petId, onSubmit, isSubmitting = false }: LogFormProps) {
  const form = useForm<DailyLogFormData>({
    resolver: zodResolver(DailyLogFormSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0], // Default to today
      mood: "",
      eatingHabits: "",
      elimination: "",
      activity: "",
      notes: "",
    },
  });

  function handleSubmit(values: DailyLogFormData) {
    onSubmit({ ...values, petId });
    form.reset({ 
        ...values, // Keep the date if needed, or reset all
        date: new Date().toISOString().split("T")[0],
        mood: "",
        eatingHabits: "",
        elimination: "",
        activity: "",
        notes: "",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-4 border rounded-lg shadow-sm bg-card">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mood</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Happy, Playful, Lethargic" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="eatingHabits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Eating Habits</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Ate all food, Picky today" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="elimination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Elimination (Poop/Pee)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Normal, Diarrhea, Less urine" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="activity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity/Walks</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 30 min walk, Played fetch" {...field} />
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
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Any other observations..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Adding Log..." : "Add Log Entry"}
        </Button>
      </form>
    </Form>
  );
}
