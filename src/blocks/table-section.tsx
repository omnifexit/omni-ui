import type { ComponentType, ReactNode } from "react";
import { cn } from "../lib/utils";
import { Skeleton } from "../ui/skeleton";

interface TableSectionProps {
    title: ReactNode;
    description?: ReactNode;
    icon?: ComponentType<{ className?: string }>;
    /** Sits on the title row, like an Add button. Fills the width on phones. */
    actions?: ReactNode;
    className?: string;
    children: ReactNode;
}

// A table already has its own frame, so a titled section around one needs no second box.
export function TableSection({ title, description, icon: Icon, actions, className, children }: TableSectionProps) {
    return (
        <section className={cn("min-w-0 space-y-3", className)}>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <div className="min-w-0 flex-1 basis-56 space-y-0.5">
                    <div className="flex items-center gap-2">
                        {Icon && <Icon className="size-5 shrink-0 text-primary" />}
                        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                    </div>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
                {actions && (
                    <div className="grid w-full max-sm:[&>a]:w-full max-sm:[&>button]:w-full sm:flex sm:w-auto sm:items-center sm:gap-2">
                        {actions}
                    </div>
                )}
            </div>
            {children}
        </section>
    );
}

/** Small sections that belong together, side by side when each still has room. */
export function TableSectionRow({ children }: { children: ReactNode }) {
    return <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,28rem),1fr))] gap-6">{children}</div>;
}

interface TableSectionSkeletonProps {
    rows?: number;
    withActions?: boolean;
    /** What's under the title, when it isn't a table. */
    children?: ReactNode;
}

export function TableSectionSkeleton({ rows = 4, withActions = true, children }: TableSectionSkeletonProps) {
    return (
        <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <div className="min-w-0 flex-1 basis-56 space-y-0.5">
                    <Skeleton className="h-7 w-40 max-w-full" />
                    <Skeleton className="h-5 w-56 max-w-full" />
                </div>
                {withActions && <Skeleton className="h-8 w-full rounded-md sm:w-32" />}
            </div>
            {children ?? (
                <div className="space-y-px overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    {Array.from({ length: rows + 1 }, (_, index) => (
                        <div key={index} className="flex h-12 items-center px-4">
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
