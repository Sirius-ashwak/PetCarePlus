
"use client";

import type { Reminder, Pet } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Trash2, Edit3, CalendarClock, Tag, Dog, Cat, StickyNote, AlertTriangle } from "lucide-react";
import { format, parseISO, isPast } from 'date-fns';
import { cn } from "@/lib/utils";

interface ReminderItemProps {
  reminder: Reminder;
  pet?: Pet; // Optional pet object if reminder is associated with one
  onToggleComplete: (reminderId: string, currentStatus: boolean) => void;
  onDelete: (reminderId: string) => void;
  onEdit: (reminder: Reminder) => void;
  isUpdating?: boolean;
}

const getReminderIcon = (type: Reminder["type"]) => {
  switch (type) {
    case 'Feeding': return <CalendarClock className="h-4 w-4 text-blue-500" />;
    case 'Walk': return <Dog className="h-4 w-4 text-green-500" />;
    case 'Medication': return <CalendarClock className="h-4 w-4 text-red-500" />; // Placeholder, consider a Pill icon
    case 'Grooming': return <CalendarClock className="h-4 w-4 text-purple-500" />; // Placeholder, consider a Scissors icon
    case 'Vet Appointment': return <CalendarClock className="h-4 w-4 text-orange-500" />; // Placeholder, consider a Stethoscope icon
    default: return <Tag className="h-4 w-4 text-gray-500" />;
  }
};

export function ReminderItem({ reminder, pet, onToggleComplete, onDelete, onEdit, isUpdating }: ReminderItemProps) {
  const reminderDateTime = parseISO(reminder.dateTime);
  const isReminderPast = isPast(reminderDateTime) && !reminder.isCompleted;

  return (
    <Card className={cn(
      "shadow-sm hover:shadow-md transition-shadow duration-200",
      reminder.isCompleted && "bg-muted/50 opacity-70",
      isReminderPast && "border-destructive"
    )}>
      <CardHeader className="pb-3 flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            {getReminderIcon(reminder.type)}
            {reminder.title}
          </CardTitle>
          <CardDescription className="text-xs mt-1">
            {format(reminderDateTime, "MMMM d, yyyy 'at' h:mm a")}
            {pet && <span className="ml-2 font-medium text-primary">({pet.name})</span>}
          </CardDescription>
        </div>
        <Badge variant={reminder.isCompleted ? "secondary" : (isReminderPast ? "destructive" : "default")}>
          {reminder.isCompleted ? "Completed" : (isReminderPast ? "Past Due" : "Upcoming")}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {isReminderPast && (
          <div className="flex items-center gap-1 text-destructive text-xs">
            <AlertTriangle className="h-3 w-3"/> This reminder is past due!
          </div>
        )}
        {reminder.notes && (
          <div className="flex items-start gap-2 pt-1">
            <StickyNote className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <p className="whitespace-pre-line">{reminder.notes}</p>
          </div>
        )}
         <p className="text-xs text-muted-foreground">Type: {reminder.type}</p>
      </CardContent>
      <CardFooter className="pt-3 flex flex-col sm:flex-row justify-end gap-2">
        <Button 
          variant={reminder.isCompleted ? "outline" : "default"} 
          size="sm" 
          onClick={() => onToggleComplete(reminder.id, reminder.isCompleted)}
          disabled={isUpdating}
          className="w-full sm:w-auto"
        >
          {reminder.isCompleted ? <Circle className="mr-1 h-4 w-4" /> : <CheckCircle2 className="mr-1 h-4 w-4" />}
          {reminder.isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
        </Button>
        <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(reminder)}
            disabled={isUpdating || reminder.isCompleted}
            className="w-full sm:w-auto"
        >
          <Edit3 className="mr-1 h-4 w-4" /> Edit
        </Button>
        <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete(reminder.id)}
            disabled={isUpdating}
            className="w-full sm:w-auto"
        >
          <Trash2 className="mr-1 h-4 w-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
