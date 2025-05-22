
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ReminderFormData, ReminderFormSchema } from "@/lib/schemas";
import { ReminderTypes, type Pet } from "@/lib/types";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect } from "react";

interface ReminderFormProps {
  pets: Pet[]; 
  onSubmit: (data: ReminderFormData) => Promise<void>;
  isSubmitting?: boolean;
  initialData?: Partial<ReminderFormData> & { id?: string }; 
  onClose?: () => void; 
}

export function ReminderForm({ pets, onSubmit, isSubmitting = false, initialData, onClose }: ReminderFormProps) {
  const form = useForm<ReminderFormData>({
    resolver: zodResolver(ReminderFormSchema),
    defaultValues: initialData ? {
      title: initialData.title || "",
      type: initialData.type || undefined,
      date: initialData.date ? new Date(initialData.date) : undefined,
      time: initialData.time || "",
      petId: initialData.petId || undefined,
      notes: initialData.notes || "",
    } : { // For new form - dynamic parts are initially undefined
      title: "",
      type: undefined,
      date: undefined, // Will be set in useEffect
      time: undefined, // Will be set in useEffect
      petId: undefined,
      notes: "",
    },
  });

  useEffect(() => {
    // If it's a new form (no initialData) and date/time haven't been set yet,
    // set them to current date/time. This runs client-side.
    if (!initialData && form.getValues('date') === undefined && form.getValues('time') === undefined) {
      form.reset({
        ...form.getValues(), // Preserve any other fields if needed
        date: new Date(),
        time: format(new Date(), "HH:mm"),
      });
    }
  }, [form, initialData]);


  async function handleSubmit(values: ReminderFormData) {
    await onSubmit(values);
    if (!initialData?.id) { 
      // Reset with new client-side date/time for the next new form
      form.reset({
        title: "",
        type: undefined,
        date: new Date(),
        time: format(new Date(), "HH:mm"),
        petId: undefined,
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Morning Feeding, Vet Checkup" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reminder type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ReminderTypes.map(type => (
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
            name="petId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>For Pet (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a pet" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">General (No specific pet)</SelectItem>
                    {pets.map(pet => (
                      <SelectItem key={pet.id} value={pet.id}>{pet.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } 
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time *</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Give with food, Check weight" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (initialData?.id ? "Saving..." : "Adding...") : (initialData?.id ? "Save Changes" : "Add Reminder")}
        </Button>
      </form>
    </Form>
  );
}
