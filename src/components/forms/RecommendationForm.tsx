'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

import { getRecommendationsAction } from '@/lib/actions';
import type { RecommendationFormState } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lightbulb } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'dairy-free', label: 'Dairy-Free' },
  { id: 'nut-free', label: 'Nut-Free' },
];

const preferenceOptions = [
    { id: 'italian', label: 'Italian' },
    { id: 'mexican', label: 'Mexican' },
    { id: 'asian', label: 'Asian' },
    { id: 'spicy', label: 'Spicy' },
    { id: 'quick-meals', label: 'Quick Meals (under 30 min)' },
    { id: 'healthy', label: 'Healthy / Low-Calorie'},
]

const recommendationSchema = z.object({
  dietaryRestrictions: z.array(z.string()).optional(),
  preferences: z.array(z.string()).optional(),
  other: z.string().optional(),
});


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
  const [state, formAction] = useFormState<RecommendationFormState, FormData>(getRecommendationsAction, undefined);

  const form = useForm<z.infer<typeof recommendationSchema>>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      dietaryRestrictions: [],
      preferences: [],
      other: '',
    },
  });

  useEffect(() => {
    if (state?.error) {
      toast({
        title: 'Oops!',
        description: state.error,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <Card>
        <Form {...form}>
            <form action={formAction}>
                <CardHeader>
                <CardTitle className="font-headline">Your Preferences</CardTitle>
                <CardDescription>
                    Tell us what you like and dislike, and any dietary needs you have.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                 <FormField
                    control={form.control}
                    name="dietaryRestrictions"
                    render={() => (
                        <FormItem>
                        <div className="mb-4">
                            <FormLabel className="text-base">Dietary Restrictions</FormLabel>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {dietaryOptions.map((item) => (
                            <FormField
                            key={item.id}
                            control={form.control}
                            name="dietaryRestrictions"
                            render={({ field }) => {
                                return (
                                <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                    <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                        return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                (value) => value !== item.id
                                                )
                                            )
                                        }}
                                    />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    {item.label}
                                    </FormLabel>
                                </FormItem>
                                )
                            }}
                            />
                        ))}
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="preferences"
                    render={() => (
                        <FormItem>
                        <div className="mb-4">
                            <FormLabel className="text-base">Cuisines & Preferences</FormLabel>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {preferenceOptions.map((item) => (
                            <FormField
                            key={item.id}
                            control={form.control}
                            name="preferences"
                            render={({ field }) => {
                                return (
                                <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                    <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                        return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                (value) => value !== item.id
                                                )
                                            )
                                        }}
                                    />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    {item.label}
                                    </FormLabel>
                                </FormItem>
                                )
                            }}
                            />
                        ))}
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="other"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Other (optional)</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Any other cuisines, ingredients, or specific requests? (e.g., 'I love chicken', 'no seafood')"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
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
        </Form>
    </Card>
  );
}
