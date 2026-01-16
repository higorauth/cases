'use client';

import { LucideIcon } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function PlaceholderPage({ title, description, icon: Icon }: PlaceholderPageProps) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-border bg-card px-8 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-border bg-primary/10">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h2 className="mt-6 text-3xl font-semibold text-foreground">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      <p className="mt-6 text-xs uppercase tracking-[0.4em] text-muted-foreground">Em desenvolvimento</p>
    </div>
  );
}
