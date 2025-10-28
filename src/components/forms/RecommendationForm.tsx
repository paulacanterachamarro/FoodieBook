'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

import { getRecommendationsAction } from '@/lib/actions';
import type { RecommendationFormState } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lightbulb } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? 'Generating Ideas...' : 'Get Recommendations'}
    </Button>
  );
}

export function RecommendationForm() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState<RecommendationFormState, FormData>(getRecommendationsAction, undefined);

  useEffect(() => {
    if (state?.error) {
      toast({
        title: 'Oops!',
        description: state.error,
        variant: 'destructive',
      });
    }
    // On success, we don't need a toast, as the results are displayed directly.
    // We also don't clear the form, so the user can tweak their inputs.
  }, [state, toast]);

  return (
    <Card>
      <form ref={formRef} action={formAction}>
        <CardHeader>
          <CardTitle className="font-headline">Your Preferences</CardTitle>
          <CardDescription>
            Tell us what you like and dislike, and any dietary needs you have.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="dietaryRestrictions" className="font-medium">Dietary Restrictions</label>
            <Textarea
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              placeholder="e.g., vegetarian, gluten-free, no nuts"
              className="min-h-[80px]"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="preferences" className="font-medium">Cuisines, Ingredients, or Dish Types</label>
            <Textarea
              id="preferences"
              name="preferences"
              placeholder="e.g., love Italian food, spicy dishes, quick 30-minute meals, chicken"
              className="min-h-[80px]"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <SubmitButton />
          {state?.recommendations && (
             <div className="w-full pt-4 mt-4 border-t">
                <h3 className="font-headline text-2xl text-primary mb-4 text-center">Your Personalized Ideas!</h3>
                <ul className="space-y-3">
                    {state.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3 bg-secondary/50 p-3 rounded-md">
                            <Lightbulb className="h-5 w-5 text-accent-foreground/80 mt-0.5 shrink-0" />
                            <span className="font-medium text-secondary-foreground">{rec}</span>
                        </li>
                    ))}
                </ul>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
