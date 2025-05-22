
'use server';
/**
 * @fileOverview AI flow for the PetCare+ Voice Assistant (Pal).
 *
 * - askPetPalAssistant - A function that handles user queries.
 * - PetQueryAssistantInput - The input type for the askPetPalAssistant function.
 * - PetQueryAssistantOutput - The return type for the askPetPalAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PetQueryAssistantInputSchema = z.object({
  query: z.string().min(3).describe('The user_s question for the PetPal voice assistant.'),
});
export type PetQueryAssistantInput = z.infer<typeof PetQueryAssistantInputSchema>;

const PetQueryAssistantOutputSchema = z.object({
  answer: z.string().describe('The assistant_s response to the user_s query.'),
  disclaimerNeeded: z.boolean().describe('True if the answer relates to health or well-being, suggesting a vet consultation disclaimer.')
});
export type PetQueryAssistantOutput = z.infer<typeof PetQueryAssistantOutputSchema>;

export async function askPetPalAssistant(input: PetQueryAssistantInput): Promise<PetQueryAssistantOutput> {
  return petQueryAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'petQueryAssistantPrompt',
  input: {schema: PetQueryAssistantInputSchema},
  output: {schema: PetQueryAssistantOutputSchema},
  prompt: `You are "Pal", the friendly and knowledgeable voice assistant for the PetPal app.
Your goal is to answer common pet care questions to the best of your ability, providing helpful and general advice.

User's query: {{{query}}}

Based on the query, provide a helpful answer.
Also, determine if a disclaimer is needed. Set 'disclaimerNeeded' to true if your answer touches upon health, symptoms, feeding changes, or anything that a pet owner might act upon that could affect their pet's well-being. Set it to false for general knowledge questions (e.g., "how long do Labradors live?", "what are good names for a cat?").

Important considerations for your answer:
- Keep your answers concise and easy to understand.
- If the query sounds like an emergency or a serious health concern, strongly advise the user to contact a veterinarian immediately.
- Do not provide specific medical diagnoses or treatment plans. You can offer general information about conditions or symptoms, but always defer to a vet for diagnosis and treatment.
- You can answer questions about feeding, behavior, grooming, general information about common illnesses, and general pet well-being for dogs and cats.
- If the question is outside the scope of pet care, politely state that you can only help with pet-related queries and set 'disclaimerNeeded' to false.
`,
});

const petQueryAssistantFlow = ai.defineFlow(
  {
    name: 'petQueryAssistantFlow',
    inputSchema: PetQueryAssistantInputSchema,
    outputSchema: PetQueryAssistantOutputSchema,
  },
  async (input) => {
    try {
        const {output} = await prompt(input);
        if (!output) {
            return {
                answer: "I'm sorry, I couldn't process your request at the moment. Please try again.",
                disclaimerNeeded: true,
            };
        }
        return output;
    } catch (e) {
        console.error("Error in petQueryAssistantFlow:", e);
        return {
            answer: "I encountered an issue while trying to understand your question. Please rephrase or try again later.",
            disclaimerNeeded: true,
        };
    }
  }
);
