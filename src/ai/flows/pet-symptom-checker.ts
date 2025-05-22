
// Symptom checker
'use server';
/**
 * @fileOverview AI flow for checking pet symptoms and providing potential causes and recommendations.
 * It includes a tool to fetch breed-specific issues, conceptually from a Firebase knowledge base.
 *
 * - petSymptomChecker - A function that handles the pet symptom checking process.
 * - PetSymptomCheckerInput - The input type for the petSymptomChecker function.
 * - PetSymptomCheckerOutput - The return type for the petSymptomChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PetSymptomCheckerInputSchema = z.object({
  symptoms: z.string().describe('The symptoms exhibited by the pet.'),
  petType: z.enum(['dog', 'cat']).describe('The type of pet (dog or cat).'),
  breed: z.string().optional().describe('The breed of the pet, if known.'),
  age: z.number().optional().describe('The age of the pet in years.'),
});
export type PetSymptomCheckerInput = z.infer<typeof PetSymptomCheckerInputSchema>;

const PetSymptomCheckerOutputSchema = z.object({
  potentialCauses: z.string().describe('Potential causes of the symptoms.'),
  recommendations: z.string().describe('Recommendations for addressing the symptoms.'),
  warning: z.string().optional().describe('A warning message to consult a veterinarian if symptoms are severe.'),
});
export type PetSymptomCheckerOutput = z.infer<typeof PetSymptomCheckerOutputSchema>;

// Define Schemas for the tool
const BreedSpecificIssuesInputSchema = z.object({
  breed: z.string().describe('The breed of the pet to fetch common issues for.'),
});

const BreedSpecificIssuesOutputSchema = z.object({
  issues: z.array(z.string()).describe('A list of common health issues or predispositions for the specified breed.'),
});

// Define the Tool
const getBreedSpecificIssuesTool = ai.defineTool(
  {
    name: 'getBreedSpecificIssues',
    description: 'Fetches common health issues or predispositions for a specific pet breed from the PetCare+ Firebase knowledge base. Use this if a breed is provided to get more targeted information.',
    inputSchema: BreedSpecificIssuesInputSchema,
    outputSchema: BreedSpecificIssuesOutputSchema,
  },
  async ({ breed }) => {
    // In a real scenario, this would query Firestore or a dedicated knowledge base.
    // For this example, we'll return mock data.
    const breedLower = breed.toLowerCase();
    if (breedLower.includes('labrador')) {
      return { issues: ['Prone to hip and elbow dysplasia', 'Higher risk of obesity', 'Potential for certain eye conditions like PRA', 'Ear infections due to floppy ears'] };
    }
    if (breedLower.includes('siamese')) {
      return { issues: ['Dental problems are common', 'May be prone to asthma or other respiratory issues', 'Progressive retinal atrophy (PRA) risk', 'Sensitive stomachs reported by some owners'] };
    }
    if (breedLower.includes('german shepherd')) {
      return { issues: ['Hip and elbow dysplasia', 'Degenerative myelopathy', 'Bloat (Gastric Dilatation-Volvulus)', 'Exocrine pancreatic insufficiency (EPI)'] };
    }
    if (breedLower.includes('poodle')) {
      return { issues: ["Addison's disease", 'Bloat (Gastric Dilatation-Volvulus)', 'Thyroid issues (hypothyroidism)', 'Progressive retinal atrophy (PRA)'] };
    }
    // Add more mock breed data as desired
    return { issues: [`No specific common issues pre-loaded in the simplified knowledge base for '${breed}'. General advice will be provided.`] };
  }
);


export async function petSymptomChecker(input: PetSymptomCheckerInput): Promise<PetSymptomCheckerOutput> {
  return petSymptomCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'petSymptomCheckerPrompt',
  input: {schema: PetSymptomCheckerInputSchema},
  output: {schema: PetSymptomCheckerOutputSchema},
  tools: [getBreedSpecificIssuesTool], // Make the tool available to the LLM
  prompt: `You are a veterinary expert for PetCare+ (a Firebase-powered application), skilled in diagnosing pet symptoms and providing potential causes and recommendations.
You have access to a tool called 'getBreedSpecificIssues' which can provide common health issues for a specific pet breed, fetched from PetCare+'s knowledge base.

Given the following information for a {{{petType}}}{{#if breed}}, of breed '{{{breed}}}'{{/if}}{{#if age}}, age {{{age}}} year(s) old{{/if}} pet:
Symptoms: {{{symptoms}}}

{{#if breed}}
If the breed '{{{breed}}}' is known and seems relevant to the symptoms, consider using the 'getBreedSpecificIssues' tool to fetch common health predispositions for this breed. Incorporate any relevant information from the tool into your analysis of potential causes and your recommendations. Clearly state if you used breed-specific information.
{{/if}}

Based on all available information (symptoms, pet details, and any tool outputs), provide:
1.  Potential Causes: List possible reasons for the symptoms.
2.  Recommendations: Suggest actions the pet owner can take.
3.  Warning: If the symptoms seem serious or life-threatening, include a clear warning to consult a veterinarian immediately.

Ensure your response is empathetic and easy for a pet owner to understand.
`,
});

const petSymptomCheckerFlow = ai.defineFlow(
  {
    name: 'petSymptomCheckerFlow',
    inputSchema: PetSymptomCheckerInputSchema,
    outputSchema: PetSymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      // Handle cases where the model might not return an output matching the schema
      // (e.g., if safety settings block the response or if there's an unexpected model error)
      console.error("Pet Symptom Checker Flow did not receive a valid output from the prompt.");
      return {
        potentialCauses: "Could not determine potential causes at this time. The AI model did not provide a response.",
        recommendations: "Please try rephrasing the symptoms or consult a veterinarian directly for advice.",
        warning: "If your pet's condition is serious, please seek veterinary attention immediately."
      };
    }
    return output;
  }
);

