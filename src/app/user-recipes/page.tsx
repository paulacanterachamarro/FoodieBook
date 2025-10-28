import { promises as fs } from 'fs';
import path from 'path';
import type { UserRecipe } from '@/lib/definitions';
import { RecipeCard } from '@/components/RecipeCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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

export default async function UserRecipesPage() {
  const recipes = await getUserRecipes();

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

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center border-2 border-dashed border-border rounded-xl py-20 px-4">
          <h2 className="font-headline text-2xl mb-2">Your cookbook is empty!</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Why not be the first to share a recipe? Your creation could be featured right here.
          </p>
          <Button asChild>
            <Link href="/submit">Submit Your First Recipe</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
