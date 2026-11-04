import type { ReactNode } from "react";
import { BackLink } from "../blocks/back-link";
import { cn } from "../lib/utils";
import { Skeleton } from "../ui/skeleton";
import { PageHeader } from "../ui/page-header";
import { BackLinkSkeleton, HeaderSkeleton } from "./page-parts";

interface DetailPageProps {
    title: ReactNode;
    description?: ReactNode;
    backHref: string;
    backLabel: ReactNode;
    actions?: ReactNode;
    /** Shown instead of the page while it loads. */
    loading?: ReactNode;
    isLoading?: boolean;
    /** Shown instead of the page when there's nothing to show. */
    notFound?: ReactNode;
    /** The narrow column on the right. */
    side?: ReactNode;
    children: ReactNode;
}

export function DetailPage({
    title,
    description,
    backHref,
    backLabel,
    actions,
    loading,
    isLoading,
    notFound,
    side,
    children,
}: DetailPageProps) {
    if (isLoading) return <>{loading ?? <DetailPageSkeleton hasSide={Boolean(side)} />}</>;
    if (notFound) return <>{notFound}</>;

    return (
        <div className="space-y-6">
            <BackLink href={backHref}>{backLabel}</BackLink>
            <PageHeader title={title} description={description} action={actions} />
            <div className={side ? "grid gap-6 lg:grid-cols-3" : undefined}>
                <div className="space-y-6 lg:col-span-2">{children}</div>
                {side && <aside className="space-y-6">{side}</aside>}
            </div>
        </div>
    );
}

interface DetailPageSkeletonProps {
    hasSide?: boolean;
    /** The height of the top boxes, like "h-38", to match the real page. */
    height?: string;
    /** Comments and activity underneath, across the full width. */
    hasTabs?: boolean;
}

export function DetailPageSkeleton({ hasSide = true, height = "h-96", hasTabs }: DetailPageSkeletonProps) {
    return (
        <div className="space-y-6">
            <BackLinkSkeleton />
            <HeaderSkeleton />
            <div className={hasSide ? "grid gap-6 lg:grid-cols-3" : undefined}>
                <Skeleton className={cn("rounded-xl lg:col-span-2", height)} />
                {hasSide && <Skeleton className={cn("rounded-xl", height)} />}
            </div>
            {hasTabs && (
                <div className="space-y-4">
                    <Skeleton className="h-9 w-48 rounded-md" />
                    <Skeleton className="h-25 rounded-md" />
                </div>
            )}
        </div>
    );
}
