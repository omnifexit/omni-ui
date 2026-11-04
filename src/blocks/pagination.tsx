import type { ReactNode } from "react";
import { Button } from "../ui/button";

interface PaginationProps {
    page: number;
    lastPage: number;
    onChange: (page: number) => void;
    /** For example "Page 2 of 4, 60 total". */
    summary: ReactNode;
    previousLabel: ReactNode;
    nextLabel: ReactNode;
}

export function Pagination({ page, lastPage, onChange, summary, previousLabel, nextLabel }: PaginationProps) {
    if (lastPage <= 1) return null;

    return (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <span className="text-sm text-muted-foreground">{summary}</span>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
                    {previousLabel}
                </Button>
                <Button variant="outline" size="sm" disabled={page >= lastPage} onClick={() => onChange(page + 1)}>
                    {nextLabel}
                </Button>
            </div>
        </div>
    );
}
