"use client";

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useCallback, useEffect, useMemo, useState } from "react";

const SEARCH_DELAY_MS = 300;

export interface ListQuery {
    page: number;
    setPage: (page: number) => void;
    sort: string;
    setSort: (sort: string) => void;
    /** What's in the search box right now. The URL and `params` follow once typing stops. */
    search: string;
    setSearch: (search: string) => void;
    filters: Record<string, string>;
    /** An empty value removes the filter. Goes back to page 1. */
    setFilter: (key: string, value: string) => void;
    clearFilters: () => void;
    /** Ready for the API: `{ page: 2, sort: "-created_at", "filter[status]": "open" }`. */
    params: Record<string, string | number>;
}

interface UseListQueryOptions {
    defaultSort?: string;
    /** The names of every filter this list has. Date ranges use `<key>_from` and `<key>_to`. */
    filterKeys?: string[];
}

/** Keeps a list's page, search, filters and sorting in the URL. It makes no API calls. */
export function useListQuery({ defaultSort = "", filterKeys = [] }: UseListQueryOptions = {}): ListQuery {
    // Pages pass a new array on every render, so compare the keys by their text.
    const keyList = filterKeys.join();
    const keys = useMemo(() => (keyList ? keyList.split(",") : []), [keyList]);

    const parsers = useMemo(
        () => ({
            page: parseAsInteger.withDefault(1),
            sort: parseAsString.withDefault(defaultSort),
            q: parseAsString.withDefault(""),
            ...Object.fromEntries(keys.map((key) => [key, parseAsString.withDefault("")])),
        }),
        [defaultSort, keys],
    );

    const [state, setState] = useQueryStates(parsers);
    const { page, sort, q } = state as unknown as { page: number; sort: string; q: string };
    const [search, setSearchValue] = useState(q);

    useEffect(() => {
        const next = search.trim();
        if (next === q) return;

        const timer = setTimeout(() => void setState({ q: next || null, page: null } as never), SEARCH_DELAY_MS);
        return () => clearTimeout(timer);
    }, [search, q, setState]);

    const filters = useMemo(() => {
        const values = state as unknown as Record<string, string>;
        return Object.fromEntries(keys.filter((key) => values[key]).map((key) => [key, values[key]]));
    }, [state, keys]);

    const setFilter = useCallback(
        (key: string, value: string) => void setState({ [key]: value || null, page: null } as never),
        [setState],
    );

    const clearFilters = useCallback(() => {
        setSearchValue("");
        void setState({ q: null, page: null, ...Object.fromEntries(keys.map((key) => [key, null])) } as never);
    }, [setState, keys]);

    const params = useMemo(() => {
        const result: Record<string, string | number> = { page };
        if (sort) result.sort = sort;
        if (q) result["filter[search]"] = q;
        Object.entries(filters).forEach(([key, value]) => {
            result[`filter[${key}]`] = value;
        });
        return result;
    }, [page, sort, q, filters]);

    return {
        page,
        setPage: (next) => void setState({ page: next } as never),
        sort,
        setSort: (next) => void setState({ sort: next, page: null } as never),
        search,
        setSearch: setSearchValue,
        filters,
        setFilter,
        clearFilters,
        params,
    };
}
