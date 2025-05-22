
"use client";

import { PageHeader } from "@/components/page-header";
import { PetForm } from "@/components/app/pet-form";
import { useAppData } from "@/contexts/app-data-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { PetFormData } from "@/lib/schemas";
import { useState } from "react";

export default function AddPetPage() {
  const { addPet } = useAppData();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: PetFormData & { photoFile?: File }) => {
    setIsSubmitting(true);
    try {
      await addPet(data); // addPet is now async
      toast({
        title: "Pet Added!",
        description: `${data.name} has been successfully added to your profiles.`,
      });
      router.push("/pets");
    } catch (error) {
      console.error("Failed to add pet:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to add pet. Please try again.";
      toast({
        title: "Error Adding Pet",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="Add New Pet" description="Fill in the details for your new furry friend." />
      <PetForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </>
  );
}
