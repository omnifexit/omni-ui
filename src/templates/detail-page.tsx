import type { ReactNode } from "react";
import { BackLink } from "../blocks/back-link";
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

export function DetailPageSkeleton({ hasSide = true }: { hasSide?: boolean }) {
    return (
        <div className="space-y-6">
            <BackLinkSkeleton />
            <HeaderSkeleton />
            <div className={hasSide ? "grid gap-6 lg:grid-cols-3" : undefined}>
                <Skeleton className="h-96 rounded-xl lg:col-span-2" />
                {hasSide && <Skeleton className="h-64 rounded-xl" />}
            </div>
        </div>
    );
}
