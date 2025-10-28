'use server';
/**
 * @fileOverview A personalized recipe recommendation AI agent.
 *
 * - getPersonalizedRecipes - A function that handles the recipe recommendation process.
 * - PersonalizedRecipeInput - The input type for the getPersonalizedRecipes function.
 * - PersonalizedRecipeOutput - The return type for the getPersonalizedRecipes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecipeInputSchema = z.object({
  dietaryRestrictions: z
    .string()
    .describe('Any dietary restrictions the user has (e.g., vegetarian, gluten-free).'),
  preferences: z
    .string()
    .describe('The user\'s preferred cuisines, ingredients, or types of dishes.'),
});
export type PersonalizedRecipeInput = z.infer<typeof PersonalizedRecipeInputSchema>;

const PersonalizedRecipeOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of personalized recipe recommendations.'),
});
export type PersonalizedRecipeOutput = z.infer<typeof PersonalizedRecipeOutputSchema>;

export async function getPersonalizedRecipes(input: PersonalizedRecipeInput): Promise<PersonalizedRecipeOutput> {
  return personalizedRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecipePrompt',
  input: {schema: PersonalizedRecipeInputSchema},
  output: {schema: PersonalizedRecipeOutputSchema},
  prompt: `You are a recipe recommendation expert. Given a user's dietary restrictions and preferences, you will provide a list of personalized recipe recommendations.

Dietary Restrictions: {{{dietaryRestrictions}}}
Preferences: {{{preferences}}}

Please provide a list of 5 recipe recommendations.`,
});

const personalizedRecipeFlow = ai.defineFlow(
  {
    name: 'personalizedRecipeFlow',
    inputSchema: PersonalizedRecipeInputSchema,
    outputSchema: PersonalizedRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
