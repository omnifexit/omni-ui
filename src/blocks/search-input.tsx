"use client";

import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { cn } from "../lib/utils";
import { Input } from "../ui/input";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    /** Sits inside the box on the right, so showing it doesn't move anything. */
    trailing?: ReactNode;
    className?: string;
}

export function SearchInput({ value, onChange, placeholder, trailing, className }: SearchInputProps) {
    return (
        <div className={cn("relative", className)}>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                className={cn("bg-card pl-9 [&::-webkit-search-cancel-button]:hidden", trailing ? "pr-24" : undefined)}
            />
            {trailing && <div className="absolute top-1/2 right-1 -translate-y-1/2">{trailing}</div>}
        </div>
    );
}
