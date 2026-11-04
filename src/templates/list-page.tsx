import type { ReactNode } from "react";
import { PageHeader, PageHeaderSkeleton } from "../ui/page-header";
import { Skeleton } from "../ui/skeleton";

interface ListPageProps {
    title: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    filters?: ReactNode;
    children: ReactNode;
}

export function ListPage({ title, description, actions, filters, children }: ListPageProps) {
    return (
        <div className="space-y-6">
            <PageHeader title={title} description={description} action={actions} />
            {filters}
            {children}
        </div>
    );
}

interface ListPageSkeletonProps {
    hasAction?: boolean;
    rows?: number;
    /** The page's own filter and table skeletons, so nothing jumps when it loads. */
    children?: ReactNode;
}

export function ListPageSkeleton({ hasAction, rows = 8, children }: ListPageSkeletonProps) {
    return (
        <div className="space-y-6">
            <PageHeaderSkeleton hasAction={hasAction} />
            {children ?? (
                <>
                    <Skeleton className="h-10 w-full" />
                    <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                        {Array.from({ length: rows }, (_, index) => (
                            <Skeleton key={index} className="h-8 w-full" />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
