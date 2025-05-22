
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/loading-spinner";
import { askPetPalAssistant } from "@/ai/flows/pet-query-assistant-flow";
import type { PetQueryAssistantInput, PetQueryAssistantOutput } from "@/ai/flows/pet-query-assistant-flow";
import { z } from "zod";
import { Lightbulb, AlertTriangle, Mic, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const QueryFormSchema = z.object({
  query: z.string().min(5, "Please enter a query of at least 5 characters."),
});
type QueryFormData = z.infer<typeof QueryFormSchema>;

export default function VoiceAssistantPage() {
  const [result, setResult] = useState<PetQueryAssistantOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<QueryFormData>({
    resolver: zodResolver(QueryFormSchema),
    defaultValues: {
      query: "",
    },
  });

  const handleSubmit = async (data: QueryFormData) => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    const input: PetQueryAssistantInput = { query: data.query };

    try {
      const response = await askPetPalAssistant(input);
      setResult(response);
    } catch (e) {
      console.error("Voice assistant error:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to get an answer. ${errorMessage}`);
      toast({
        title: "Error",
        description: `Could not get an answer. ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Pet Query Assistant (Pal)"
        description="Ask Pal your pet-related questions! Type your query below."
      />
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Mic className="h-5 w-5 text-primary"/>Ask a Question</CardTitle>
            <CardDescription>Type your pet care question for Pal, our AI assistant.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Question</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., What are common signs of heatstroke in dogs?"
                          className="min-h-[100px]"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <LoadingSpinner className="mr-2" size={16}/> : <MessageSquare className="mr-2 h-4 w-4" />}
                  {isLoading ? "Pal is thinking..." : "Ask Pal"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {isLoading && (
            <Card className="flex flex-col items-center justify-center p-10 min-h-[200px] shadow-lg">
              <LoadingSpinner size={48} />
              <p className="mt-4 text-muted-foreground">Pal is preparing an answer...</p>
            </Card>
          )}

          {error && !isLoading && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && !isLoading && (
            <Card className="shadow-xl animate-in fade-in duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-primary" /> Pal's Answer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground whitespace-pre-line bg-secondary p-4 rounded-md">{result.answer}</p>
              </CardContent>
              {result.disclaimerNeeded && (
                 <CardFooter>
                    <Alert variant="default" className="border-amber-500 text-amber-700 dark:border-amber-400 dark:text-amber-300">
                        <AlertTriangle className="h-4 w-4 !text-amber-600 dark:!text-amber-400" />
                        <AlertTitle className="font-semibold">Important Note</AlertTitle>
                        <AlertDescription className="text-xs">
                        This information is AI-generated and for general guidance only. It is not a substitute for professional veterinary advice. Always consult a qualified veterinarian for any health concerns or before making decisions about your pet's care.
                        </AlertDescription>
                    </Alert>
                </CardFooter>
              )}
            </Card>
          )}
           {!isLoading && !result && !error && (
             <Card className="flex flex-col items-center justify-center p-10 min-h-[200px] shadow-md border-dashed">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-3"/>
                <p className="text-muted-foreground text-center">Ask Pal a question to see the answer here.</p>
            </Card>
           )}
        </div>
      </div>
    </>
  );
}
