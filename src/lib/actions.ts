'use server';

import { z } from 'zod';
import { generateRecipeImage } from '@/ai/flows/recipe-image-generation';
import { getPersonalizedRecipes } from '@/ai/flows/personalized-recipe-recommendations';
import type { RecipeFormState, RecommendationFormState, UserRecipe } from '@/lib/definitions';
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const recipeSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  ingredients: z.string().min(10, { message: 'Please list at least one ingredient.' }),
  instructions: z.string().min(20, { message: 'Instructions are too short.' }),
});

const userRecipesPath = path.join(process.cwd(), 'src', 'data', 'user-recipes.json');

async function getUserRecipes(): Promise<UserRecipe[]> {
  try {
    const data = await fs.readFile(userRecipesPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function submitRecipeAction(
  prevState: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  const validatedFields = recipeSchema.safeParse({
    title: formData.get('title'),
    ingredients: formData.get('ingredients'),
    instructions: formData.get('instructions'),
  });

  if (!validatedFields.success) {
    return {
      isSuccess: false,
      message: 'Validation failed. Please check your input.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  }

  const { title, ingredients, instructions } = validatedFields.data;

  try {
    // AI: Generate image for the recipe
    const imageResult = await generateRecipeImage({
      recipeName: title,
      ingredients: ingredients,
    });

    const newRecipe: UserRecipe = {
      id: crypto.randomUUID(),
      title,
      ingredients,
      instructions,
      imageUrl: imageResult.imageUrl,
      createdAt: new Date().toISOString(),
    };

    // Save to our "mock database" (JSON file)
    const existingRecipes = await getUserRecipes();
    existingRecipes.unshift(newRecipe); // Add to the beginning of the list
    await fs.writeFile(userRecipesPath, JSON.stringify(existingRecipes, null, 2));
    
    revalidatePath('/user-recipes');
    
  } catch (error) {
    console.error('Failed to submit recipe:', error);
    return {
      isSuccess: false,
      message: 'An error occurred while submitting the recipe. Please try again.',
      timestamp: Date.now(),
    };
  }
  
  // This part will only be reached on success
  // Redirecting is a better pattern after successful form submission
  redirect('/user-recipes');
}


const recommendationSchema = z.object({
  dietaryRestrictions: z.string().min(1, 'This field is required.'),
  preferences: z.string().min(1, 'This field is required.'),
});

export async function getRecommendationsAction(
    prevState: RecommendationFormState, 
    formData: FormData
): Promise<RecommendationFormState> {
    const validatedFields = recommendationSchema.safeParse({
        dietaryRestrictions: formData.get('dietaryRestrictions'),
        preferences: formData.get('preferences'),
    });

    if (!validatedFields.success) {
        return {
            error: 'Both fields are required. Please tell us about your tastes!',
            timestamp: Date.now(),
        };
    }
    
    try {
        const result = await getPersonalizedRecipes(validatedFields.data);
        if (!result.recommendations || result.recommendations.length === 0) {
            return { error: "Couldn't generate recommendations. Please try different preferences.", timestamp: Date.now() };
        }
        return { recommendations: result.recommendations, timestamp: Date.now() };
    } catch(e) {
        console.error(e);
        return { error: 'An unexpected error occurred from the AI. Please try again later.', timestamp: Date.now() };
    }
}
