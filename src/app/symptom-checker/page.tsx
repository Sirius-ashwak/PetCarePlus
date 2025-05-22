
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { SymptomCheckerForm } from "@/components/app/symptom-checker-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/loading-spinner";
import { petSymptomChecker } from "@/ai/flows/pet-symptom-checker";
import type { PetSymptomCheckerInput, PetSymptomCheckerOutput } from "@/ai/flows/pet-symptom-checker";
import type { SymptomCheckerData } from "@/lib/schemas";
import { AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SymptomCheckerPage() {
  const [result, setResult] = useState<PetSymptomCheckerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: SymptomCheckerData) => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    const input: PetSymptomCheckerInput = {
      petType: data.petType,
      symptoms: data.symptoms,
      breed: data.breed || undefined,
      age: data.age ? Number(data.age) : undefined,
    };

    try {
      const response = await petSymptomChecker(input);
      setResult(response);
    } catch (e) {
      console.error("Symptom checker error:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to get advice. ${errorMessage}`);
      toast({
        title: "Error",
        description: `Could not get AI advice. ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="AI Pet Symptom Checker"
        description="Describe your pet's symptoms to get AI-powered insights. This tool does not replace professional veterinary advice."
      />
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Enter Pet's Symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <SymptomCheckerForm onSubmit={handleSubmit} isSubmitting={isLoading} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          {isLoading && (
            <Card className="flex flex-col items-center justify-center p-10 min-h-[200px] shadow-lg">
              <LoadingSpinner size={48} />
              <p className="mt-4 text-muted-foreground">Analyzing symptoms, please wait...</p>
            </Card>
          )}

          {error && (
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
                  <Lightbulb className="h-6 w-6 text-primary" /> AI-Generated Advice
                </CardTitle>
                <CardDescription>
                  Based on the symptoms you provided, here are some potential insights.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Potential Causes:</h3>
                  <p className="text-sm text-foreground whitespace-pre-line bg-secondary p-3 rounded-md">{result.potentialCauses}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Recommendations:</h3>
                  <p className="text-sm text-foreground whitespace-pre-line bg-secondary p-3 rounded-md">{result.recommendations}</p>
                </div>
                {result.warning && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle className="font-bold">Important Warning!</AlertTitle>
                    <AlertDescription className="whitespace-pre-line">{result.warning}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  Disclaimer: This AI tool provides general information and is not a substitute for professional veterinary diagnosis or treatment. Always consult with a qualified veterinarian for any health concerns regarding your pet.
                </p>
              </CardFooter>
            </Card>
          )}
           {!isLoading && !result && !error && (
             <Card className="flex flex-col items-center justify-center p-10 min-h-[200px] shadow-md border-dashed">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-3"/>
                <p className="text-muted-foreground text-center">Results will appear here once you submit your pet's symptoms.</p>
            </Card>
           )}
        </div>
      </div>
    </>
  );
}
