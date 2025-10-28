import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Meal, UserRecipe } from '@/lib/definitions';
import { Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type Recipe = (Meal & { strInstructions?: string }) | (UserRecipe & { strMeal?: string, strMealThumb?: string });

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const isUserRecipe = 'createdAt' in recipe;
  
  const title = isUserRecipe ? recipe.title : recipe.strMeal;
  const imageUrl = isUserRecipe ? recipe.imageUrl : recipe.strMealThumb;
  const category = !isUserRecipe ? recipe.strCategory : null;
  const area = !isUserRecipe ? recipe.strArea : null;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl bg-card">
      <CardHeader className="p-0">
        <div className="relative aspect-4/3 w-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex flex-col flex-grow">
        <CardTitle className="font-headline text-xl mb-2 leading-tight flex-grow">
          {title}
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {category && (
            <Badge variant="secondary" className="font-medium">{category}</Badge>
          )}
          {area && (
            <Badge variant="outline" className="font-medium">{area}</Badge>
          )}
          {isUserRecipe && (
             <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}</span>
             </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
