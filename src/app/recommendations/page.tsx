import { RecommendationForm } from '@/components/forms/RecommendationForm';
import { Sparkles } from 'lucide-react';

export default function RecommendationsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
      <header className="text-center mb-8">
        <Sparkles className="mx-auto h-12 w-12 text-primary mb-4 animate-pulse" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
          AI Recipe Helper
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Stuck in a culinary rut? Let our AI chef whip up some personalized
          recipe ideas for you!
        </p>
      </header>
      <RecommendationForm />
    </div>
  );
}
