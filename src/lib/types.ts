
export type Pet = {
  id: string;
  userId: string; // Added for Firestore
  name: string;
  type: 'dog' | 'cat';
  breed: string;
  age: number; // in years
  weight: number; // in kg
  gender: 'male' | 'female';
  vaccinationStatus: string; 
  photoUrl: string; // URL of the uploaded photo (Firebase Storage URL or placeholder)
};

export type DailyLog = {
  id: string;
  userId: string; // Added for Firestore
  petId: string;
  date: string; // ISO date string YYYY-MM-DD
  mood: string; // e.g., 'Happy', 'Anxious', 'Playful', 'Lethargic'
  eatingHabits: string; // e.g., 'Ate well', 'Ate less', 'Refused food'
  elimination: string; // e.g., 'Normal', 'Diarrhea', 'Constipated'
  activity: string; // e.g., '2 short walks', '1 long run', 'Played fetch'
  notes?: string;
};

export const ReminderTypes = [
  'Feeding', 
  'Walk', 
  'Medication', 
  'Grooming', 
  'Vet Appointment', 
  'Playtime', 
  'Training', 
  'Other'
] as const;
export type ReminderType = typeof ReminderTypes[number];

export type Reminder = {
  id: string;
  userId: string;
  petId?: string; // Optional: link to a specific pet
  title: string;
  type: ReminderType;
  dateTime: string; // ISO string for combined date and time (will be stored as Firestore Timestamp)
  notes?: string;
  isCompleted: boolean;
  createdAt: string; // ISO string (will be stored as Firestore Timestamp)
  updatedAt: string; // ISO string (will be stored as Firestore Timestamp)
};

export type PetMemory = {
  id: string;
  userId: string;
  petId: string;
  mediaUrl: string; // URL to the photo/video in Firebase Storage
  mediaType: 'image' | 'video'; // For now, primarily 'image'
  title: string;
  description?: string;
  date: string; // ISO date string YYYY-MM-DD for when the memory occurred
  createdAt: string; // ISO string (will be stored as Firestore Timestamp)
  updatedAt: string; // ISO string (will be stored as Firestore Timestamp)
};

export const EmergencyContactTypes = [
  'Veterinarian',
  'Emergency Clinic',
  'Pet Sitter',
  'Family/Friend',
  'Other'
] as const;
export type EmergencyContactType = typeof EmergencyContactTypes[number];

export type EmergencyContact = {
  id: string;
  userId: string;
  name: string;
  type: EmergencyContactType;
  phone: string;
  address?: string;
  notes?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};
