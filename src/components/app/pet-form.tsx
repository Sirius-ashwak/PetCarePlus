
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { PetFormData } from "@/lib/schemas";
import { PetFormSchema } from "@/lib/schemas";
import type { Pet } from '@/lib/types';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Camera } from "lucide-react";

interface PetFormProps {
  pet?: Pet;
  onSubmit: (data: PetFormData & { photoFile?: File }) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

export function PetForm({ pet, onSubmit, isSubmitting = false, submitButtonText = "Save Pet" }: PetFormProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(pet?.photoUrl || null);

  const form = useForm<PetFormData>({
    resolver: zodResolver(PetFormSchema),
    defaultValues: {
      name: pet?.name || "",
      type: pet?.type || undefined,
      breed: pet?.breed || "",
      age: pet?.age || undefined,
      weight: pet?.weight || undefined,
      gender: pet?.gender || undefined,
      vaccinationStatus: pet?.vaccinationStatus || "",
      photoFile: undefined,
    },
  });

 useEffect(() => {
    if (pet?.photoUrl) {
      setPhotoPreview(pet.photoUrl);
    }
  }, [pet?.photoUrl]);


  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const currentPreview = photoPreview;
      if (currentPreview && currentPreview.startsWith('blob:')) {
        URL.revokeObjectURL(currentPreview);
      }
      setPhotoPreview(URL.createObjectURL(file));
      form.setValue("photoFile", file, { shouldValidate: true });
    }
  };

  const triggerFileInput = () => {
    document.getElementById('photoFile')?.click();
  };

  function handleSubmit(values: PetFormData) {
    onSubmit({ ...values, photoFile: values.photoFile });
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>{pet ? "Edit Pet Profile" : "Add New Pet"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div
                className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-primary cursor-pointer group"
                onClick={triggerFileInput}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && triggerFileInput()}
                aria-label="Upload pet photo"
              >
                <Image
                  src={photoPreview || `https://placehold.co/300x300.png?text=${form.getValues('name')?.charAt(0) || 'P'}`}
                  alt={pet?.name || "Pet photo placeholder"}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                  data-ai-hint="pet animal"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-opacity">
                  <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
               <FormField
                control={form.control}
                name="photoFile"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormLabel>Photo</FormLabel>
                    <FormControl>
                      <Input 
                        id="photoFile"
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          field.onChange(e.target.files?.[0]);
                          handlePhotoChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Buddy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pet Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pet type" />
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
                name="breed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breed</FormLabel>
                    <FormControl>
                      <Input placeholder="Golden Retriever" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age (years)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vaccinationStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vaccination Status</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Up to date, due for boosters in June..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : submitButtonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
