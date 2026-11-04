import { Skeleton } from "../ui/skeleton";

export function BackLinkSkeleton() {
    return <Skeleton className="h-5 w-32" />;
}

export function HeaderSkeleton() {
    return (
        <div className="space-y-2">
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-5 w-80 max-w-full" />
        </div>
    );
}
