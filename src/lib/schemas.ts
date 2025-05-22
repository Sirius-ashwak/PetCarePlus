
import { z } from 'zod';
import { ReminderTypes, EmergencyContactTypes } from './types';

export const PetFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(['dog', 'cat'], { required_error: "Pet type is required" }),
  breed: z.string().min(1, "Breed is required"),
  age: z.coerce.number().min(0, "Age must be a positive number").max(50, "Age seems too high"),
  weight: z.coerce.number().min(0.1, "Weight must be a positive number").max(200, "Weight seems too high"),
  gender: z.enum(['male', 'female'], { required_error: "Gender is required" }),
  vaccinationStatus: z.string().min(1, "Vaccination status is required"),
  photoFile: z.custom<File>((val) => val instanceof File, "Please upload an image file.").optional()
    .refine(file => !file || file.size <= 5 * 1024 * 1024, `Max image size is 5MB.`)
    .refine(
      file => !file || ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type),
      "Only .jpg, .jpeg, .png, .webp and .gif formats are supported."
    ),
});
export type PetFormData = z.infer<typeof PetFormSchema>;


export const DailyLogFormSchema = z.object({
  date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" }),
  mood: z.string().min(1, "Mood is required"),
  eatingHabits: z.string().min(1, "Eating habits are required"),
  elimination: z.string().min(1, "Elimination details are required"),
  activity: z.string().min(1, "Activity details are required"),
  notes: z.string().optional(),
});
export type DailyLogFormData = z.infer<typeof DailyLogFormSchema>;

export const SymptomCheckerSchema = z.object({
  petType: z.enum(['dog', 'cat'], { required_error: 'Pet type is required.' }),
  symptoms: z.string().min(3, { message: 'Please describe the symptoms (min. 3 characters).' }),
  breed: z.string().optional(),
  age: z.coerce.number().positive({ message: 'Age must be a positive number.' }).optional().or(z.literal('')),
});
export type SymptomCheckerData = z.infer<typeof SymptomCheckerSchema>;

export const PetNameGeneratorSchema = z.object({
  petType: z.enum(['dog', 'cat'], { required_error: 'Pet type is required.' }),
  style: z.string().optional().describe('Optional: A style or theme for the names (e.g., "playful", "elegant", "mythical").'),
  count: z.coerce.number().min(1).max(20).default(10).describe('Number of names to generate.'),
});
export type PetNameGeneratorData = z.infer<typeof PetNameGeneratorSchema>;

export const ReminderFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(ReminderTypes, { required_error: "Reminder type is required" }),
  date: z.date({ required_error: "Date is required" }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  petId: z.string().optional(),
  notes: z.string().optional(),
});
export type ReminderFormData = z.infer<typeof ReminderFormSchema>;

export const PetMemoryFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.date({ required_error: "Date of memory is required" }),
  description: z.string().optional(),
  mediaFile: z.custom<File>((val) => val instanceof File, "Please upload an image file.")
    .refine(file => file.size <= 5 * 1024 * 1024, `Max image size is 5MB.`)
    .refine(
      file => ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type),
      "Only .jpg, .jpeg, .png, .webp and .gif formats are supported."
    ),
  petId: z.string() // Required to associate memory with a pet
});
export type PetMemoryFormData = z.infer<typeof PetMemoryFormSchema>;

export const EmergencyContactFormSchema = z.object({
  name: z.string().min(2, "Name is required (min 2 characters)."),
  type: z.enum(EmergencyContactTypes, { required_error: "Contact type is required." }),
  phone: z.string().min(10, "Phone number is required (min 10 digits).").regex(/^[+]?[\d\s()-]+$/, "Invalid phone number format."),
  address: z.string().optional(),
  notes: z.string().optional(),
});
export type EmergencyContactFormData = z.infer<typeof EmergencyContactFormSchema>;
