
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/loading-spinner";
import { generatePetNames } from "@/ai/flows/pet-name-generator";
import type { PetNameGeneratorInput, PetNameGeneratorOutput } from "@/ai/flows/pet-name-generator";
import { PetNameGeneratorSchema, type PetNameGeneratorData } from "@/lib/schemas";
import { Lightbulb, Sparkles, AlertTriangle, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PetNameGeneratorPage() {
  const [result, setResult] = useState<PetNameGeneratorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<PetNameGeneratorData>({
    resolver: zodResolver(PetNameGeneratorSchema),
    defaultValues: {
      petType: undefined,
      style: "",
      count: 10,
    },
  });

  const handleSubmit = async (data: PetNameGeneratorData) => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    const input: PetNameGeneratorInput = {
      petType: data.petType,
      style: data.style || undefined,
      count: Number(data.count) || 10,
    };

    try {
      const response = await generatePetNames(input);
      setResult(response);
    } catch (e) {
      console.error("Pet name generator error:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to generate names. ${errorMessage}`);
      toast({
        title: "Error",
        description: `Could not generate names. ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="AI Pet Name Generator"
        description="Find the perfect name for your new furry friend with a little help from AI!"
      />
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />Tell us about your pet</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="petType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pet type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dog">Dog</SelectItem>
                          <SelectItem value="cat">Cat</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name Style (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Playful, Majestic, Unique" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Names</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <LoadingSpinner className="mr-2" size={16}/> : <Sparkles className="mr-2 h-4 w-4" />}
                  {isLoading ? "Generating Names..." : "Generate Names"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {isLoading && (
            <Card className="flex flex-col items-center justify-center p-10 min-h-[200px] shadow-lg">
              <LoadingSpinner size={48} />
              <p className="mt-4 text-muted-foreground">Thinking of some great names...</p>
            </Card>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && result.names && result.names.length > 0 && !isLoading && (
            <Card className="shadow-xl animate-in fade-in duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="h-6 w-6 text-primary" /> Suggested Names
                </CardTitle>
                <CardDescription>
                  Here are some names the AI came up with!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-foreground bg-secondary p-4 rounded-md">
                  {result.names.map((name, index) => (
                    <li key={index} className="text-sm">{name}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
           {!isLoading && !result && !error && (
             <Card className="flex flex-col items-center justify-center p-10 min-h-[200px] shadow-md border-dashed">
                <Lightbulb className="h-12 w-12 text-muted-foreground mb-3"/>
                <p className="text-muted-foreground text-center">Enter your pet's details to generate names.</p>
            </Card>
           )}
        </div>
      </div>
    </>
  );
}
