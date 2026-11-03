import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

export type StatusTone = "success" | "warning" | "info" | "danger" | "neutral";

const tones: Record<StatusTone, string> = {
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    info: "bg-info text-info-foreground",
    danger: "bg-destructive/10 text-destructive",
    neutral: "bg-muted text-muted-foreground",
};

export function StatusBadge({ tone = "neutral", className, ...props }: ComponentProps<"span"> & { tone?: StatusTone }) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
                tones[tone],
                className,
            )}
            {...props}
        />
    );
}

/** The small grey label, for things that aren't a status. */
export function Tag({ className, ...props }: ComponentProps<"span">) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-md border border-border bg-muted px-1.5 py-0.5 text-2xs font-semibold uppercase tracking-wide text-muted-foreground",
                className,
            )}
            {...props}
        />
    );
}
