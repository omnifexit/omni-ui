"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, X } from "lucide-react";
import type { ListQuery } from "../hooks/use-list-query";
import { cn } from "../lib/utils";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import { AsyncCombobox, type ComboboxOption } from "./async-combobox";
import { FilterGroup } from "./filter-group";
import { SearchInput } from "./search-input";

interface Option {
    value: string;
    label: string;
}

export type FilterDefinition =
    | { key: string; label: string; type: "select"; options: Option[] }
    | { key: string; label: string; type: "multiSelect"; options: Option[] }
    | {
          key: string;
          label: string;
          type: "combobox";
          search: (query: string) => Promise<ComboboxOption[]>;
          searchPlaceholder?: string;
          emptyLabel: ReactNode;
      }
    | { key: string; label?: string; type: "dateRange"; fromLabel: string; toLabel: string };

interface FilterBarProps {
    list: ListQuery;
    filters?: FilterDefinition[];
    searchPlaceholder?: string;
    /** Leave the search box out, for a list with nothing to search like a calendar. */
    withoutSearch?: boolean;
    /**
     * Phones have no column headers to press, so they get a dropdown with these instead.
     * Leave it out on a list that can't be sorted.
     */
    sortOptions?: Option[];
    sortLabel?: string;
    /** Show the sort dropdown on every screen, for a list of cards with no headers at all. */
    alwaysShowSort?: boolean;
    allLabel: string;
    clearLabel: ReactNode;
    /** Removes a chip, for screen readers. */
    removeLabel: string;
}

const ALL = "__all";

// The search box takes nearly all the spare room in a row. Filters that wrap onto a row
// of their own share it instead, so a row never ends in an empty gap.
const SEARCH_WIDTH = "sm:grow-100 sm:basis-56";
const FILTER_WIDTH = "sm:flex-1 sm:basis-40";
const DATE_RANGE_WIDTH = "sm:flex-2 sm:basis-80";

