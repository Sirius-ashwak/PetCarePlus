
'use server';
/**
 * @fileOverview AI flow for identifying pet breeds from images.
 *
 * - identifyPetBreed - A function that handles the breed identification process.
 * - BreedIdentifierInput - The input type for the identifyPetBreed function.
 * - BreedIdentifierOutput - The return type for the identifyPetBreed function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BreedIdentifierInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a pet, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type BreedIdentifierInput = z.infer<typeof BreedIdentifierInputSchema>;

const BreedIdentifierOutputSchema = z.object({
  isPetDetected: z.boolean().describe('Whether or not a pet (dog or cat) was detected in the image.'),
  breedName: z.string().optional().describe('The most likely identified breed of the pet. Provide "Unknown" if unsure or not a pet.'),
  confidence: z.number().min(0).max(1).optional().describe('The confidence level of the breed identification (0.0 to 1.0).'),
  temperament: z.string().optional().describe('General temperament traits of the identified breed.'),
  commonHealthIssues: z.array(z.string()).optional().describe('List of common health issues for the identified breed.'),
  averageLifespan: z.string().optional().describe('Average lifespan of the identified breed (e.g., "10-12 years").'),
  description: z.string().optional().describe('A brief description or interesting facts about the breed.'),
  error: z.string().optional().describe('Error message if identification failed or no pet was detected.'),
});
export type BreedIdentifierOutput = z.infer<typeof BreedIdentifierOutputSchema>;

export async function identifyPetBreed(input: BreedIdentifierInput): Promise<BreedIdentifierOutput> {
  return breedIdentifierFlow(input);
}

const prompt = ai.definePrompt({
  name: 'breedIdentifierPrompt',
  input: {schema: BreedIdentifierInputSchema},
  output: {schema: BreedIdentifierOutputSchema},
  prompt: `You are an expert pet breed identifier. Analyze the provided image to identify the breed of the pet (dog or cat).
If no pet is clearly visible or identifiable, set isPetDetected to false and provide an appropriate error message.
If a pet is detected:
1. Set isPetDetected to true.
2. Identify the most likely breed and provide its name in 'breedName'. If you are unsure, state "Mixed Breed" or "Unknown Breed".
3. Provide a confidence score for your identification (0.0 to 1.0).
4. Briefly describe the typical 'temperament' of this breed.
5. List a few 'commonHealthIssues' associated with this breed.
6. State the 'averageLifespan' for this breed.
7. Provide a short, interesting 'description' of the breed.

Image to analyze: {{media url=photoDataUri}}

Prioritize accuracy. If the image quality is too poor or the subject is ambiguous, it's better to state "Unknown" with low confidence than to guess wildly.
Focus on common dog and cat breeds.
`,
});

const breedIdentifierFlow = ai.defineFlow(
  {
    name: 'breedIdentifierFlow',
    inputSchema: BreedIdentifierInputSchema,
    outputSchema: BreedIdentifierOutputSchema,
  },
  async (input) => {
    if (!input.photoDataUri.startsWith('data:image')) {
        return {
            isPetDetected: false,
            error: "Invalid image data. Please upload a valid image file.",
        };
    }
    try {
        const {output} = await prompt(input);
        if (!output) {
            return {
                isPetDetected: false,
                error: "The AI model did not return a response. Please try again.",
            };
        }
        return output;
    } catch (e) {
        console.error("Error in breedIdentifierFlow:", e);
        return {
            isPetDetected: false,
            error: "An unexpected error occurred during breed identification.",
        };
    }
  }
);

