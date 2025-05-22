
"use client";

import { useState, useCallback, ChangeEvent } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/loading-spinner";
import { identifyPetBreed } from "@/ai/flows/breed-identifier-flow";
import type { BreedIdentifierInput, BreedIdentifierOutput } from "@/ai/flows/breed-identifier-flow";
import { UploadCloud, AlertTriangle, CheckCircle2, Lightbulb, Dog, Cat, Percent, HeartPulse, Calendar, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BreedIdentifierPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [result, setResult] = useState<BreedIdentifierOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Max 5MB
        setError("Image size should not exceed 5MB.");
        toast({ title: "Error", description: "Image size should not exceed 5MB.", variant: "destructive" });
        setImagePreview(null);
        setImageDataUri(null);
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        setError("Invalid file type. Please upload an image (JPEG, PNG, WEBP, GIF).");
        toast({ title: "Error", description: "Invalid file type. Please upload an image.", variant: "destructive" });
        setImagePreview(null);
        setImageDataUri(null);
        return;
      }

      setError(null); // Clear previous error
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null); // Clear previous results
    }
  }, [toast]);

  const handleSubmit = async () => {
    if (!imageDataUri) {
      setError("Please upload an image first.");
      toast({ title: "Error", description: "Please upload an image first.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    const input: BreedIdentifierInput = { photoDataUri: imageDataUri };

    try {
      const response = await identifyPetBreed(input);
      if (response.error) {
        setError(response.error);
        toast({ title: "Identification Error", description: response.error, variant: "destructive" });
      } else if (!response.isPetDetected) {
        setError(response.breedName || "No pet was detected in the image, or the breed could not be identified.");
        setResult(response); // Still set result to show "not detected" message potentially
      }
      else {
        setResult(response);
      }
    } catch (e) {
      console.error("Breed identification error:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to identify breed. ${errorMessage}`);
      toast({
        title: "Error",
        description: `Could not identify breed. ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="AI Pet Breed Identifier"
        description="Upload a photo of your pet to discover its breed and learn more about it!"
      />
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UploadCloud className="h-5 w-5 text-primary"/>Upload Pet Photo</CardTitle>
            <CardDescription>Choose a clear photo of your pet for best results.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input id="imageUpload" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageUpload} disabled={isLoading} />
            {imagePreview && (
              <div className="mt-4 border p-2 rounded-md bg-muted flex justify-center">
                <Image src={imagePreview} alt="Uploaded pet preview" width={300} height={300} className="rounded-md object-contain max-h-[300px]" />
              </div>
            )}
            <Button onClick={handleSubmit} className="w-full" disabled={isLoading || !imagePreview}>
              {isLoading ? <LoadingSpinner className="mr-2" size={16}/> : <Dog className="mr-2 h-4 w-4" />}
              {isLoading ? "Identifying..." : "Identify Breed"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {isLoading && (
            <Card className="flex flex-col items-center justify-center p-10 min-h-[300px] shadow-lg">
              <LoadingSpinner size={48} />
              <p className="mt-4 text-muted-foreground">Analyzing image, please wait...</p>
            </Card>
          )}

          {error && !isLoading && ( // Show general error only if not loading
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
                  <Lightbulb className="h-6 w-6 text-primary" /> AI Breed Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!result.isPetDetected || result.error || !result.breedName || result.breedName.toLowerCase().includes("unknown") ? (
                  <Alert variant="default">
                    <Info className="h-4 w-4" />
                    <AlertTitle>{result.breedName || "Identification Result"}</AlertTitle>
                    <AlertDescription>
                      {result.error || "The AI could not confidently identify a specific breed or detect a pet. Try a clearer image or a different pet."}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <h2 className="text-2xl font-bold text-primary">{result.breedName}</h2>
                      {result.confidence && (
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                          <Percent className="h-3 w-3"/> Confidence: {(result.confidence * 100).toFixed(0)}%
                        </p>
                      )}
                    </div>
                    
                    {result.description && (
                       <div className="p-3 bg-secondary rounded-md">
                         <h3 className="font-semibold text-md mb-1 flex items-center gap-1"><Info className="h-4 w-4"/>About this Breed:</h3>
                         <p className="text-sm text-foreground">{result.description}</p>
                       </div>
                    )}
                    {result.temperament && (
                       <div className="p-3 bg-secondary rounded-md">
                         <h3 className="font-semibold text-md mb-1 flex items-center gap-1"><Cat className="h-4 w-4"/>Temperament:</h3>
                         <p className="text-sm text-foreground">{result.temperament}</p>
                       </div>
                    )}
                    {result.commonHealthIssues && result.commonHealthIssues.length > 0 && (
                      <div className="p-3 bg-secondary rounded-md">
                        <h3 className="font-semibold text-md mb-1 flex items-center gap-1"><HeartPulse className="h-4 w-4"/>Common Health Issues:</h3>
                        <ul className="list-disc list-inside text-sm text-foreground">
                          {result.commonHealthIssues.map((issue, index) => <li key={index}>{issue}</li>)}
                        </ul>
                      </div>
                    )}
                    {result.averageLifespan && (
                      <div className="p-3 bg-secondary rounded-md">
                        <h3 className="font-semibold text-md mb-1 flex items-center gap-1"><Calendar className="h-4 w-4"/>Average Lifespan:</h3>
                        <p className="text-sm text-foreground">{result.averageLifespan}</p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
               <CardFooter>
                <p className="text-xs text-muted-foreground">
                  Disclaimer: AI breed identification can sometimes be inaccurate. For definitive breed information, consult a professional or DNA testing.
                </p>
              </CardFooter>
            </Card>
          )}
           {!isLoading && !result && !error && (
             <Card className="flex flex-col items-center justify-center p-10 min-h-[300px] shadow-md border-dashed">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-3"/>
                <p className="text-muted-foreground text-center">Upload an image and click "Identify Breed" to see results.</p>
            </Card>
           )}
        </div>
      </div>
    </>
  );
}