export function FilterBar({
    list,
    filters = [],
    searchPlaceholder,
    withoutSearch,
    sortOptions,
    sortLabel,
    alwaysShowSort,
    allLabel,
    clearLabel,
    removeLabel,
}: FilterBarProps) {
    // Remembers the names of people picked in a combobox, for the chips.
    const [comboboxLabels, setComboboxLabels] = useState<Record<string, string>>({});

    const chips = filters.flatMap((filter) => {
        // A dropdown or date box already shows what's picked, so it needs no chip as well.
        if (filter.type === "dateRange" || filter.type === "select") return [];

        const value = list.filters[filter.key];
        if (!value) return [];

        if (filter.type === "combobox") {
            return [
                {
                    id: filter.key,
                    text: `${filter.label}: ${comboboxLabels[value] ?? value}`,
                    on: value,
                    clear: () => list.setFilter(filter.key, ""),
                },
            ];
        }

        return value.split(",").map((part) => ({
            id: `${filter.key}:${part}`,
            text: `${filter.label}: ${filter.options.find((option) => option.value === part)?.label ?? part}`,
            on: part,
            clear: () =>
                list.setFilter(
                    filter.key,
                    value
                        .split(",")
                        .filter((other) => other !== part)
                        .join(","),
                ),
        }));
    });

    const hasFilters = list.isFiltered;

    const clearButton = (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-muted-foreground"
            disabled={!hasFilters}
            onClick={list.clearFilters}
        >
            <X />
            {clearLabel}
        </Button>
    );

    return (
        <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                {!withoutSearch && (
                    <SearchInput
                        value={list.search}
                        onChange={list.setSearch}
                        placeholder={searchPlaceholder}
                        className={SEARCH_WIDTH}
                        trailing={hasFilters && clearButton}
                    />
                )}
                <FilterGroup>
                    {filters.map((filter) => {
                        const value = list.filters[filter.key] ?? "";

                        switch (filter.type) {
                            case "select":
                                return (
                                    <div key={filter.key} className={FILTER_WIDTH}>
                                        <Select
                                            value={value || ALL}
                                            onValueChange={(next) =>
                                                list.setFilter(filter.key, next === ALL ? "" : next)
                                            }
                                        >
                                            <SelectTrigger aria-label={filter.label}>
                                                <span className="flex min-w-0 gap-1">
                                                    <span className="shrink-0 text-muted-foreground">
                                                        {filter.label}:
                                                    </span>
                                                    <span className="min-w-0 truncate">
                                                        <SelectValue />
                                                    </span>
                                                </span>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={ALL}>{allLabel}</SelectItem>
                                                {filter.options.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                );
                            case "multiSelect": {
                                const selected = value ? value.split(",") : [];

                                return (
                                    <DropdownMenu key={filter.key}>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-between bg-card font-normal shadow-sm",
                                                    FILTER_WIDTH,
                                                )}
                                            >
                                                <span className="truncate">
                                                    {selected.length
                                                        ? `${filter.label} (${selected.length})`
                                                        : filter.label}
                                                </span>
                                                <ChevronDown className="text-muted-foreground" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            {filter.options.map((option) => (
                                                <DropdownMenuCheckboxItem
                                                    key={option.value}
                                                    checked={selected.includes(option.value)}
                                                    onSelect={(event) => event.preventDefault()}
                                                    onCheckedChange={(checked) =>
                                                        list.setFilter(
                                                            filter.key,
                                                            (checked
                                                                ? [...selected, option.value]
                                                                : selected.filter((other) => other !== option.value)
                                                            ).join(","),
                                                        )
                                                    }
                                                >
                                                    {option.label}
                                                </DropdownMenuCheckboxItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                );
                            }
                            case "combobox":
                                return (
                                    <div key={filter.key} className={FILTER_WIDTH}>
                                        <AsyncCombobox
                                            value={value || null}
                                            valueLabel={comboboxLabels[value]}
                                            placeholder={filter.label}
                                            search={filter.search}
                                            searchPlaceholder={filter.searchPlaceholder}
                                            emptyLabel={filter.emptyLabel}
                                            onChange={(option) => {
                                                if (option)
                                                    setComboboxLabels((labels) => ({
                                                        ...labels,
                                                        [option.value]: option.label,
                                                    }));
                                                list.setFilter(filter.key, option?.value ?? "");
                                            }}
                                        />
                                    </div>
                                );
                            case "dateRange":
                                return (
                                    <div
                                        key={filter.key}
                                        className={cn(
                                            "col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center",
                                            DATE_RANGE_WIDTH,
                                        )}
                                    >
                                        <label className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground sm:flex-1">
                                            <span className="w-8 shrink-0 sm:w-auto">{filter.fromLabel}</span>
                                            <Input
                                                type="date"
                                                className="min-w-0 flex-1 bg-card text-foreground"
                                                value={list.filters[`${filter.key}_from`] ?? ""}
                                                onChange={(event) =>
                                                    list.setFilter(`${filter.key}_from`, event.target.value)
                                                }
                                            />
                                        </label>
                                        <label className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground sm:flex-1">
                                            <span className="w-8 shrink-0 sm:w-auto">{filter.toLabel}</span>
                                            <Input
                                                type="date"
                                                className="min-w-0 flex-1 bg-card text-foreground"
                                                value={list.filters[`${filter.key}_to`] ?? ""}
                                                onChange={(event) =>
                                                    list.setFilter(`${filter.key}_to`, event.target.value)
                                                }
                                            />
                                        </label>
                                    </div>
                                );
                        }
                    })}
                    {sortOptions && sortLabel && (
                        <div className={cn(FILTER_WIDTH, !alwaysShowSort && "md:hidden")}>
                            <Select value={list.sort} onValueChange={list.setSort}>
                                <SelectTrigger aria-label={sortLabel}>
                                    <span className="flex min-w-0 gap-1">
                                        <span className="shrink-0 text-muted-foreground">{sortLabel}:</span>
                                        <span className="min-w-0 truncate">
                                            <SelectValue />
                                        </span>
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    {sortOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </FilterGroup>
                {/* Stays in place on bigger screens, so using it doesn't resize the filters. */}
                {withoutSearch && (
                    <div className={cn("shrink-0 max-sm:[&>button]:w-full", !hasFilters && "max-sm:hidden")}>
                        {clearButton}
                    </div>
                )}
            </div>
            {chips.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    {chips.map((chip) => (
                        <span
                            key={chip.id}
                            className="inline-flex items-center gap-1 rounded-full border border-border bg-muted py-0.5 pr-1 pl-2.5 text-xs font-medium"
                        >
                            {chip.text}
                            <button
                                type="button"
                                aria-label={`${removeLabel}: ${chip.text}`}
                                className="cursor-pointer rounded-full p-0.5 hover:bg-accent"
                                onClick={chip.clear}
                            >
                                <X className="size-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

interface FilterBarSkeletonProps {
    /** How many dropdowns the bar has. */
    filters?: number;
    withDateRange?: boolean;
    withoutSearch?: boolean;
    withSort?: boolean;
    alwaysShowSort?: boolean;
}

/** A FilterBar while the page loads, at the same size so nothing jumps. */
export function FilterBarSkeleton({
    filters = 0,
    withDateRange,
    withoutSearch,
    withSort,
    alwaysShowSort,
}: FilterBarSkeletonProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {!withoutSearch && <Skeleton className={cn("h-10 rounded-md", SEARCH_WIDTH)} />}
            <FilterGroup>
                {Array.from({ length: filters }, (_, index) => (
                    <Skeleton key={index} className={cn("h-10 rounded-md", FILTER_WIDTH)} />
                ))}
                {withDateRange && <Skeleton className={cn("col-span-2 h-22 rounded-md sm:h-10", DATE_RANGE_WIDTH)} />}
                {withSort && (
                    <Skeleton className={cn("h-10 rounded-md", FILTER_WIDTH, !alwaysShowSort && "md:hidden")} />
                )}
            </FilterGroup>
            {withoutSearch && <div className="hidden h-8 w-20 shrink-0 sm:block" />}
        </div>
    );
}
