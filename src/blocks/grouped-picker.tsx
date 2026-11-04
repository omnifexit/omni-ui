"use client";

import { useState, type ReactNode } from "react";
import { Check, Plus } from "lucide-react";
import { Popover } from "radix-ui";
import { cn } from "../lib/utils";
import { Input } from "../ui/input";

export interface GroupedPickerOption {
    value: string;
    label: string;
    /** Small text on the right, like a price. */
    hint?: ReactNode;
}

export interface GroupedPickerGroup {
    label: ReactNode;
    options: GroupedPickerOption[];
}

interface GroupedPickerProps {
    groups: GroupedPickerGroup[];
    selected: string[];
    onToggle: (value: string) => void;
    placeholder: ReactNode;
    searchPlaceholder: string;
    emptyLabel: ReactNode;
    className?: string;
}

/** Pick several things from a long list with headings. It stays open so you can pick more than one. */
export function GroupedPicker({
    groups,
    selected,
    onToggle,
    placeholder,
    searchPlaceholder,
    emptyLabel,
    className,
}: GroupedPickerProps) {
    const [query, setQuery] = useState("");

    const term = query.trim().toLowerCase();
    const visible = groups
        .map((group) => ({
            ...group,
            options: group.options.filter((option) => option.label.toLowerCase().includes(term)),
        }))
        .filter((group) => group.options.length > 0);

    return (
        <Popover.Root onOpenChange={(open) => !open && setQuery("")}>
            <Popover.Trigger
                className={cn(
                    "flex h-10 w-full cursor-pointer items-center gap-2 rounded-md border border-input bg-card px-3 text-sm text-muted-foreground shadow-sm hover:bg-accent",
                    className,
                )}
            >
                <Plus className="size-4 shrink-0" />
                <span className="truncate">{placeholder}</span>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    align="start"
                    sideOffset={4}
                    // On a touch screen the keyboard would cover the list before you've seen it.
                    onOpenAutoFocus={(event) => {
                        if (window.matchMedia("(pointer: coarse)").matches) event.preventDefault();
                    }}
                    className="z-50 w-(--radix-popover-trigger-width) min-w-64 rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md"
                >
                    <Input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={searchPlaceholder}
                        aria-label={searchPlaceholder}
                    />
                    <div className="mt-2 max-h-72 overflow-y-auto">
                        {visible.length === 0 && (
                            <p className="px-2 py-3 text-center text-sm text-muted-foreground">{emptyLabel}</p>
                        )}
                        {visible.map((group, index) => (
                            <div key={index} role="group" className="mb-1 last:mb-0">
                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                    {group.label}
                                </div>
                                {group.options.map((option) => {
                                    const isSelected = selected.includes(option.value);

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            aria-pressed={isSelected}
                                            className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                                            onClick={() => onToggle(option.value)}
                                        >
                                            <Check className={cn("size-4 shrink-0", !isSelected && "invisible")} />
                                            <span className="min-w-0 flex-1 truncate">{option.label}</span>
                                            {option.hint && (
                                                <span className="shrink-0 text-xs text-muted-foreground">
                                                    {option.hint}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
