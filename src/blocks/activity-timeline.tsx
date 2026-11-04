import type { ComponentType, ReactNode } from "react";
import { ArrowRight, Clock, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export interface ActivityItem {
    id: string | number;
    title: ReactNode;
    /** What changed, or a note. */
    description?: ReactNode;
    author?: ReactNode;
    time: ReactNode;
    icon?: ComponentType<{ className?: string }>;
}

interface ActivityTimelineProps {
    items: ActivityItem[];
    empty?: ReactNode;
    isLoading?: boolean;
    loadMoreLabel?: ReactNode;
    /** Leave it out when there's nothing more to load. */
    onLoadMore?: () => void;
    loadingMore?: boolean;
}

export function ActivityTimeline({
    items,
    empty,
    isLoading,
    loadMoreLabel,
    onLoadMore,
    loadingMore,
}: ActivityTimelineProps) {
    if (isLoading) return <ActivityTimelineSkeleton />;

    return (
        <Card className="gap-4 p-4">
            {items.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">{empty}</p>
            ) : (
                <ol>
                    {items.map(({ id, title, description, author, time, icon: Icon = Clock }, index) => (
                        <li key={id} className="relative pb-5 pl-8 last:pb-0">
                            {index !== items.length - 1 && (
                                <span className="absolute top-6 left-2.75 h-full w-0.5 bg-muted" />
                            )}
                            <span className="absolute top-0.5 left-0 flex size-6 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                                <Icon className="size-3.5" />
                            </span>
                            <div className="min-w-0 space-y-1">
                                <p className="text-sm font-medium text-foreground first-letter:uppercase">{title}</p>
                                {description}
                                <p className="text-2xs font-medium text-muted-foreground">
                                    {author && (
                                        <>
                                            <span className="text-primary">{author}</span> •{" "}
                                        </>
                                    )}
                                    {time}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            )}
            {onLoadMore && loadMoreLabel && (
                <Button
                    type="button"
                    variant="outline"
                    disabled={loadingMore}
                    onClick={onLoadMore}
                    className="w-full sm:w-auto sm:self-center"
                >
                    {loadingMore && <Loader2 className="animate-spin" />}
                    {loadMoreLabel}
                </Button>
            )}
        </Card>
    );
}

export function ActivityTimelineSkeleton({ rows = 3 }: { rows?: number }) {
    return (
        <Card className="gap-5 p-4">
            {Array.from({ length: rows }, (_, index) => (
                <div key={index} className="flex gap-2">
                    <Skeleton className="size-6 shrink-0 rounded-full" />
                    <div className="min-w-0 flex-1 space-y-1">
                        <Skeleton className="h-5 w-40 max-w-full" />
                        <Skeleton className="h-4 w-28 max-w-full" />
                    </div>
                </div>
            ))}
        </Card>
    );
}

export interface ActivityChange {
    label: ReactNode;
    /** Leave it out when there's no old value to show, like an added attachment. */
    from?: ReactNode;
    to: ReactNode;
}

/** The old and new values of a change, as an item's description. */
export function ActivityChanges({ changes }: { changes: ActivityChange[] }) {
    if (changes.length === 0) return null;

    return (
        <div className="mt-2 space-y-1.5 border-l-2 border-primary/20 py-1 pl-3">
            {changes.map(({ label, from, to }, index) => (
                <div key={index} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-2xs font-medium">
                    <span className="min-w-16 text-muted-foreground lowercase">{label}:</span>
                    {from !== undefined && (
                        <>
                            <span className="break-all text-muted-foreground line-through opacity-60">{from}</span>
                            <ArrowRight className="size-3 shrink-0 text-muted-foreground" />
                        </>
                    )}
                    <span className="break-all font-semibold text-primary">{to}</span>
                </div>
            ))}
        </div>
    );
}
