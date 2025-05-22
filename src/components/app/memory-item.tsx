
"use client";

import type { PetMemory } from "@/lib/types";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Trash2, Image as ImageIcon, Edit3, StickyNote } from "lucide-react";
import { format, parseISO } from 'date-fns';
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

interface MemoryItemProps {
  memory: PetMemory;
  onDelete: (memoryId: string, mediaUrl: string) => void;
  // onEdit: (memory: PetMemory) => void; // Future: for editing memories
}

export function MemoryItem({ memory, onDelete }: MemoryItemProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      <CardHeader className="pb-3">
        <div className="aspect-[4/3] relative w-full rounded-t-md overflow-hidden border bg-muted">
          <Image
            src={memory.mediaUrl}
            alt={memory.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-md"
            data-ai-hint="pet memory"
          />
        </div>
        <CardTitle className="text-lg flex items-center gap-2 pt-3">
          <ImageIcon className="h-5 w-5 text-primary" />
          {memory.title}
        </CardTitle>
        <CardDescription className="text-xs">
          <CalendarDays className="inline h-3 w-3 mr-1" />
          {format(parseISO(memory.date), "MMMM d, yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm flex-grow">
        {memory.description && (
          <div className="flex items-start gap-2 pt-1">
            <StickyNote className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <p className="whitespace-pre-line text-muted-foreground">{memory.description}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-3 flex justify-end gap-2 border-t">
        {/* <Button variant="outline" size="sm" onClick={() => onEdit(memory)} disabled>
          <Edit3 className="mr-1 h-4 w-4" /> Edit
        </Button> */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="mr-1 h-4 w-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this memory.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(memory.id, memory.mediaUrl)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
