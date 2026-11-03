"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, X } from "lucide-react";
import type { ListQuery } from "../hooks/use-list-query";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AsyncCombobox, type ComboboxOption } from "./async-combobox";
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
    | { key: string; label: string; type: "dateRange"; fromLabel: string; toLabel: string };

interface FilterBarProps {
    list: ListQuery;
    filters?: FilterDefinition[];
    searchPlaceholder?: string;
    allLabel: string;
    clearLabel: ReactNode;
    /** Removes a chip, for screen readers. */
    removeLabel: string;
}

const ALL = "__all";

export function FilterBar({
    list,
    filters = [],
    searchPlaceholder,
    allLabel,
    clearLabel,
    removeLabel,
}: FilterBarProps) {
    // Remembers the names of people picked in a combobox, for the chips.
    const [comboboxLabels, setComboboxLabels] = useState<Record<string, string>>({});

    const chips = filters.flatMap((filter) => {
        if (filter.type === "dateRange") {
            return [
                {
                    id: `${filter.key}_from`,
                    text: `${filter.label}: ${filter.fromLabel} ${list.filters[`${filter.key}_from`]}`,
                    on: list.filters[`${filter.key}_from`],
                    clear: () => list.setFilter(`${filter.key}_from`, ""),
                },
                {
                    id: `${filter.key}_to`,
                    text: `${filter.label}: ${filter.toLabel} ${list.filters[`${filter.key}_to`]}`,
                    on: list.filters[`${filter.key}_to`],
                    clear: () => list.setFilter(`${filter.key}_to`, ""),
                },
            ].filter((chip) => chip.on);
        }

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

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
                <SearchInput
                    value={list.search}
                    onChange={list.setSearch}
                    placeholder={searchPlaceholder}
                    className="min-w-56 flex-1"
                />
                {filters.map((filter) => {
                    const value = list.filters[filter.key] ?? "";

                    switch (filter.type) {
                        case "select":
                            return (
                                <div key={filter.key} className="w-44">
                                    <Select
                                        value={value || ALL}
                                        onValueChange={(next) => list.setFilter(filter.key, next === ALL ? "" : next)}
                                    >
                                        <SelectTrigger aria-label={filter.label}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={ALL}>{`${allLabel}: ${filter.label}`}</SelectItem>
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
                                            className="w-44 justify-between bg-card font-normal shadow-sm"
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
                                <div key={filter.key} className="w-52">
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
                                <div key={filter.key} className="flex items-center gap-2">
                                    <Input
                                        type="date"
                                        aria-label={`${filter.label}: ${filter.fromLabel}`}
                                        className="w-40 bg-card"
                                        value={list.filters[`${filter.key}_from`] ?? ""}
                                        onChange={(event) => list.setFilter(`${filter.key}_from`, event.target.value)}
                                    />
                                    <Input
                                        type="date"
                                        aria-label={`${filter.label}: ${filter.toLabel}`}
                                        className="w-40 bg-card"
                                        value={list.filters[`${filter.key}_to`] ?? ""}
                                        onChange={(event) => list.setFilter(`${filter.key}_to`, event.target.value)}
                                    />
                                </div>
                            );
                    }
                })}
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
                    <Button variant="link" size="sm" className="h-auto px-1 py-0 text-xs" onClick={list.clearFilters}>
                        {clearLabel}
                    </Button>
                </div>
            )}
        </div>
    );
}
