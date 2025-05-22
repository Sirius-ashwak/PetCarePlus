
import type { Pet } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Dog, Cat, Info, Edit, Trash2 } from "lucide-react";
// Removed useState as AlertDialog will manage its own state via trigger
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

interface PetCardProps {
  pet: Pet;
  onConfirmDelete: (petId: string) => void; // Changed prop name for clarity
}

export function PetCard({ pet, onConfirmDelete }: PetCardProps) {
  return (
    <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
        <Image
          src={pet.photoUrl || (pet.type === 'dog' ? 'https://placehold.co/80x80.png?text=🐶' : 'https://placehold.co/80x80.png?text=🐱')}
          alt={pet.name}
          width={80}
          height={80}
          className="rounded-full border aspect-square object-cover"
          data-ai-hint={pet.type === 'dog' ? "dog portrait" : "cat portrait"}
        />
        <div className="flex-1">
          <CardTitle className="text-xl flex items-center gap-2">
            {pet.type === 'dog' ? <Dog className="h-5 w-5 text-primary" /> : <Cat className="h-5 w-5 text-primary" />}
            {pet.name}
          </CardTitle>
          <CardDescription>{pet.breed} &bull; {pet.age} years old</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground"><strong>Weight:</strong> {pet.weight} kg</p>
        <p className="text-sm text-muted-foreground"><strong>Gender:</strong> {pet.gender}</p>
        <p className="text-sm text-muted-foreground"><strong>Vaccinations:</strong> {pet.vaccinationStatus}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-3">
        <Link href={`/pets/${pet.id}`} passHref>
          <Button variant="outline" size="sm">
            <Info className="mr-2 h-4 w-4" /> View Details
          </Button>
        </Link>
        <Link href={`/pets/${pet.id}/edit`} passHref>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
        </Link>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete {pet.name}'s profile and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onConfirmDelete(pet.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
