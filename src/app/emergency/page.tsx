
"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { EmergencyContactItem } from "@/components/app/emergency-contact-item";
import { EmergencyContactForm } from "@/components/app/emergency-contact-form";
import { useAppData } from "@/contexts/app-data-context";
import { PlusCircle, UserPlus, MapPin, BookOpen, LifeBuoy } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { LoadingSpinner } from "@/components/loading-spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { EmergencyContact } from "@/lib/types";
import type { EmergencyContactFormData } from "@/lib/schemas";

export default function EmergencyPage() {
  const { 
    emergencyContacts, 
    addEmergencyContact, 
    updateEmergencyContact, 
    deleteEmergencyContact, 
    loadingData 
  } = useAppData();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddOrUpdateContact = async (data: EmergencyContactFormData) => {
    setIsSubmitting(true);
    try {
      if (editingContact) {
        await updateEmergencyContact(editingContact.id, data);
      } else {
        await addEmergencyContact(data);
      }
      setIsFormOpen(false);
      setEditingContact(null);
    } catch (error) {
      // Toast is handled in context
      console.error("Failed to save emergency contact", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      await deleteEmergencyContact(contactId);
    } catch (error) {
      console.error("Failed to delete emergency contact", error);
    }
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };
  
  if (loadingData && emergencyContacts.length === 0) { // Show full page loader only if no contacts are loaded yet
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">Loading emergency information...</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Emergency Hub"
        description="Manage emergency contacts and access critical pet care resources."
        actions={
          <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
            setIsFormOpen(isOpen);
            if (!isOpen) setEditingContact(null);
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingContact(null); setIsFormOpen(true); }}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>{editingContact ? "Edit Emergency Contact" : "Add New Contact"}</DialogTitle>
              </DialogHeader>
              <EmergencyContactForm
                onSubmit={handleAddOrUpdateContact}
                isSubmitting={isSubmitting}
                initialData={editingContact || undefined}
                onClose={() => { setIsFormOpen(false); setEditingContact(null); }}
              />
            </DialogContent>
          </Dialog>
        }
      />

      <h2 className="text-xl font-semibold mb-4">My Emergency Contacts</h2>
      {loadingData && emergencyContacts.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-8">
            <LoadingSpinner size={32} />
            <p className="mt-2 text-muted-foreground text-sm">Loading contacts...</p>
         </div>
      ) : emergencyContacts.length === 0 ? (
         <EmptyState
          icon={UserPlus}
          title="No Emergency Contacts Yet"
          description="Add your vet, emergency clinics, or pet sitters."
          action={{ label: "Add First Contact", onClick: () => {setEditingContact(null); setIsFormOpen(true); }}}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {emergencyContacts.map((contact) => (
            <EmergencyContactItem
              key={contact.id}
              contact={contact}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
            />
          ))}
        </div>
      )}
      
      <div className="mt-8 border-t pt-8">
        <h2 className="text-xl font-semibold mb-6 text-center md:text-left">Emergency Tools & Resources</h2>
        <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary"/> Vet Locator
                    </CardTitle>
                    <CardDescription>Find nearby vets and emergency animal hospitals.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                        Quickly locate veterinary services in your area. (Map feature coming soon!)
                    </p>
                </CardContent>
                <CardFooter>
                     <Link href="/emergency/vet-locator" passHref className="w-full">
                        <Button className="w-full">Access Vet Locator</Button>
                    </Link>
                </CardFooter>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-shadow bg-muted/30 border-dashed">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LifeBuoy className="h-5 w-5 text-primary"/> Emergency Medical Guide
                    </CardTitle>
                    <CardDescription>Basic first aid and emergency tips for pets.</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-sm text-muted-foreground">
                        Access a quick guide for common pet emergencies. (Content coming soon!)
                    </p>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" disabled>View Guide (Soon)</Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </>
  );
}
