
"use client";

import type { EmergencyContact } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, StickyNote, Trash2, Edit3, UserCheck, Hospital } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface EmergencyContactItemProps {
  contact: EmergencyContact;
  onEdit: (contact: EmergencyContact) => void;
  onDelete: (contactId: string) => void;
}

const getContactIcon = (type: EmergencyContact["type"]) => {
  switch (type) {
    case 'Veterinarian': return <Hospital className="h-5 w-5 text-primary" />;
    case 'Emergency Clinic': return <Hospital className="h-5 w-5 text-destructive" />;
    case 'Pet Sitter': return <UserCheck className="h-5 w-5 text-blue-500" />;
    case 'Family/Friend': return <UserCheck className="h-5 w-5 text-green-500" />;
    default: return <Phone className="h-5 w-5 text-muted-foreground" />;
  }
};

export function EmergencyContactItem({ contact, onEdit, onDelete }: EmergencyContactItemProps) {
  const handleDial = () => {
    if (typeof window !== 'undefined') {
      window.location.href = `tel:${contact.phone}`;
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center gap-2">
            {getContactIcon(contact.type)}
            {contact.name}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">{contact.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm flex-grow">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <a href={`tel:${contact.phone}`} className="text-primary hover:underline">{contact.phone}</a>
        </div>
        {contact.address && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <p>{contact.address}</p>
          </div>
        )}
        {contact.notes && (
          <div className="flex items-start gap-2 pt-1 border-t mt-2">
            <StickyNote className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <p className="whitespace-pre-line">{contact.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-3 flex flex-col sm:flex-row justify-between items-center gap-2 border-t">
        <Button onClick={handleDial} size="sm" className="w-full sm:w-auto">
          <Phone className="mr-2 h-4 w-4" /> Call Now
        </Button>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(contact)}
              className="flex-1 sm:flex-auto"
          >
            <Edit3 className="mr-1 h-4 w-4" /> Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                  variant="destructive" 
                  size="sm"
                  className="flex-1 sm:flex-auto"
              >
                <Trash2 className="mr-1 h-4 w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently delete the contact: {contact.name}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(contact.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
