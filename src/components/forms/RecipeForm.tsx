'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

import { submitRecipeAction } from '@/lib/actions';
import type { RecipeFormState } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Upload } from 'lucide-react';
import Image from 'next/image';

const recipeSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  ingredients: z.string().min(10, 'Please list at least one ingredient.'),
  instructions: z.string().min(20, 'Instructions must be at least 20 characters long.'),
  image: z.instanceof(File).optional(),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? 'Submitting Recipe...' : 'Submit Recipe'}
    </Button>
  );
}

export function RecipeForm() {
  const { toast } = useToast();
  const [state, formAction] = useFormState<RecipeFormState, FormData>(submitRecipeAction, undefined);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof recipeSchema>>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: '',
      ingredients: '',
      instructions: '',
      image: undefined,
    },
    // This allows us to show server-side errors on the form
    errors: state?.fieldErrors,
  });

  useEffect(() => {
    if (state?.message) {
      if (state.isSuccess) {
        toast({
          title: 'Success!',
          description: state.message,
        });
        form.reset();
        setPreview(null);
      } else {
        toast({
          title: 'Oops!',
          description: state.message,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form action={formAction} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Classic Lasagna" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe Image</FormLabel>
                  <FormControl>
                    <div className="w-full">
                      <label htmlFor="image-upload" className="cursor-pointer group">
                        <div className="relative border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors">
                          {preview ? (
                            <Image src={preview} alt="Recipe image preview" width={500} height={375} className="mx-auto rounded-md object-cover aspect-4/3" />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-48 space-y-2 text-muted-foreground">
                              <Upload className="w-8 h-8"/>
                              <p>Click or drag to upload an image</p>
                            </div>
                          )}
                        </div>
                      </label>
                      <Input
                        id="image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleImageChange}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Optional. If you don&apos;t provide one, AI will generate it for you!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredients</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List each ingredient on a new line..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Step 1: Chop vegetables..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
