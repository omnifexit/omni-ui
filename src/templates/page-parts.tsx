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

export function FieldsSkeleton({ rows = 4 }: { rows?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: rows }, (_, index) => (
                <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ))}
        </div>
    );
}
