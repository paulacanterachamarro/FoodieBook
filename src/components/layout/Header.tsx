'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UtensilsCrossed, Menu, PlusCircle, User, Sparkles, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/submit', label: 'Submit Recipe', icon: PlusCircle },
  { href: '/user-recipes', label: 'Community Recipes', icon: User },
  { href: '/recommendations', label: 'AI Helper', icon: Sparkles },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <UtensilsCrossed className="h-7 w-7" />
            <span className="font-headline text-2xl font-bold">FoodieBook</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Button key={link.href} variant="ghost" asChild
                className={cn(
                    "font-semibold",
                    pathname === link.href ? 'text-primary' : 'text-foreground/70'
                )}
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 py-8">
                    <Link href="/" className="flex items-center gap-3 text-primary mb-4">
                        <UtensilsCrossed className="h-7 w-7" />
                        <span className="font-headline text-2xl font-bold">FoodieBook</span>
                    </Link>
                  {navLinks.map((link) => (
                    <SheetClose key={link.href} asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          'flex items-center gap-3 rounded-md p-3 text-lg font-medium transition-colors',
                          pathname === link.href
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
