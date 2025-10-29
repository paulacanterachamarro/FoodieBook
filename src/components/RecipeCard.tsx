import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Meal, UserRecipe } from '@/lib/definitions';
import { Calendar, Tag, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { cleanIngredients } from '@/lib/utils';

type Recipe = (Meal & { strInstructions?: string }) | (UserRecipe & { strMeal?: string, strMealThumb?: string });

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const isUserRecipe = 'createdAt' in recipe;
  
  const id = isUserRecipe ? recipe.id : recipe.idMeal;
  const title = isUserRecipe ? recipe.title : recipe.strMeal;
  const imageUrl = isUserRecipe ? recipe.imageUrl : recipe.strMealThumb;
  const category = !isUserRecipe ? recipe.strCategory : null;
  const area = !isUserRecipe ? recipe.strArea : null;

  const ingredients = isUserRecipe 
    ? recipe.ingredients.split('\n').map(i => i.trim()).filter(Boolean)
    : cleanIngredients(recipe);

  return (
    <Link href={`/recipes/${id}`} className="flex flex-col h-full group">
      <Card className="flex flex-col h-full overflow-hidden transition-transform duration-300 ease-in-out group-hover:-translate-y-2 group-hover:shadow-xl bg-card">
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
          <CardTitle className="font-headline text-xl mb-2 leading-tight group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {ingredients.slice(0, 4).join(', ')}{ingredients.length > 4 ? '...' : ''}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-wrap gap-x-3 gap-y-2 text-xs text-muted-foreground items-center">
            {category && (
              <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span className="font-medium">{category}</span>
              </div>
            )}
            {area && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span className="font-medium">{area}</span>
              </div>
            )}
            {isUserRecipe && (
               <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}</span>
               </div>
            )}
        </CardFooter>
      </Card>
    </Link>
  );
}
