import type { ReactNode } from "react";
import { PageHeader } from "../ui/page-header";
import { Skeleton } from "../ui/skeleton";
import { HeaderSkeleton } from "./page-parts";

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

export function ListPageSkeleton({ rows = 8 }: { rows?: number }) {
    return (
        <div className="space-y-6">
            <HeaderSkeleton />
            <Skeleton className="h-10 w-full" />
            <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                {Array.from({ length: rows }, (_, index) => (
                    <Skeleton key={index} className="h-8 w-full" />
                ))}
            </div>
        </div>
    );
}
