import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Meal } from "./definitions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cleanIngredients(recipe: Meal): string[] {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}` as keyof Meal];
        const measure = recipe[`strMeasure${i}` as keyof Meal];
        if (ingredient && ingredient.trim()) {
            ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`.trim());
        }
    }
    return ingredients;
}
