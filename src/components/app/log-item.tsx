import type { DailyLog } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Smile, Utensils, Droplet, Footprints, StickyNote, Trash2 } from "lucide-react";
import { format, parseISO } from 'date-fns';

interface LogItemProps {
  log: DailyLog;
  onDelete: (logId: string) => void;
}

export function LogItem({ log, onDelete }: LogItemProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Log for {format(parseISO(log.date), "MMMM d, yyyy")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-start gap-2">
          <Smile className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" /> 
          <div><strong>Mood:</strong> {log.mood}</div>
        </div>
        <div className="flex items-start gap-2">
          <Utensils className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
          <div><strong>Eating Habits:</strong> {log.eatingHabits}</div>
        </div>
        <div className="flex items-start gap-2">
          <Droplet className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
          <div><strong>Elimination:</strong> {log.elimination}</div>
        </div>
        <div className="flex items-start gap-2">
          <Footprints className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
          <div><strong>Activity:</strong> {log.activity}</div>
        </div>
        {log.notes && (
          <div className="flex items-start gap-2 pt-1 border-t mt-3">
            <StickyNote className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div><strong>Notes:</strong> {log.notes}</div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-3 flex justify-end">
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(log.id)}>
          <Trash2 className="mr-1 h-4 w-4" /> Delete Log
        </Button>
      </CardFooter>
    </Card>
  );
}
