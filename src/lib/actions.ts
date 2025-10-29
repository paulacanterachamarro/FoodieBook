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
  image: z.instanceof(File).optional(),
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

async function fileToDataURI(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

export async function submitRecipeAction(
  prevState: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {

  const imageFile = formData.get('image') as File | null;

  const validatedFields = recipeSchema.safeParse({
    title: formData.get('title'),
    ingredients: formData.get('ingredients'),
    instructions: formData.get('instructions'),
    image: imageFile && imageFile.size > 0 ? imageFile : undefined,
  });

  if (!validatedFields.success) {
    return {
      isSuccess: false,
      message: 'Validation failed. Please check your input.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  }

  const { title, ingredients, instructions, image } = validatedFields.data;

  try {
    let imageUrl: string;

    if (image) {
      imageUrl = await fileToDataURI(image);
    } else {
      // AI: Generate image for the recipe
      const imageResult = await generateRecipeImage({
        recipeName: title,
        ingredients: ingredients,
      });
      imageUrl = imageResult.imageUrl;
    }


    const newRecipe: UserRecipe = {
      id: crypto.randomUUID(),
      title,
      ingredients,
      instructions,
      imageUrl,
      createdAt: new Date().toISOString(),
    };

    // Save to our "mock database" (JSON file)
    const existingRecipes = await getUserRecipes();
    existingRecipes.unshift(newRecipe); // Add to the beginning of the list
    await fs.writeFile(userRecipesPath, JSON.stringify(existingRecipes, null, 2));
    
    revalidatePath('/user-recipes');
    revalidatePath(`/recipes/${newRecipe.id}`);
    
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
  dietaryRestrictions: z.preprocess((val) => (val ? (val as string).split(',') : []), z.array(z.string()).optional()),
  preferences: z.preprocess((val) => (val ? (val as string).split(',') : []), z.array(z.string()).optional()),
  other: z.string().optional(),
});

export async function getRecommendationsAction(
    prevState: RecommendationFormState, 
    formData: FormData
): Promise<RecommendationFormState> {

    const validatedFields = recommendationSchema.safeParse({
        dietaryRestrictions: formData.get('dietaryRestrictions'),
        preferences: formData.get('preferences'),
        other: formData.get('other'),
    });

    if (!validatedFields.success) {
        return {
            error: 'Invalid form data. Please try again.',
            timestamp: Date.now(),
        };
    }
    
    const { dietaryRestrictions, preferences, other } = validatedFields.data;
    
    const restrictionsText = dietaryRestrictions?.join(', ') || 'None';
    let preferencesText = preferences?.join(', ') || '';

    if (other) {
        preferencesText = preferencesText ? `${preferencesText}, ${other}` : other;
    }

    if (!preferencesText) {
        preferencesText = 'Any';
    }


    if (restrictionsText === 'None' && preferencesText === 'Any') {
        return {
            error: 'Please select at least one preference or dietary restriction.',
            timestamp: Date.now(),
        };
    }
    
    try {
        const result = await getPersonalizedRecipes({
          dietaryRestrictions: restrictionsText,
          preferences: preferencesText
        });
        if (!result.recommendations || result.recommendations.length === 0) {
            return { error: "Couldn't generate recommendations. Please try different preferences.", timestamp: Date.now() };
        }
        return { recommendations: result.recommendations, timestamp: Date.now() };
    } catch(e) {
        console.error(e);
        return { error: 'An unexpected error occurred from the AI. Please try again later.', timestamp: Date.now() };
    }
}
