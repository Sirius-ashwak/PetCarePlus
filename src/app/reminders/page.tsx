
"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ReminderItem } from "@/components/app/reminder-item";
import { ReminderForm } from "@/components/app/reminder-form";
import { useAppData } from "@/contexts/app-data-context";
import { PlusCircle, BellRing, CalendarX2, CalendarCheck2 } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { LoadingSpinner } from "@/components/loading-spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import type { Reminder, Pet } from "@/lib/types";
import type { ReminderFormData } from "@/lib/schemas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseISO, isPast } from "date-fns";

export default function RemindersPage() {
  const { 
    pets, 
    reminders, 
    addReminder, 
    updateReminder, 
    deleteReminder, 
    loadingData 
  } = useAppData();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemUpdating, setItemUpdating] = useState<string | null>(null); // ID of reminder being updated

  const sortedReminders = useMemo(() => {
    return [...reminders].sort((a, b) => parseISO(a.dateTime).getTime() - parseISO(b.dateTime).getTime());
  }, [reminders]);

  const upcomingReminders = useMemo(() => 
    sortedReminders.filter(r => !r.isCompleted && !isPast(parseISO(r.dateTime)))
  , [sortedReminders]);

  const pastDueReminders = useMemo(() => 
    sortedReminders.filter(r => !r.isCompleted && isPast(parseISO(r.dateTime)))
  , [sortedReminders]);
  
  const completedReminders = useMemo(() => 
    sortedReminders.filter(r => r.isCompleted)
    .sort((a,b) => parseISO(b.updatedAt).getTime() - parseISO(a.updatedAt).getTime()) // Show most recently completed first
  , [sortedReminders]);

  const handleAddOrUpdateReminder = async (data: ReminderFormData) => {
    setIsSubmitting(true);
    try {
      if (editingReminder) {
        const [hours, minutes] = data.time.split(':').map(Number);
        const combinedDateTime = new Date(data.date);
        combinedDateTime.setHours(hours, minutes, 0, 0);

        await updateReminder(editingReminder.id, { 
          ...data, 
          dateTime: combinedDateTime.toISOString(),
          petId: data.petId || undefined
        });
      } else {
        await addReminder(data);
      }
      setIsFormOpen(false);
      setEditingReminder(null);
    } catch (error) {
      // Toast is handled in context
      console.error("Failed to save reminder", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async (reminderId: string, currentStatus: boolean) => {
    setItemUpdating(reminderId);
    try {
      await updateReminder(reminderId, { isCompleted: !currentStatus });
    } catch (error) {
      console.error("Failed to update reminder status", error);
    } finally {
      setItemUpdating(null);
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    setItemUpdating(reminderId); // Visually indicate update
    try {
      await deleteReminder(reminderId);
    } catch (error) {
      console.error("Failed to delete reminder", error);
    } finally {
      setItemUpdating(null);
    }
  };

  const handleEditReminder = (reminder: Reminder) => {
    const reminderDate = parseISO(reminder.dateTime);
    setEditingReminder({
      ...reminder,
      // Ensure date and time are pre-filled correctly for the form
      // ReminderFormData expects date as Date object and time as HH:mm string
    });
    setIsFormOpen(true);
  };
  
  const getPetForReminder = (petId?: string): Pet | undefined => {
    return pets.find(p => p.id === petId);
  };

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">Loading your reminders...</p>
      </div>
    );
  }
  
  const renderReminderList = (list: Reminder[], title: string, emptyIcon: React.ElementType, emptyTitle: string, emptyDesc: string) => (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-foreground">{title} ({list.length})</h2>
      {list.length === 0 ? (
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDesc}
        />
      ) : (
        <div className="space-y-4">
          {list.map((reminder) => (
            <ReminderItem
              key={reminder.id}
              reminder={reminder}
              pet={getPetForReminder(reminder.petId)}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteReminder}
              onEdit={handleEditReminder}
              isUpdating={itemUpdating === reminder.id}
            />
          ))}
        </div>
      )}
    </div>
  );


  return (
    <>
      <PageHeader
        title="Pet Reminders"
        description="Stay organized with schedules for feeding, walks, medications, and more."
        actions={
          <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
            setIsFormOpen(isOpen);
            if (!isOpen) setEditingReminder(null);
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingReminder(null); setIsFormOpen(true); }}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Reminder
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>{editingReminder ? "Edit Reminder" : "Add New Reminder"}</DialogTitle>
              </DialogHeader>
              <ReminderForm
                pets={pets}
                onSubmit={handleAddOrUpdateReminder}
                isSubmitting={isSubmitting}
                initialData={editingReminder ? {
                  title: editingReminder.title,
                  type: editingReminder.type,
                  date: parseISO(editingReminder.dateTime),
                  time: format(parseISO(editingReminder.dateTime), "HH:mm"),
                  petId: editingReminder.petId,
                  notes: editingReminder.notes,
                  id: editingReminder.id
                } : undefined}
                onClose={() => { setIsFormOpen(false); setEditingReminder(null); }}
              />
            </DialogContent>
          </Dialog>
        }
      />

      {reminders.length === 0 && !loadingData ? (
         <EmptyState
          icon={BellRing}
          title="No Reminders Yet"
          description="Get started by adding your first pet reminder."
          action={{ label: "Add Reminder", onClick: () => {setEditingReminder(null); setIsFormOpen(true); }}}
        />
      ) : (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="upcoming">Upcoming ({upcomingReminders.length})</TabsTrigger>
            <TabsTrigger value="pastdue" className={pastDueReminders.length > 0 ? "text-destructive focus:text-destructive data-[state=active]:text-destructive" : ""}>
              Past Due ({pastDueReminders.length})
            </TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedReminders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {renderReminderList(upcomingReminders, "Upcoming Reminders", CalendarCheck2, "All caught up!", "No upcoming reminders for now.")}
          </TabsContent>
          <TabsContent value="pastdue">
             {renderReminderList(pastDueReminders, "Past Due Reminders", CalendarX2, "Nothing Past Due!", "No overdue reminders.")}
          </TabsContent>
          <TabsContent value="completed">
            {renderReminderList(completedReminders, "Completed Reminders", BellRing, "No Completed Reminders", "You haven't completed any reminders yet.")}
          </TabsContent>
        </Tabs>
      )}
    </>
  );
}
