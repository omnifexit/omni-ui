import React from "react";
import { Skeleton } from "./skeleton";
import { cn } from "../lib/utils";

interface PageHeaderProps {
    title: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}

// On phones the actions fill the width: one full width, two side by side, and an
// odd last one on its own row. A page passes its buttons directly, without a wrapper.
const ACTIONS =
    "grid w-full grid-cols-2 gap-2 empty:hidden sm:flex sm:w-auto sm:items-center " +
    "[&>*:last-child:nth-child(odd)]:col-span-2 max-sm:[&>a>button]:w-full max-sm:[&>button]:w-full";

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
    return (
        <div className={cn("flex flex-wrap items-center justify-between gap-4", className)}>
            <div className="max-w-full min-w-0 space-y-1 wrap-anywhere">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                {description && <div className="text-muted-foreground">{description}</div>}
            </div>
            <div data-slot="page-actions" className={ACTIONS}>
                {action}
            </div>
        </div>
    );
}

export function PageHeaderSkeleton({
    hasAction = false,
    hasSearch = false,
}: {
    hasAction?: boolean;
    hasSearch?: boolean;
}) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-12 w-full max-w-72 sm:h-6" />
            </div>
            <div className="flex w-full flex-col gap-2 empty:hidden sm:w-auto sm:flex-row sm:items-center">
                {hasSearch && <Skeleton className="h-10 w-full rounded-md sm:w-64" />}
                {hasAction && <Skeleton className="h-10 w-full rounded-md sm:w-28" />}
            </div>
        </div>
    );
}
