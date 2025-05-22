
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { PetMemoryFormData } from "@/lib/schemas";
import { PetMemoryFormSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react";

interface MemoryFormProps {
  petId: string;
  onSubmit: (data: PetMemoryFormData & { petId: string; mediaFile: File }) => Promise<void>;
  isSubmitting?: boolean;
  onClose?: () => void;
}

export function MemoryForm({ petId, onSubmit, isSubmitting = false, onClose }: MemoryFormProps) {
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  const form = useForm<PetMemoryFormData>({
    resolver: zodResolver(PetMemoryFormSchema),
    defaultValues: {
      title: "",
      date: new Date(),
      description: "",
      mediaFile: undefined,
      petId: petId,
    },
  });

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const currentPreview = mediaPreview;
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }
      setMediaPreview(URL.createObjectURL(file));
      form.setValue("mediaFile", file, { shouldValidate: true });
    }
  };

  const triggerFileInput = () => {
    document.getElementById('mediaFile')?.click();
  };

  async function handleSubmit(values: PetMemoryFormData) {
    if (!values.mediaFile) {
      form.setError("mediaFile", { type: "manual", message: "A media file is required." });
      return;
    }
    await onSubmit({ ...values, petId, mediaFile: values.mediaFile });
    form.reset();
    setMediaPreview(null);
    onClose?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="mediaFile"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <FormLabel htmlFor="mediaFile" className="sr-only">Media File</FormLabel>
              <div
                className="relative w-full h-48 rounded-md border-2 border-dashed border-muted-foreground flex items-center justify-center cursor-pointer group hover:border-primary transition-colors"
                onClick={triggerFileInput}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && triggerFileInput()}
                aria-label="Upload media file"
              >
                {mediaPreview ? (
                  <Image
                    src={mediaPreview}
                    alt="Media preview"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-md"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Camera className="w-12 h-12 mx-auto mb-2" />
                    <p>Click to upload image</p>
                    <p className="text-xs">(Max 5MB, JPG/PNG/GIF/WEBP)</p>
                  </div>
                )}
                 <Input 
                    id="mediaFile"
                    type="file" 
                    accept="image/jpeg,image/png,image/webp,image/gif" 
                    className="hidden"
                    onChange={(e) => {
                      field.onChange(e.target.files?.[0]); // For react-hook-form
                      handleMediaChange(e); // For preview
                    }}
                  />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., First Beach Day, Park Adventures" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Memory *</FormLabel>
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
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="A short story about this memory..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving Memory..." : "Add Memory"}
        </Button>
      </form>
    </Form>
  );
}

