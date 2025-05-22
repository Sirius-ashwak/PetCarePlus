
"use client";

import { PageHeader } from "@/components/page-header";
import { PetForm } from "@/components/app/pet-form";
import { useAppData } from "@/contexts/app-data-context";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { PetFormData } from "@/lib/schemas";
import { useEffect, useState, useCallback } from "react";
import type { Pet } from "@/lib/types";
import { LoadingSpinner } from "@/components/loading-spinner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditPetPage() {
  const { getPetById, updatePet, loadingData: contextLoading } = useAppData();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const [pet, setPet] = useState<Pet | null>(null);
  // Removed local loading, use contextLoading for initial data, local for submissions
  const [isSubmitting, setIsSubmitting] = useState(false);

  const petId = typeof params.id === 'string' ? params.id : undefined;

  const fetchPetDetails = useCallback(() => {
    if (petId) {
      const foundPet = getPetById(petId);
      if (foundPet) {
        setPet(foundPet);
      } else if (!contextLoading) { // Only act if context is not loading and pet is not found
        toast({
          title: "Pet not found",
          description: "The requested pet profile could not be found.",
          variant: "destructive",
        });
        router.push("/pets");
      }
    } else {
      router.push("/pets"); 
    }
  }, [petId, getPetById, router, toast, contextLoading]);

  useEffect(() => {
    fetchPetDetails();
  }, [petId, contextLoading, fetchPetDetails]); // Depend on contextLoading

  const handleSubmit = async (data: PetFormData & { photoFile?: File }) => {
    if (!pet) return;
    setIsSubmitting(true);
    try {
      // Ensure all Pet properties are passed to updatePet, including id and userId
      const petDataToUpdate: Pet & { photoFile?: File } = {
        ...pet, // existing pet data (like id, userId)
        ...data, // form data
        age: Number(data.age), // Ensure type consistency
        weight: Number(data.weight),
        photoFile: data.photoFile,
      };
      await updatePet(petDataToUpdate); // updatePet is now async
      toast({
        title: "Pet Updated!",
        description: `${data.name}'s profile has been successfully updated.`,
      });
      router.push(`/pets/${pet.id}`);
    } catch (error) {
      console.error("Failed to update pet:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update pet. Please try again.";
      toast({
        title: "Error Updating Pet",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (contextLoading && !pet) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size={48} />
        <p className="ml-2">Loading pet details...</p>
      </div>
    );
  }

  if (!pet) {
    // This case should be handled by the redirect in useEffect, but as a fallback:
    return <PageHeader title="Pet Not Found" description="This pet profile could not be loaded or doesn't exist." />;
  }

  return (
    <>
      <PageHeader 
        title={`Edit ${pet.name}'s Profile`}
        description="Update the details for your pet."
        actions={
          <Link href={`/pets/${pet.id}`} passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
            </Button>
          </Link>
        }
      />
      <PetForm pet={pet} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitButtonText="Update Pet"/>
    </>
  );
}
