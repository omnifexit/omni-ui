import type { ReactNode } from "react";
import { Button } from "../ui/button";

export interface ActivityItem {
    id: string | number;
    title: ReactNode;
    description?: ReactNode;
    time: ReactNode;
}

interface ActivityTimelineProps {
    items: ActivityItem[];
    empty?: ReactNode;
    loadMoreLabel?: ReactNode;
    onLoadMore?: () => void;
}

export function ActivityTimeline({ items, empty, loadMoreLabel, onLoadMore }: ActivityTimelineProps) {
    if (items.length === 0) return <>{empty}</>;

    return (
        <div className="space-y-4">
            <ol className="relative space-y-5 border-l border-border pl-5">
                {items.map((item) => (
                    <li key={item.id} className="relative">
                        <span className="absolute top-1.5 -left-[1.6rem] size-2.5 rounded-full border-2 border-card bg-muted-foreground" />
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                        <p className="mt-0.5 text-xs text-muted-foreground">{item.time}</p>
                    </li>
                ))}
            </ol>
            {onLoadMore && loadMoreLabel && (
                <Button variant="outline" size="sm" onClick={onLoadMore}>
                    {loadMoreLabel}
                </Button>
            )}
        </div>
    );
}
