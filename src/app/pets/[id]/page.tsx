
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAppData } from "@/contexts/app-data-context";
import type { Pet, DailyLog, PetMemory } from "@/lib/types";
import type { DailyLogFormData, PetMemoryFormData } from "@/lib/schemas";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Trash2, PlusCircle, Dog, Cat, CalendarDays, Weight, Thermometer, Syringe, Image as ImageIcon, BookHeart } from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { LogForm } from "@/components/app/log-form";
import { LogItem } from "@/components/app/log-item";
import { MemoryForm } from "@/components/app/memory-form";
import { MemoryItem } from "@/components/app/memory-item";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/hooks/use-toast";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export default function PetDetailPage() {
  const { 
    getPetById, deletePet, 
    getLogsByPetId, addLog, deleteLog: contextDeleteLog, 
    getMemoriesByPetId, addMemory, deleteMemory: contextDeleteMemory,
    loadingData: contextLoading 
  } = useAppData();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const [pet, setPet] = useState<Pet | null>(null);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [memories, setMemories] = useState<PetMemory[]>([]);
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);
  const [isSubmittingMemory, setIsSubmittingMemory] = useState(false);
  const [isDeletingPet, setIsDeletingPet] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isMemoryFormOpen, setIsMemoryFormOpen] = useState(false);


  const petId = typeof params.id === 'string' ? params.id : undefined;

  const refreshPetData = useCallback(() => {
    if (petId) {
      const foundPet = getPetById(petId);
      if (foundPet) {
        setPet(foundPet);
        setLogs(getLogsByPetId(petId));
        setMemories(getMemoriesByPetId(petId));
      } else if (!contextLoading) { 
        toast({ title: "Pet not found", description: "The requested pet profile could not be found.", variant: "destructive" });
        router.push("/pets");
      }
    } else {
      router.push("/pets");
    }
  }, [petId, getPetById, getLogsByPetId, getMemoriesByPetId, router, toast, contextLoading]);


  useEffect(() => {
    refreshPetData();
  }, [petId, contextLoading, refreshPetData]); 

  const handleAddLog = async (data: DailyLogFormData & { petId: string }) => {
    setIsSubmittingLog(true);
    try {
      await addLog(data); 
      refreshPetData(); 
      toast({ title: "Log Added", description: `New log for ${pet?.name} has been added.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add log.", variant: "destructive" });
    } finally {
      setIsSubmittingLog(false);
    }
  };
  
  const handleDeleteLog = async (logId: string) => {
    try {
      await contextDeleteLog(logId);
      refreshPetData(); 
      toast({ title: "Log Deleted", description: "The log entry has been removed." });
    } catch (error) {
       toast({ title: "Error Deleting Log", description: "Failed to delete log.", variant: "destructive" });
    }
  };

  const handleAddMemory = async (data: PetMemoryFormData & { petId: string; mediaFile: File }) => {
    setIsSubmittingMemory(true);
    try {
      await addMemory(data);
      refreshPetData();
      toast({ title: "Memory Added", description: `New memory for ${pet?.name} has been saved.`});
      setIsMemoryFormOpen(false); // Close dialog on success
    } catch (error) {
      // Error toast is handled in context, but you can add specific ones here if needed
      console.error("Failed to add memory from page:", error);
    } finally {
      setIsSubmittingMemory(false);
    }
  };

  const handleDeleteMemory = async (memoryId: string, mediaUrl: string) => {
    try {
      await contextDeleteMemory(memoryId, mediaUrl);
      refreshPetData();
      toast({ title: "Memory Deleted", description: "The memory has been removed."});
    } catch (error) {
      // Error toast is handled in context
      console.error("Failed to delete memory from page:", error);
    }
  };

  const handleDeletePet = async () => {
    if (!pet) return;
    setIsDeletingPet(true);
    try {
      await deletePet(pet.id);
      toast({ title: "Pet Deleted", description: `${pet.name}'s profile has been removed.` });
      router.push("/pets");
    } catch (error) {
      toast({ title: "Error Deleting Pet", description: (error as Error).message || "Could not delete pet.", variant: "destructive"})
    } finally {
      setIsDeletingPet(false);
      setShowDeleteConfirm(false);
    }
  };

  if (contextLoading && !pet) { 
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size={48} /> <p className="ml-2">Loading pet data...</p></div>;
  }

  if (!pet) { 
    return <PageHeader title="Pet Not Found" description="This pet profile could not be loaded or doesn't exist."/>;
  }

  return (
    <>
      <PageHeader
        title={pet.name}
        description={`${pet.breed} - ${pet.age} years old`}
        actions={
          <div className="flex gap-2">
            <Link href={`/pets/${pet.id}/edit`} passHref>
              <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
            </Link>
            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeletingPet}><Trash2 className="mr-2 h-4 w-4" /> {isDeletingPet ? "Deleting..." : "Delete Pet"}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete {pet.name}'s profile and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeletingPet}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeletePet} disabled={isDeletingPet}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[600px] mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">Daily Logs</TabsTrigger>
          <TabsTrigger value="memories">Memories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="shadow-lg">
            <CardContent className="p-6 grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1 flex justify-center items-center">
                <Image
                  src={pet.photoUrl}
                  alt={pet.name}
                  width={200}
                  height={200}
                  className="rounded-lg border object-cover aspect-square"
                  data-ai-hint={pet.type === 'dog' ? "dog happy" : "cat playful"}
                  unoptimized={pet.photoUrl?.startsWith('blob:')} 
                />
              </div>
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-2xl font-semibold flex items-center">
                  {pet.type === 'dog' ? <Dog className="mr-2 h-6 w-6 text-primary" /> : <Cat className="mr-2 h-6 w-6 text-primary" />}
                  {pet.name}
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <p className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" /> <strong>Age:</strong> {pet.age} years</p>
                  <p className="flex items-center"><Weight className="mr-2 h-4 w-4 text-muted-foreground" /> <strong>Weight:</strong> {pet.weight} kg</p>
                  <p className="flex items-center"><Thermometer className="mr-2 h-4 w-4 text-muted-foreground" /> <strong>Gender:</strong> {pet.gender}</p>
                  <p className="flex items-center"><Syringe className="mr-2 h-4 w-4 text-muted-foreground" /> <strong>Breed:</strong> {pet.breed}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-md mb-1">Vaccination Status:</h4>
                  <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">{pet.vaccinationStatus}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlusCircle className="h-5 w-5 text-primary" /> Add New Log
                  </CardTitle>
                </CardHeader>
                <CardContent>
                   <LogForm petId={pet.id} onSubmit={handleAddLog} isSubmitting={isSubmittingLog} />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Log History</h3>
              {logs.length === 0 ? (
                <EmptyState
                  icon={CalendarDays}
                  title="No Logs Yet"
                  description={`Start tracking ${pet.name}'s daily activities, mood, and health.`}
                />
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {logs.map((log) => (
                    <LogItem key={log.id} log={log} onDelete={() => handleDeleteLog(log.id)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="memories">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Pet Memories</h3>
            <Dialog open={isMemoryFormOpen} onOpenChange={setIsMemoryFormOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Memory
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add New Memory for {pet.name}</DialogTitle>
                </DialogHeader>
                <MemoryForm 
                  petId={pet.id} 
                  onSubmit={handleAddMemory} 
                  isSubmitting={isSubmittingMemory}
                  onClose={() => setIsMemoryFormOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          {memories.length === 0 ? (
            <EmptyState
              icon={BookHeart}
              title="No Memories Yet"
              description={`Capture special moments with ${pet.name} by adding your first memory.`}
              action={{ label: "Add First Memory", onClick: () => setIsMemoryFormOpen(true) }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memories.map((memory) => (
                <MemoryItem 
                  key={memory.id} 
                  memory={memory} 
                  onDelete={handleDeleteMemory}
                />
              ))}
            </div>
          )}
        </TabsContent>

      </Tabs>
    </>
  );
}
