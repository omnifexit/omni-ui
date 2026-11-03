import React from "react";
import { Skeleton } from "./skeleton";
import { cn } from "../lib/utils";

interface PageHeaderProps {
    title: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
    return (
        <div className={cn("flex flex-wrap items-center justify-between gap-4", className)}>
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                {description && <div className="text-muted-foreground">{description}</div>}
            </div>
            {action}
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
                <Skeleton className="h-6 w-72" />
            </div>
            <div className="flex items-center gap-2">
                {hasSearch && <Skeleton className="h-9 w-64 rounded-md" />}
                {hasAction && <Skeleton className="h-9 w-28 rounded-md" />}
            </div>
        </div>
    );
}
