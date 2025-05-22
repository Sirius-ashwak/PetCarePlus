
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PetCard } from "@/components/app/pet-card";
import { useAppData } from "@/contexts/app-data-context";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { PlusCircle, PawPrint } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function PetsPage() {
  const { pets, deletePet, loadingData } = useAppData(); // Added loadingData
  const { toast } = useToast();
  const router = useRouter(); 

  const handleConfirmDeletePet = async (petId: string) => {
    const petToBeDeleted = pets.find(p => p.id === petId);
    try {
      await deletePet(petId); // deletePet is now async
      toast({
        title: "Pet Deleted",
        description: `${petToBeDeleted ? petToBeDeleted.name : 'The pet'}'s profile has been removed.`,
      });
      // Data will be refetched or updated in context, no need to manually filter here
    } catch (error) {
       toast({
        title: "Error Deleting Pet",
        description: (error as Error).message || "Could not delete pet.",
        variant: "destructive",
      });
    }
  };
  
  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">Loading your pet profiles...</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="My Pets"
        description="Manage your pet profiles and view their details."
        actions={
          <Link href="/pets/add" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Pet
            </Button>
          </Link>
        }
      />
      {pets.length === 0 ? (
        <EmptyState
          icon={PawPrint}
          title="No Pets Yet"
          description="Get started by adding your first pet profile."
          action={{ label: "Add Pet", onClick: () => router.push("/pets/add") }}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} onConfirmDelete={handleConfirmDeletePet} />
          ))}
        </div>
      )}
    </>
  );
}
