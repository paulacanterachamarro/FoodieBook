'use server';

/**
 * @fileOverview A flow to generate an image for a recipe if the user doesn't provide one.
 *
 * - generateRecipeImage - A function that handles the recipe image generation process.
 * - RecipeImageGenerationInput - The input type for the generateRecipeImage function.
 * - RecipeImageGenerationOutput - The return type for the generateRecipeImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecipeImageGenerationInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  ingredients: z.string().describe('A comma separated list of the ingredients.'),
});
export type RecipeImageGenerationInput = z.infer<typeof RecipeImageGenerationInputSchema>;

const RecipeImageGenerationOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated image.'),
});
export type RecipeImageGenerationOutput = z.infer<typeof RecipeImageGenerationOutputSchema>;

export async function generateRecipeImage(input: RecipeImageGenerationInput): Promise<RecipeImageGenerationOutput> {
  return recipeImageGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recipeImageGenerationPrompt',
  input: {schema: RecipeImageGenerationInputSchema},
  output: {schema: RecipeImageGenerationOutputSchema},
  prompt: `Generate a photo-realistic image of the dish described by the recipe name and ingredients.
Recipe Name: {{{recipeName}}}
Ingredients: {{{ingredients}}}
`, // Added ingredients to the prompt
});

const recipeImageGenerationFlow = ai.defineFlow(
  {
    name: 'recipeImageGenerationFlow',
    inputSchema: RecipeImageGenerationInputSchema,
    outputSchema: RecipeImageGenerationOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate an image of ${input.recipeName}, made with ${input.ingredients}`,
    });

    return {
      imageUrl: media.url,
    };
  }
);
