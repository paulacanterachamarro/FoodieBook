import { RecipeForm } from '@/components/forms/RecipeForm';
import { Utensils } from 'lucide-react';

export default function SubmitRecipePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
      <header className="text-center mb-8">
        <Utensils className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
          Share Your Recipe
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Contribute to our collection by sharing your favorite recipe with the
          FoodieBook community.
        </p>
      </header>
      <RecipeForm />
    </div>
  );
}
