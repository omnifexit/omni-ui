"use client";

import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "../lib/utils";
import { Skeleton } from "../ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { UiLink } from "./ui-link";

export interface DataTableColumn<Row> {
    key: string;
    header: ReactNode;
    cell: (row: Row) => ReactNode;
    /** The server's sort name. Without it the column can't be sorted. */
    sortKey?: string;
    align?: "left" | "right" | "center";
    className?: string;
    /** Where this goes on a phone's card. A field shows its header next to its value. */
    card?: "title" | "subtitle" | "aside" | "field" | "meta" | "metaEnd" | "hidden";
    /** What to show on the card instead of `cell`. */
    cardCell?: (row: Row) => ReactNode;
    /** Only on the card, like a detail that doesn't need its own column. */
    cardOnly?: boolean;
    /** What shows while loading, in the shape of the real content so nothing jumps. */
    skeleton?: ReactNode;
    /** The cell holds something to press, like a dropdown, so it has to sit above the row's link. */
    interactive?: boolean;
}

interface DataTableProps<Row> {
    columns: DataTableColumn<Row>[];
    rows: Row[] | undefined;
    rowKey: (row: Row) => string | number;
    isLoading?: boolean;
    /** Makes the whole row and phone card a real link, so opening it in a new tab works too. */
    rowHref?: (row: Row) => string;
    /** What screen readers call the link on a phone card. */
    rowLabel?: (row: Row) => string;
    rowActions?: (row: Row) => ReactNode;
    actionsHeader?: ReactNode;
    empty?: ReactNode;
    pagination?: ReactNode;
    sort?: string;
    onSortChange?: (sort: string) => void;
    loadingRows?: number;
}

const alignments = { left: "text-left", right: "text-right", center: "text-center" };

