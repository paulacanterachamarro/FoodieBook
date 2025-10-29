import { promises as fs } from 'fs';
import path from 'path';
import type { UserRecipe } from '@/lib/definitions';
import { RecipeCard } from '@/components/RecipeCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function getUserRecipes(): Promise<UserRecipe[]> {
  const userRecipesPath = path.join(process.cwd(), 'src', 'data', 'user-recipes.json');
  try {
    const data = await fs.readFile(userRecipesPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []; // File doesn't exist yet
    }
    console.error("Failed to read user recipes:", error);
    return []; // Return empty on other errors to avoid crashing
  }
}

async function UserRecipesGrid() {
    const recipes = await getUserRecipes();

    if (recipes.length === 0) {
        return (
            <div className="text-center border-2 border-dashed border-border rounded-xl py-20 px-4 mt-8">
                <h2 className="font-headline text-2xl mb-2">Your cookbook is empty!</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Why not be the first to share a recipe? Your creation could appear right here.
                </p>
                <Button asChild>
                    <Link href="/submit">Submit Your First Recipe</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
        </div>
    );
}

function RecipeGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2 pt-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}


export default function UserRecipesPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
          Community Cookbook
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Delicious recipes shared by fellow food lovers.
        </p>
      </header>
      
      <Suspense fallback={<RecipeGridSkeleton />}>
        <UserRecipesGrid />
      </Suspense>
    </div>
  );
}
