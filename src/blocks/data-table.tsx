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
}

interface DataTableProps<Row> {
    columns: DataTableColumn<Row>[];
    rows: Row[] | undefined;
    rowKey: (row: Row) => string | number;
    isLoading?: boolean;
    /** Makes the whole row a real link, so opening it in a new tab works too. */
    rowHref?: (row: Row) => string;
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
    rowActions,
    actionsHeader,
    empty,
    pagination,
    sort,
    onSortChange,
    loadingRows = 5,
}: DataTableProps<Row>) {
    const columnCount = columns.length + (rowActions ? 1 : 0);

    const nextSort = (sortKey: string) => (sort === sortKey ? `-${sortKey}` : sortKey);

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        {columns.map((column) => {
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
                    {isLoading && !rows
                        ? Array.from({ length: loadingRows }, (_, index) => (
                              <TableRow key={index} className="hover:bg-transparent">
                                  {Array.from({ length: columnCount }, (_, cell) => (
                                      <TableCell key={cell} className="px-4 py-3">
                                          <Skeleton className="h-5 w-full" />
                                      </TableCell>
                                  ))}
                              </TableRow>
                          ))
                        : rows?.map((row) => {
                              const href = rowHref?.(row);

                              return (
                                  <TableRow key={rowKey(row)} className={cn(href && "relative")}>
                                      {columns.map((column, index) => (
                                          <TableCell
                                              key={column.key}
                                              className={cn(
                                                  "px-4 py-3",
                                                  alignments[column.align ?? "left"],
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
                    {!isLoading && rows?.length === 0 && (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={columnCount} className="p-0 whitespace-normal">
                                {empty}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {pagination}
        </div>
    );
}
