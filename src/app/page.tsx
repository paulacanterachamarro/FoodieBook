import { RecipeDiscovery } from '@/components/RecipeDiscovery';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Meal } from '@/lib/definitions';

async function getInitialRecipes(): Promise<Meal[]> {
  try {
    // Fetch recipes starting with 'c' for a good variety
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=c');
    if (!response.ok) {
      console.error('Failed to fetch initial recipes from TheMealDB');
      return [];
    }
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

export default async function Home() {
  const initialRecipes = await getInitialRecipes();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary mb-4 animate-fade-in-down">
          FoodieBook
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-body max-w-2xl mx-auto">
          Discover thousands of recipes from around the world. Your next
          favorite meal is just a search away.
        </p>
      </header>

      <main>
        <Suspense fallback={<RecipeGridSkeleton />}>
          <RecipeDiscovery initialRecipes={initialRecipes} />
        </Suspense>
      </main>
    </div>
  );
}

function RecipeGridSkeleton() {
  return (
    <div>
      <div className="flex justify-center mb-8">
        <Skeleton className="h-14 w-full max-w-2xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