export function DataTable<Row>({
    columns,
    rows,
    rowKey,
    isLoading,
    rowHref,
    rowLabel,
    rowActions,
    actionsHeader,
    empty,
    pagination,
    sort,
    onSortChange,
    loadingRows = 5,
}: DataTableProps<Row>) {
    const tableColumns = columns.filter((column) => !column.cardOnly);
    const columnCount = tableColumns.length + (rowActions ? 1 : 0);
    const onCard = (place: DataTableColumn<Row>["card"]) =>
        columns.filter((column) => (column.card ?? "field") === place);
    const isEmpty = !isLoading && rows?.length === 0;

    const nextSort = (sortKey: string) => (sort === sortKey ? `-${sortKey}` : sortKey);

    return (
        <div className="space-y-3">
            {/* Phones */}
            <div className="space-y-3 md:hidden">
                {isLoading
                    ? Array.from({ length: loadingRows }, (_, index) => (
                          <div
                              key={`skeleton-${index}`}
                              className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm"
                          >
                              <div className="flex items-center gap-3">
                                  <div className="min-w-0 flex-1 space-y-0.5">
                                      {onCard("title").map((column) => (
                                          <div key={column.key}>
                                              <Skeleton className="h-6 w-40" />
                                          </div>
                                      ))}
                                      {onCard("subtitle").map((column) => (
                                          <div key={column.key}>
                                              <Skeleton className="h-5 w-32" />
                                          </div>
                                      ))}
                                  </div>
                                  {(rowActions || onCard("aside").length > 0) && (
                                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                                          {rowActions && <Skeleton className="h-8 w-16" />}
                                          {onCard("aside").length > 0 && (
                                              <Skeleton className="h-5.5 w-24 rounded-full" />
                                          )}
                                      </div>
                                  )}
                              </div>
                              {onCard("field").length > 0 && (
                                  <div className="mt-2 space-y-1">
                                      {onCard("field").map((column) => (
                                          <div key={column.key} className="flex items-center justify-between gap-3">
                                              <Skeleton className="h-5 w-20" />
                                              {column.skeleton ?? <Skeleton className="h-5 w-24" />}
                                          </div>
                                      ))}
                                  </div>
                              )}
                              {(onCard("meta").length > 0 || onCard("metaEnd").length > 0) && (
                                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                      {onCard("meta").map((column) => (
                                          <div key={column.key}>
                                              {column.skeleton ?? <Skeleton className="h-5.5 w-16 rounded-full" />}
                                          </div>
                                      ))}
                                      {onCard("metaEnd").length > 0 && <Skeleton className="ml-auto h-5 w-24" />}
                                  </div>
                              )}
                          </div>
                      ))
                    : rows?.map((row) => {
                          const href = rowHref?.(row);
                          const content = (column: DataTableColumn<Row>) => (column.cardCell ?? column.cell)(row);
                          const above = (column: DataTableColumn<Row>) => (column.interactive ? "relative z-10" : "");

                          return (
                              <div
                                  key={rowKey(row)}
                                  className={cn(
                                      "relative rounded-xl border border-border bg-card px-4 py-3 shadow-sm",
                                      href && "transition-colors hover:border-primary/30",
                                  )}
                              >
                                  {href && (
                                      <UiLink
                                          href={href}
                                          aria-label={rowLabel?.(row)}
                                          className="absolute inset-0 rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                      />
                                  )}
                                  <div className="flex items-center gap-3">
                                      <div className="min-w-0 flex-1 space-y-0.5">
                                          {onCard("title").map((column) => (
                                              <div
                                                  key={column.key}
                                                  className={cn(
                                                      "truncate font-semibold text-foreground",
                                                      above(column),
                                                  )}
                                              >
                                                  {content(column)}
                                              </div>
                                          ))}
                                          {onCard("subtitle").map((column) => (
                                              <div
                                                  key={column.key}
                                                  className={cn(
                                                      "truncate text-sm text-muted-foreground",
                                                      above(column),
                                                  )}
                                              >
                                                  {content(column)}
                                              </div>
                                          ))}
                                      </div>
                                      {(rowActions || onCard("aside").length > 0) && (
                                          <div className="flex max-w-1/2 shrink-0 flex-col items-end gap-1.5">
                                              {rowActions && (
                                                  <div className="relative z-10 flex items-center gap-1">
                                                      {rowActions(row)}
                                                  </div>
                                              )}
                                              {onCard("aside").length > 0 && (
                                                  <div className="flex flex-wrap justify-end gap-1.5">
                                                      {onCard("aside").map((column) => (
                                                          <div
                                                              key={column.key}
                                                              className={cn("min-w-0", above(column))}
                                                          >
                                                              {content(column)}
                                                          </div>
                                                      ))}
                                                  </div>
                                              )}
                                          </div>
                                      )}
                                  </div>
                                  {onCard("field").length > 0 && (
                                      <dl className="mt-2 space-y-1 text-sm">
                                          {onCard("field").map((column) => (
                                              <div key={column.key} className="flex items-center justify-between gap-3">
                                                  <dt className="shrink-0 text-muted-foreground">{column.header}</dt>
                                                  <dd className={cn("min-w-0 truncate text-right", above(column))}>
                                                      {content(column)}
                                                  </dd>
                                              </div>
                                          ))}
                                      </dl>
                                  )}
                                  {(onCard("meta").length > 0 || onCard("metaEnd").length > 0) && (
                                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                          {onCard("meta").map((column) => (
                                              <div key={column.key} className={cn("flex min-w-0 items-center", above(column))}>
                                                  {content(column)}
                                              </div>
                                          ))}
                                          {onCard("metaEnd").length > 0 && (
                                              <div className="ml-auto flex min-w-0 items-center gap-1.5">
                                                  {onCard("metaEnd").map((column) => (
                                                      <div key={column.key} className={cn("flex min-w-0 items-center", above(column))}>
                                                          {content(column)}
                                                      </div>
                                                  ))}
                                              </div>
                                          )}
                                      </div>
                                  )}
                              </div>
                          );
                      })}
                {isEmpty && (
                    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">{empty}</div>
                )}
            </div>

            {/* Larger screens */}
            <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-sm md:block">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            {tableColumns.map((column) => {
                                const isAscending = sort === column.sortKey;
                                const isDescending = sort === `-${column.sortKey}`;
                                const SortIcon = isAscending ? ArrowUp : isDescending ? ArrowDown : ChevronsUpDown;

                                return (
                                    <TableHead
                                        key={column.key}
                                        className={cn("px-4", alignments[column.align ?? "left"], column.className)}
                                        aria-sort={isAscending ? "ascending" : isDescending ? "descending" : undefined}
                                    >
                                        {column.sortKey && onSortChange ? (
                                            <button
                                                type="button"
                                                className="inline-flex cursor-pointer items-center gap-1.5 font-semibold hover:text-primary"
                                                onClick={() => onSortChange(nextSort(column.sortKey!))}
                                            >
                                                {column.header}
                                                <SortIcon
                                                    className={cn(
                                                        "size-3.5",
                                                        !isAscending && !isDescending && "text-muted-foreground",
                                                    )}
                                                />
                                            </button>
                                        ) : (
                                            column.header
                                        )}
                                    </TableHead>
                                );
                            })}
                            {rowActions && <TableHead className="px-4 text-right">{actionsHeader}</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading
                            ? Array.from({ length: loadingRows }, (_, index) => (
                                  <TableRow key={`skeleton-${index}`} className="hover:bg-transparent">
                                      {tableColumns.map((column) => (
                                          <TableCell
                                              key={column.key}
                                              className={cn(
                                                  "px-4 py-3",
                                                  alignments[column.align ?? "left"],
                                                  column.className,
                                              )}
                                          >
                                              {column.skeleton ?? <Skeleton className="h-5 w-24" />}
                                          </TableCell>
                                      ))}
                                      {rowActions && (
                                          <TableCell className="px-4 py-2">
                                              <Skeleton className="ml-auto h-8 w-16" />
                                          </TableCell>
                                      )}
                                  </TableRow>
                              ))
                            : rows?.map((row) => {
                                  const href = rowHref?.(row);

                                  return (
                                      <TableRow key={rowKey(row)} className={cn(href && "relative")}>
                                          {tableColumns.map((column, index) => (
                                              <TableCell
                                                  key={column.key}
                                                  className={cn(
                                                      "px-4 py-3",
                                                      alignments[column.align ?? "left"],
                                                      column.interactive && "relative z-10",
                                                      column.className,
                                                  )}
                                              >
                                                  {href && index === 0 ? (
                                                      <UiLink
                                                          href={href}
                                                          className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-inset"
                                                      >
                                                          {column.cell(row)}
                                                      </UiLink>
                                                  ) : (
                                                      column.cell(row)
                                                  )}
                                              </TableCell>
                                          ))}
                                          {rowActions && (
                                              <TableCell className="px-4 py-2 text-right">
                                                  <div className="flex items-center justify-end gap-1">
                                                      {rowActions(row)}
                                                  </div>
                                              </TableCell>
                                          )}
                                      </TableRow>
                                  );
                              })}
                        {isEmpty && (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={columnCount} className="p-0 whitespace-normal">
                                    {empty}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {pagination}
        </div>
    );
}
