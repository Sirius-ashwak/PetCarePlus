
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className={cn(
      "mb-6 flex flex-col gap-y-2 sm:flex-row sm:items-center",
      actions ? "sm:justify-between" : "sm:justify-center"
    )}>
      <div className={cn(
        "text-center", // Default to center for mobile
        actions ? "sm:text-left" : "sm:text-center" // On sm screens, left if actions, center if no actions
      )}>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 gap-2 mt-4 sm:mt-0">{actions}</div>}
    </div>
  );
}
