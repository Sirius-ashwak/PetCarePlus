
"use client";

import type { Pet, DailyLog, Reminder, ReminderType, PetMemory, EmergencyContact, EmergencyContactType } from '@/lib/types';
import type { ReminderFormData, PetMemoryFormData, EmergencyContactFormData } from '@/lib/schemas';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';
import { db, storage } from '@/lib/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { useToast } from '@/hooks/use-toast'; 

interface AppDataContextType {
  pets: Pet[];
  addPet: (petData: Omit<Pet, 'id' | 'photoUrl' | 'userId'> & { photoFile?: File }) => Promise<void>;
  updatePet: (petData: Pet & { photoFile?: File }) => Promise<void>;
  deletePet: (petId: string) => Promise<void>;
  getPetById: (petId: string) => Pet | undefined;
  
  logs: DailyLog[];
  addLog: (logData: Omit<DailyLog, 'id' | 'userId'>) => Promise<void>;
  getLogsByPetId: (petId: string) => DailyLog[];
  deleteLog: (logId: string) => Promise<void>;

  reminders: Reminder[];
  addReminder: (reminderData: ReminderFormData) => Promise<void>;
  updateReminder: (reminderId: string, dataToUpdate: Partial<Omit<Reminder, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteReminder: (reminderId: string) => Promise<void>;
  getRemindersByUserId: () => Reminder[];

  memories: PetMemory[];
  addMemory: (memoryData: PetMemoryFormData & {petId: string; mediaFile: File}) => Promise<void>;
  deleteMemory: (memoryId: string, mediaUrl: string) => Promise<void>;
  getMemoriesByPetId: (petId: string) => PetMemory[];

  emergencyContacts: EmergencyContact[];
  addEmergencyContact: (contactData: EmergencyContactFormData) => Promise<void>;
  updateEmergencyContact: (contactId: string, contactData: Partial<EmergencyContactFormData>) => Promise<void>;
  deleteEmergencyContact: (contactId: string) => Promise<void>;
  getEmergencyContactsByUserId: () => EmergencyContact[];

  loadingData: boolean;
  clearData: () => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const uploadPetPhoto = async (userId: string, petId: string, photoFile: File): Promise<string> => {
  const filePath = `users/${userId}/pets/${petId}/profile/${photoFile.name}-${Date.now()}`;
  const fileRef = storageRef(storage, filePath);
  await uploadBytes(fileRef, photoFile);
  return getDownloadURL(fileRef);
};

const uploadMemoryMedia = async (userId: string, petId: string, memoryId: string, mediaFile: File): Promise<string> => {
  const filePath = `users/${userId}/pets/${petId}/memories/${memoryId}/${mediaFile.name}-${Date.now()}`;
  const fileRef = storageRef(storage, filePath);
  await uploadBytes(fileRef, mediaFile);
  return getDownloadURL(fileRef);
};


// Helper to convert Firestore Timestamps to ISO strings
const convertTimestampToISO = (data: any, fields: string[]): any => {
  const converted = { ...data };
  fields.forEach(field => {
    if (converted[field] instanceof Timestamp) {
      converted[field] = converted[field].toDate().toISOString();
    }
  });
  return converted;
};


export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pets, setPets] = useState<Pet[]>([]);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [memories, setMemories] = useState<PetMemory[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const clearData = useCallback(() => {
    setPets([]);
    setLogs([]);
    setReminders([]);
    setMemories([]);
    setEmergencyContacts([]);
  }, []);

  const fetchPets = useCallback(async (currentUserId: string) => {
    try {
      const petsCol = collection(db, 'pets');
      const q = query(petsCol, where('userId', '==', currentUserId), orderBy('name', 'asc'));
      const petSnapshot = await getDocs(q);
      const userPets = petSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Pet));
      setPets(userPets);
    } catch (error) {
      console.error("Error fetching pets:", error);
      toast({ title: "Error", description: "Could not load pet profiles.", variant: "destructive" });
      setPets([]);
    }
  }, [toast]);

  const fetchLogs = useCallback(async (currentUserId: string) => {
    try {
      const logsCol = collection(db, 'logs');
      const q = query(logsCol, where('userId', '==', currentUserId), orderBy('date', 'desc'));
      const logSnapshot = await getDocs(q);
      const userLogs = logSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as DailyLog));
      setLogs(userLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast({ title: "Error", description: "Could not load daily logs.", variant: "destructive" });
      setLogs([]);
    }
  }, [toast]);

  const fetchReminders = useCallback(async (currentUserId: string) => {
    try {
      const remindersCol = collection(db, 'reminders');
      const q = query(remindersCol, where('userId', '==', currentUserId), orderBy('dateTime', 'asc'));
      const reminderSnapshot = await getDocs(q);
      const userReminders = reminderSnapshot.docs.map(d => {
        const data = d.data();
        return convertTimestampToISO(
            { id: d.id, ...data }, 
            ['dateTime', 'createdAt', 'updatedAt']
        ) as Reminder;
      });
      setReminders(userReminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      toast({ title: "Error", description: "Could not load reminders.", variant: "destructive" });
      setReminders([]);
    }
  }, [toast]);

  const fetchMemories = useCallback(async (currentUserId: string) => {
    try {
      const memoriesCol = collection(db, 'memories');
      const q = query(memoriesCol, where('userId', '==', currentUserId), orderBy('date', 'desc'));
      const memorySnapshot = await getDocs(q);
      const userMemories = memorySnapshot.docs.map(d => {
        const data = d.data();
        return convertTimestampToISO(
            { id: d.id, ...data },
            ['date', 'createdAt', 'updatedAt']
        ) as PetMemory;
      });
      setMemories(userMemories);
    } catch (error) {
      console.error("Error fetching memories:", error);
      toast({ title: "Error", description: "Could not load pet memories.", variant: "destructive" });
      setMemories([]);
    }
  }, [toast]);

  const fetchEmergencyContacts = useCallback(async (currentUserId: string) => {
    try {
      const contactsCol = collection(db, 'emergencyContacts');
      const q = query(contactsCol, where('userId', '==', currentUserId), orderBy('name', 'asc'));
      const contactSnapshot = await getDocs(q);
      const userContacts = contactSnapshot.docs.map(d => {
         const data = d.data();
         return convertTimestampToISO(
            { id: d.id, ...data },
            ['createdAt', 'updatedAt']
        ) as EmergencyContact;
      });
      setEmergencyContacts(userContacts);
    } catch (error) {
      console.error("Error fetching emergency contacts:", error);
      toast({ title: "Error", description: "Could not load emergency contacts.", variant: "destructive" });
      setEmergencyContacts([]);
    }
  }, [toast]);
  
  useEffect(() => {
    if (isMounted && user) {
      setLoadingData(true);
      Promise.all([
        fetchPets(user.id), 
        fetchLogs(user.id),
        fetchReminders(user.id),
        fetchMemories(user.id),
        fetchEmergencyContacts(user.id),
      ]).finally(() => {
        setLoadingData(false);
      });
    } else if (!user) {
      clearData();
      setLoadingData(false);
    }
  }, [user, isMounted, fetchPets, fetchLogs, fetchReminders, fetchMemories, fetchEmergencyContacts, clearData]);

  const addPet = async (petData: Omit<Pet, 'id' | 'photoUrl' | 'userId'> & { photoFile?: File }) => {
    if (!user) throw new Error("User not authenticated");
    let photoUrl = `https://placehold.co/300x300.png?text=${encodeURIComponent(petData.name.charAt(0) || 'P')}`;
    
    const newPetData = {
      ...petData,
      userId: user.id,
      photoUrl, // temp placeholder
      age: Number(petData.age),
      weight: Number(petData.weight),
    };
    
    try {
      const docRef = await addDoc(collection(db, 'pets'), newPetData);
      const newPetWithId: Pet = { ...newPetData, id: docRef.id, photoUrl };

      if (petData.photoFile) {
         const finalPhotoUrl = await uploadPetPhoto(user.id, docRef.id, petData.photoFile);
         await updateDoc(doc(db, 'pets', docRef.id), { photoUrl: finalPhotoUrl });
         newPetWithId.photoUrl = finalPhotoUrl;
      }

      setPets(prevPets => [...prevPets, newPetWithId].sort((a,b) => a.name.localeCompare(b.name)));
    } catch (error) {
        console.error("Error adding pet to Firestore:", error);
        toast({ title: "Error Adding Pet", description: "Could not save pet profile.", variant: "destructive" });
        throw error;
    }
  };

  const updatePet = async (updatedPetData: Pet & { photoFile?: File }) => {
    if (!user) throw new Error("User not authenticated");
    let photoUrl = updatedPetData.photoUrl;

    if (updatedPetData.photoFile) {
      try {
        const oldPet = pets.find(p => p.id === updatedPetData.id);
        if (oldPet && oldPet.photoUrl && !oldPet.photoUrl.includes('placehold.co') && oldPet.photoUrl !== photoUrl) {
           try {
             const oldPhotoRef = storageRef(storage, oldPet.photoUrl);
             await deleteObject(oldPhotoRef);
           } catch (deleteError) {
             console.warn("Could not delete old photo:", deleteError);
           }
        }
        photoUrl = await uploadPetPhoto(user.id, updatedPetData.id, updatedPetData.photoFile);
      } catch (error) {
        console.error("Error uploading new photo:", error);
        toast({ title: "Photo Update Failed", description: "Could not update pet photo.", variant: "destructive" });
        // Keep original photoUrl if upload fails
      }
    }
    
    const petRef = doc(db, 'pets', updatedPetData.id);
    // Remove photoFile from the object being sent to Firestore
    const { photoFile, ...finalDataToUpdate } = {
        ...updatedPetData,
        photoUrl, // This will be the new URL or the original one if upload failed/no new file
        age: Number(updatedPetData.age),
        weight: Number(updatedPetData.weight),
    };

    try {
      await updateDoc(petRef, finalDataToUpdate);
      setPets(prevPets =>
        prevPets.map(p => (p.id === updatedPetData.id ? { ...finalDataToUpdate } : p)) // Use finalDataToUpdate which has correct photoUrl
        .sort((a,b) => a.name.localeCompare(b.name))
      );
    } catch (error) {
      console.error("Error updating pet in Firestore:", error);
      toast({ title: "Error Updating Pet", description: "Could not update pet profile.", variant: "destructive" });
      throw error;
    }
  };

  const deletePet = async (petId: string) => {
    if (!user) throw new Error("User not authenticated");
    const petToDelete = pets.find(p => p.id === petId);
    try {
      if (petToDelete && petToDelete.photoUrl && !petToDelete.photoUrl.includes('placehold.co')) {
        try {
            const photoRef = storageRef(storage, petToDelete.photoUrl);
            await deleteObject(photoRef);
        } catch (storageError: any) {
            if (storageError.code !== 'storage/object-not-found') {
              console.warn(`Failed to delete photo for pet ${petId}:`, storageError);
            }
        }
      }
      
      const batch = writeBatch(db);
      batch.delete(doc(db, 'pets', petId));

      const logsCol = collection(db, 'logs');
      const qLogs = query(logsCol, where('userId', '==', user.id), where('petId', '==', petId));
      const logSnapshot = await getDocs(qLogs);
      logSnapshot.docs.forEach(d => batch.delete(d.ref));
      
      const remindersCol = collection(db, 'reminders');
      const qReminders = query(remindersCol, where('userId', '==', user.id), where('petId', '==', petId));
      const reminderSnapshot = await getDocs(qReminders);
      reminderSnapshot.docs.forEach(d => batch.delete(d.ref));

      const memoriesCol = collection(db, 'memories');
      const qMemories = query(memoriesCol, where('userId', '==', user.id), where('petId', '==', petId));
      const memorySnapshot = await getDocs(qMemories);
      for (const d of memorySnapshot.docs) {
          const memoryDoc = d.data() as PetMemory;
          if (memoryDoc.mediaUrl && !memoryDoc.mediaUrl.includes('placehold.co')) {
            try {
                const memoryMediaRef = storageRef(storage, memoryDoc.mediaUrl);
                await deleteObject(memoryMediaRef);
            } catch (storageError: any) {
                if (storageError.code !== 'storage/object-not-found') {
                    console.warn(`Failed to delete media for memory ${d.id}:`, storageError);
                }
            }
          }
          batch.delete(d.ref);
      }

      await batch.commit();

      setPets(prevPets => prevPets.filter(p => p.id !== petId));
      setLogs(prevLogs => prevLogs.filter(l => l.petId !== petId));
      setReminders(prevReminders => prevReminders.filter(r => r.petId !== petId));
      setMemories(prevMemories => prevMemories.filter(m => m.petId !== petId));

    } catch (error) {
        console.error("Error deleting pet and associated data:", error);
        toast({ title: "Error Deleting Pet", description: "Could not delete pet profile and related data.", variant: "destructive" });
        throw error;
    }
  };

  const getPetById = (petId: string) => pets.find(p => p.id === petId);

  const addLog = async (logData: Omit<DailyLog, 'id' | 'userId'>) => {
    if (!user) throw new Error("User not authenticated");
    const newLogData = { ...logData, userId: user.id };
    try {
        const docRef = await addDoc(collection(db, 'logs'), newLogData);
        setLogs(prevLogs => [{ ...newLogData, id: docRef.id }, ...prevLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
        console.error("Error adding log:", error);
        toast({ title: "Error Adding Log", description: "Could not save log entry.", variant: "destructive" });
        throw error;
    }
  };

  const getLogsByPetId = (petId: string) => {
    return logs.filter(log => log.petId === petId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const deleteLog = async (logId: string) => {
    if (!user) throw new Error("User not authenticated");
    try {
        await deleteDoc(doc(db, 'logs', logId));
        setLogs(prevLogs => prevLogs.filter(l => l.id !== logId));
    } catch (error) {
        console.error("Error deleting log:", error);
        toast({ title: "Error Deleting Log", description: "Could not delete log entry.", variant: "destructive" });
        throw error;
    }
  };

  const addReminder = async (reminderData: ReminderFormData) => {
    if (!user) throw new Error("User not authenticated");

    const [hours, minutes] = reminderData.time.split(':').map(Number);
    const combinedDateTime = new Date(reminderData.date);
    combinedDateTime.setHours(hours, minutes, 0, 0);

    const newReminderData = {
      userId: user.id,
      petId: reminderData.petId || null, 
      title: reminderData.title,
      type: reminderData.type as ReminderType,
      dateTime: Timestamp.fromDate(combinedDateTime),
      notes: reminderData.notes || "",
      isCompleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    try {
      const docRef = await addDoc(collection(db, 'reminders'), newReminderData);
      // Convert Timestamps to ISO strings for local state
      const addedReminderForState = {
        ...newReminderData,
        id: docRef.id,
        dateTime: combinedDateTime.toISOString(),
        createdAt: new Date().toISOString(), // Approximate client time for immediate UI update
        updatedAt: new Date().toISOString(), // Approximate client time
      } as Reminder;

      setReminders(prevReminders => 
        [...prevReminders, addedReminderForState].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
      );
      toast({ title: "Reminder Added", description: `"${reminderData.title}" has been scheduled.` });
    } catch (error) {
      console.error("Error adding reminder:", error);
      toast({ title: "Error Adding Reminder", description: "Could not save reminder.", variant: "destructive" });
      throw error;
    }
  };

  const updateReminder = async (reminderId: string, dataToUpdate: Partial<Omit<Reminder, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) => {
    if (!user) throw new Error("User not authenticated");
    const reminderRef = doc(db, 'reminders', reminderId);
    
    const updatePayload: any = { ...dataToUpdate, updatedAt: serverTimestamp() };
    if (dataToUpdate.dateTime) { 
        updatePayload.dateTime = Timestamp.fromDate(new Date(dataToUpdate.dateTime));
    }

    try {
      await updateDoc(reminderRef, updatePayload);
      // For optimistic update, find and update the local reminder
      setReminders(prevReminders =>
        prevReminders.map(r => {
          if (r.id === reminderId) {
            const updatedReminder = { ...r, ...dataToUpdate, updatedAt: new Date().toISOString() };
            if (dataToUpdate.dateTime) {
              updatedReminder.dateTime = new Date(dataToUpdate.dateTime).toISOString();
            }
            return updatedReminder;
          }
          return r;
        }).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
      );
      toast({ title: "Reminder Updated", description: "The reminder has been updated." });
    } catch (error) {
      console.error("Error updating reminder:", error);
      toast({ title: "Error Updating Reminder", description: "Could not update reminder.", variant: "destructive" });
      throw error;
    }
  };
  
  const deleteReminder = async (reminderId: string) => {
    if (!user) throw new Error("User not authenticated");
    try {
      await deleteDoc(doc(db, 'reminders', reminderId));
      setReminders(prevReminders => prevReminders.filter(r => r.id !== reminderId));
      toast({ title: "Reminder Deleted", description: "The reminder has been removed." });
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast({ title: "Error Deleting Reminder", description: "Could not delete reminder.", variant: "destructive" });
      throw error;
    }
  };

  const getRemindersByUserId = () => {
    return reminders.sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  };

  const addMemory = async (memoryData: PetMemoryFormData & { petId: string; mediaFile: File }): Promise<void> => {
    if (!user) throw new Error("User not authenticated");

    // Create a temporary ID for storage path, then a final ID from Firestore
    const tempMemoryId = doc(collection(db, 'temp')).id; // Firestore can generate IDs offline
    let mediaUrl = `https://placehold.co/600x400.png?text=Processing`; // Placeholder
    
    try {
      mediaUrl = await uploadMemoryMedia(user.id, memoryData.petId, tempMemoryId, memoryData.mediaFile);

      const newMemoryDataForFirestore = {
        userId: user.id,
        petId: memoryData.petId,
        title: memoryData.title,
        description: memoryData.description || "",
        date: Timestamp.fromDate(memoryData.date),
        mediaUrl: mediaUrl,
        mediaType: 'image' as 'image' | 'video', // Assuming image for now
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'memories'), newMemoryDataForFirestore);
      
      const addedMemoryForState = {
        ...newMemoryDataForFirestore,
        id: docRef.id,
        date: memoryData.date.toISOString(),
        createdAt: new Date().toISOString(), // Approximate for UI
        updatedAt: new Date().toISOString(), // Approximate for UI
      } as PetMemory;

      setMemories(prevMemories => 
        [...prevMemories, addedMemoryForState].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      );
      toast({ title: "Memory Added", description: `"${memoryData.title}" has been saved.` });

    } catch (error) {
      console.error("Error adding memory:", error);
      toast({ title: "Error Adding Memory", description: "Could not save memory.", variant: "destructive" });
      // If media upload succeeded but Firestore failed, consider deleting the orphaned media.
      if (mediaUrl && !mediaUrl.includes('placehold.co')) {
        try {
          const mediaRef = storageRef(storage, mediaUrl);
          await deleteObject(mediaRef);
          console.log("Cleaned up orphaned media after addMemory failure.");
        } catch (cleanupError) {
          console.error("Error cleaning up orphaned media:", cleanupError);
        }
      }
      throw error;
    }
  };

  const deleteMemory = async (memoryId: string, mediaUrl: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated");
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'memories', memoryId));

      // Delete from Storage if URL is not a placeholder
      if (mediaUrl && !mediaUrl.includes('placehold.co')) {
        const mediaRef = storageRef(storage, mediaUrl);
        await deleteObject(mediaRef);
      }
      
      setMemories(prevMemories => prevMemories.filter(m => m.id !== memoryId));
      toast({ title: "Memory Deleted", description: "The memory has been removed." });
    } catch (error: any) {
      // If object not found in storage, it might have already been deleted or path was wrong
      // Still proceed to remove from local state if Firestore deletion was successful (or if error is from storage)
      if (error.code === 'storage/object-not-found') {
        setMemories(prevMemories => prevMemories.filter(m => m.id !== memoryId));
        toast({ title: "Memory Deleted", description: "The memory has been removed (media file not found)." });
      } else {
        console.error("Error deleting memory:", error);
        toast({ title: "Error Deleting Memory", description: "Could not delete memory.", variant: "destructive" });
        throw error;
      }
    }
  };

  const getMemoriesByPetId = (petId: string) => {
    return memories.filter(memory => memory.petId === petId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const addEmergencyContact = async (contactData: EmergencyContactFormData) => {
    if (!user) throw new Error("User not authenticated");
    const newContactData = {
      ...contactData,
      userId: user.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    try {
      const docRef = await addDoc(collection(db, 'emergencyContacts'), newContactData);
      const addedContactForState = {
        ...newContactData,
        id: docRef.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as EmergencyContact;
      setEmergencyContacts(prev => [...prev, addedContactForState].sort((a,b) => a.name.localeCompare(b.name)));
      toast({ title: "Contact Added", description: `${contactData.name} has been saved.` });
    } catch (error) {
      console.error("Error adding emergency contact:", error);
      toast({ title: "Error", description: "Could not save emergency contact.", variant: "destructive" });
      throw error;
    }
  };

  const updateEmergencyContact = async (contactId: string, contactData: Partial<EmergencyContactFormData>) => {
    if (!user) throw new Error("User not authenticated");
    const contactRef = doc(db, 'emergencyContacts', contactId);
    const updatePayload = { ...contactData, updatedAt: serverTimestamp() };
    try {
      await updateDoc(contactRef, updatePayload);
      setEmergencyContacts(prev => 
        prev.map(c => c.id === contactId ? { ...c, ...contactData, updatedAt: new Date().toISOString() } as EmergencyContact : c)
        .sort((a,b) => a.name.localeCompare(b.name))
      );
      toast({ title: "Contact Updated", description: "Emergency contact details updated." });
    } catch (error) {
      console.error("Error updating emergency contact:", error);
      toast({ title: "Error", description: "Could not update emergency contact.", variant: "destructive" });
      throw error;
    }
  };
  
  const deleteEmergencyContact = async (contactId: string) => {
    if (!user) throw new Error("User not authenticated");
    try {
      await deleteDoc(doc(db, 'emergencyContacts', contactId));
      setEmergencyContacts(prev => prev.filter(c => c.id !== contactId));
      toast({ title: "Contact Deleted", description: "Emergency contact removed." });
    } catch (error) {
      console.error("Error deleting emergency contact:", error);
      toast({ title: "Error", description: "Could not delete emergency contact.", variant: "destructive" });
      throw error;
    }
  };

  const getEmergencyContactsByUserId = () => {
    return emergencyContacts.sort((a,b) => a.name.localeCompare(b.name));
  };
  
  return (
    <AppDataContext.Provider value={{ 
      pets, addPet, updatePet, deletePet, getPetById, 
      logs, addLog, getLogsByPetId, deleteLog,
      reminders, addReminder, updateReminder, deleteReminder, getRemindersByUserId,
      memories, addMemory, deleteMemory, getMemoriesByPetId,
      emergencyContacts, addEmergencyContact, updateEmergencyContact, deleteEmergencyContact, getEmergencyContactsByUserId,
      loadingData, clearData 
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
