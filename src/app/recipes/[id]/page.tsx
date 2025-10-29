import { promises as fs } from 'fs';
import path from 'path';
import type { Meal, UserRecipe } from '@/lib/definitions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { cleanIngredients } from '@/lib/utils';
import { Utensils, ChefHat, CheckSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function getRecipeData(id: string): Promise<{ recipe: Meal | UserRecipe, type: 'mealdb' | 'user' } | null> {
  // Check if it's a user recipe first
  if (id.length > 10) { // Simple check: UUIDs are long, MealDB IDs are short
    const userRecipesPath = path.join(process.cwd(), 'src', 'data', 'user-recipes.json');
    try {
      const data = await fs.readFile(userRecipesPath, 'utf-8');
      const recipes: UserRecipe[] = JSON.parse(data);
      const recipe = recipes.find(r => r.id === id);
      if (recipe) return { recipe, type: 'user' };
    } catch (error) {
      // File might not exist, that's okay
    }
  }

  // If not a user recipe, try TheMealDB
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.meals && data.meals.length > 0) {
      return { recipe: data.meals[0], type: 'mealdb' };
    }
  } catch (error) {
    console.error("Failed to fetch from TheMealDB:", error);
  }

  return null;
}

export default async function RecipePage({ params }: { params: { id: string } }) {
  const result = await getRecipeData(params.id);

  if (!result) {
    notFound();
  }

  const { recipe, type } = result;

  const title = type === 'user' ? (recipe as UserRecipe).title : (recipe as Meal).strMeal;
  const imageUrl = type === 'user' ? (recipe as UserRecipe).imageUrl : (recipe as Meal).strMealThumb;
  
  const ingredients = type === 'user' 
    ? (recipe as UserRecipe).ingredients.split('\n').map(i => i.trim()).filter(Boolean)
    : cleanIngredients(recipe as Meal);
    
  const instructions = (type === 'user' 
    ? (recipe as UserRecipe).instructions 
    : (recipe as Meal).strInstructions)
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.match(/^STEP\s*\d*$/i));

  const category = type === 'mealdb' ? (recipe as Meal).strCategory : null;
  const area = type === 'mealdb' ? (recipe as Meal).strArea : null;
  const tags = type === 'mealdb' && (recipe as Meal).strTags ? (recipe as Meal).strTags?.split(',') : [];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-3 gap-8 md:gap-12">
        {/* Left Column (Desktop) / Top Section (Mobile) */}
        <div className="md:col-span-1 space-y-6">
          <Card className="overflow-hidden sticky top-24">
            <CardHeader className="p-0">
                <div className="relative aspect-4/3 w-full">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <h1 className="font-headline text-3xl font-bold text-primary">{title}</h1>
                 <div className="flex flex-wrap gap-2 mt-4">
                    {category && <Badge variant="secondary">{category}</Badge>}
                    {area && <Badge variant="outline">{area}</Badge>}
                    {tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                 </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Desktop) / Bottom Section (Mobile) */}
        <div className="md:col-span-2 space-y-12">
          {/* Ingredients */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <ChefHat className="w-8 h-8 text-primary" />
              <h2 className="font-headline text-3xl">Ingredientes</h2>
            </div>
            <Card>
                <CardContent className="p-6">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {ingredients.map((item, index) => (
                        <li key={index} className="flex gap-3 items-start">
                           <CheckSquare className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                           <span>{item}</span>
                        </li>
                    ))}
                    </ul>
                </CardContent>
            </Card>
          </section>

          <Separator />
          
          {/* Instructions */}
          <section>
             <div className="flex items-center gap-3 mb-6">
              <Utensils className="w-8 h-8 text-primary" />
              <h2 className="font-headline text-3xl">Instrucciones</h2>
            </div>
            <div className="space-y-6">
              {instructions.map((step, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold font-headline mt-1">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-lg leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
