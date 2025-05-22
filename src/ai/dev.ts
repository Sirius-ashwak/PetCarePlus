
import { config } from 'dotenv';
config();

import '@/ai/flows/pet-symptom-checker.ts';
import '@/ai/flows/pet-name-generator.ts';
import '@/ai/flows/breed-identifier-flow.ts';
import '@/ai/flows/pet-query-assistant-flow.ts'; // Added new flow
