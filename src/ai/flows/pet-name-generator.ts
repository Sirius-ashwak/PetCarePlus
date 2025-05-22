
'use server';
/**
 * @fileOverview AI flow for generating pet names.
 *
 * - generatePetNames - A function that handles pet name generation.
 * - PetNameGeneratorInput - The input type for the generatePetNames function.
 * - PetNameGeneratorOutput - The return type for the generatePetNames function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PetNameGeneratorInputSchema = z.object({
  petType: z.enum(['dog', 'cat']).describe('The type of pet (dog or cat).'),
  style: z.string().optional().describe('Optional: A style or theme for the names (e.g., "playful", "elegant", "mythical").'),
  count: z.number().int().min(1).max(20).default(10).describe('The number of names to generate.'),
});
export type PetNameGeneratorInput = z.infer<typeof PetNameGeneratorInputSchema>;

const PetNameGeneratorOutputSchema = z.object({
  names: z.array(z.string()).describe('A list of suggested pet names.'),
});
export type PetNameGeneratorOutput = z.infer<typeof PetNameGeneratorOutputSchema>;

export async function generatePetNames(input: PetNameGeneratorInput): Promise<PetNameGeneratorOutput> {
  return petNameGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'petNameGeneratorPrompt',
  input: {schema: PetNameGeneratorInputSchema},
  output: {schema: PetNameGeneratorOutputSchema},
  prompt: `You are a creative assistant specializing in generating pet names.
You will be given a pet type, an optional style preference, and a count of names to generate.
Generate a list of unique and fitting names based on these inputs.

Pet Type: {{{petType}}}
{{#if style}}Style Preference: {{{style}}}{{/if}}
Number of Names to Generate: {{{count}}}

Please provide exactly {{{count}}} names.
Ensure your output strictly adheres to the requested JSON format for the list of names.
`,
});

const petNameGeneratorFlow = ai.defineFlow(
  {
    name: 'petNameGeneratorFlow',
    inputSchema: PetNameGeneratorInputSchema,
    outputSchema: PetNameGeneratorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output || !output.names || output.names.length === 0) {
        // Fallback or error handling if the model doesn't return expected output
        // For simplicity, we'll return a default error or an empty list.
        // A more robust solution might try a simpler prompt or provide default names.
        console.warn("Pet name generator did not return expected output, returning empty list.");
        return { names: ["Try again with different criteria."] };
    }
    return output;
  }
);
