// Type for a meal from TheMealDB API
export type Meal = {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string;
  [key: `strIngredient${number}`]: string | null;
  [key: `strMeasure${number}`]: string | null;
};

// Type for a recipe submitted by a user
export type UserRecipe = {
  id: string;
  title: string;
  ingredients: string;
  instructions: string;
  imageUrl: string;
  createdAt: string;
};

// State for the AI Recommendation form
export type RecommendationFormState = {
  recommendations?: string[];
  error?: string;
  timestamp?: number;
} | undefined;

// State for the Recipe submission form
export type RecipeFormState = {
  message: string;
  isSuccess: boolean;
  fieldErrors?: Record<string, string[] | undefined>;
  timestamp?: number;
} | undefined;
