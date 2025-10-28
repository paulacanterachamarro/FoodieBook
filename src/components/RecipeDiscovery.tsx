'use client';

import type { Meal } from '@/lib/definitions';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { RecipeCard } from '@/components/RecipeCard';
import { Search } from 'lucide-react';

export function RecipeDiscovery({ initialRecipes }: { initialRecipes: Meal[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState(initialRecipes);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If search query is cleared, revert to initial state
    if (!searchQuery.trim()) {
      setRecipes(initialRecipes);
      return;
    }

    // Debounce API calls
    const handler = setTimeout(() => {
      const fetchSearchedRecipes = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`);
          const data = await response.json();
          setRecipes(data.meals || []);
        } catch (error) {
          console.error("Failed to fetch search results:", error);
          setRecipes([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSearchedRecipes();
    }, 500); // 500ms delay before firing search

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, initialRecipes]);
  
  return (
    <div>
      <div className="relative mb-8 max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          aria-label="Search for a recipe"
          placeholder="Search for recipes (e.g., 'Chicken Curry')"
          className="pl-12 h-14 text-lg bg-card border-2 border-border focus:border-primary focus:ring-primary shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-16 font-body text-muted-foreground text-lg">Searching for delicious recipes...</div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.idMeal} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 font-body text-muted-foreground text-lg">
          <p className="font-semibold text-xl mb-2">No recipes found.</p>
          <p>Try a different search term or explore our categories!</p>
        </div>
      )}
    </div>
  );
}
