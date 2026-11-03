"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { Popover } from "radix-ui";
import { cn } from "../lib/utils";
import { Input } from "../ui/input";

export interface ComboboxOption {
    value: string;
    label: string;
}

interface AsyncComboboxProps {
    value: string | null;
    /** The chosen option's text, as it may not be in the current search results. */
    valueLabel?: ReactNode;
    onChange: (option: ComboboxOption | null) => void;
    /** Asks the server for options as you type. */
    search: (query: string) => Promise<ComboboxOption[]>;
    placeholder: ReactNode;
    searchPlaceholder?: string;
    emptyLabel: ReactNode;
    clearLabel?: ReactNode;
    className?: string;
}

const SEARCH_DELAY_MS = 300;

export function AsyncCombobox({
    value,
    valueLabel,
    onChange,
    search,
    placeholder,
    searchPlaceholder,
    emptyLabel,
    clearLabel,
    className,
}: AsyncComboboxProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState<ComboboxOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!open) return;

        let isCurrent = true;
        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const results = await search(query);
                if (isCurrent) setOptions(results);
            } catch {
                if (isCurrent) setOptions([]);
            } finally {
                if (isCurrent) setIsLoading(false);
            }
        }, SEARCH_DELAY_MS);

        return () => {
            isCurrent = false;
            clearTimeout(timer);
        };
    }, [open, query, search]);

    const choose = (option: ComboboxOption | null) => {
        onChange(option);
        setOpen(false);
        setQuery("");
    };

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger
                className={cn(
                    "flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-input bg-card px-3 text-sm whitespace-nowrap shadow-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    className,
                )}
            >
                <span className={cn("truncate", !value && "text-muted-foreground")}>
                    {value ? (valueLabel ?? value) : placeholder}
                </span>
                <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    align="start"
                    sideOffset={4}
                    className="z-50 w-(--radix-popover-trigger-width) min-w-56 rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md"
                >
                    <Input
                        autoFocus
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={searchPlaceholder}
                        aria-label={searchPlaceholder}
                    />
                    <div className="mt-2 max-h-60 overflow-y-auto" role="listbox">
                        {clearLabel && value && (
                            <button
                                type="button"
                                className="w-full cursor-pointer rounded-sm px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-accent"
                                onClick={() => choose(null)}
                            >
                                {clearLabel}
                            </button>
                        )}
                        {isLoading && options.length === 0 ? (
                            <div className="flex justify-center p-3">
                                <Loader2 className="size-4 animate-spin text-muted-foreground" />
                            </div>
                        ) : options.length === 0 ? (
                            <p className="px-2 py-3 text-center text-sm text-muted-foreground">{emptyLabel}</p>
                        ) : (
                            options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    role="option"
                                    aria-selected={option.value === value}
                                    className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                                    onClick={() => choose(option)}
                                >
                                    <span className="truncate">{option.label}</span>
                                    {option.value === value && <Check className="size-4 shrink-0" />}
                                </button>
                            ))
                        )}
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
