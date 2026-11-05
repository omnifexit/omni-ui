"use client";

import { useEffect, useState } from "react";
import { ExternalLink, LayoutGrid, getIconByName } from "../icons";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";

export interface LauncherApp {
    id: string;
    slug: string;
    name: string;
    url: string;
    launch_url: string;
    icon: string;
}

export interface LauncherTool {
    id: number;
    key: string;
    label: string;
    url: string;
    icon: string;
    description?: string;
}

interface AppSwitcherProps {
    currentAppSlug: string;
    isCollapsed?: boolean;
    /** Loads what this person can open. */
    load: () => Promise<{ apps?: LauncherApp[]; tools?: LauncherTool[] }>;
    labels: Record<"appSwitcher" | "apps" | "loading" | "noAppsAvailable" | "tools", string>;
}

// The sidebar shows two switchers and remounts them, and this list only changes when someone's access does.
let loaded: Promise<{ apps?: LauncherApp[]; tools?: LauncherTool[] }> | null = null;

export function AppSwitcher({ currentAppSlug, isCollapsed = false, load, labels }: AppSwitcherProps) {
    const [{ apps, tools, hasLoaded, isLoading }, setLauncher] = useState({
        apps: [] as LauncherApp[],
        tools: [] as LauncherTool[],
        hasLoaded: false,
        isLoading: true,
    });
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        let isCurrent = true;

        loaded ??= load();
        loaded
            .then(
                (data) => ({ apps: data.apps ?? [], tools: data.tools ?? [] }),
                () => ({ apps: [], tools: [] }),
            )
            .then((data) => {
                if (isCurrent) setLauncher({ ...data, hasLoaded: true, isLoading: false });
            });

        return () => {
            isCurrent = false;
        };
    }, [load]);

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`
                        rounded-xl transition-all duration-200 cursor-pointer
                        hover:bg-muted text-muted-foreground hover:text-foreground
                        ${isOpen ? "bg-muted text-foreground" : ""}
                        ${isCollapsed ? "h-9 w-9" : "h-8 w-8"}
                    `}
                    title={labels.appSwitcher}
                    aria-label={labels.appSwitcher}
                >
                    <LayoutGrid className="size-4.5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align={isCollapsed ? "start" : "end"}
                side={isCollapsed ? "right" : "bottom"}
                sideOffset={10}
                className="w-[340px] p-3.5 rounded-2xl shadow-2xl border-border bg-card/95 backdrop-blur-md z-50"
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border/70 px-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {labels.appSwitcher}
                        </span>
                    </div>
                </div>

                {/* Apps Grid */}
                {apps.length > 0 && (
                    <div className="mb-2">
                        <div className="text-2xs font-semibold text-muted-foreground px-1 mb-2">{labels.apps}</div>
                        <div className="grid grid-cols-3 gap-2">
                            {apps.map((app) => {
                                const Icon = getIconByName(app.icon);
                                const isCurrent = app.slug === currentAppSlug;

                                return (
                                    <a
                                        key={app.id}
                                        href={isCurrent ? undefined : app.launch_url}
                                        onClick={() => {
                                            if (isCurrent) setIsOpen(false);
                                        }}
                                        className={`
                                            flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-200 group relative
                                            ${
                                                isCurrent
                                                    ? "bg-primary/10 border-primary/40 text-primary cursor-default shadow-sm"
                                                    : "hover:bg-muted/80 hover:border-border border-transparent text-foreground hover:scale-[1.02] cursor-pointer"
                                            }
                                        `}
                                    >
                                        {isCurrent && (
                                            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                            </span>
                                        )}
                                        <div
                                            className={`
                                                p-2 rounded-lg mb-1.5 transition-colors
                                                ${
                                                    isCurrent
                                                        ? "bg-primary text-primary-foreground shadow-sm"
                                                        : "bg-muted group-hover:bg-primary/10 group-hover:text-primary text-muted-foreground"
                                                }
                                            `}
                                        >
                                            <Icon className="size-4.5" />
                                        </div>
                                        <span className="text-2xs font-medium truncate w-full">{app.name}</span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Tools Grid */}
                {tools.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/70">
                        <div className="text-2xs font-semibold text-muted-foreground px-1 mb-2">{labels.tools}</div>
                        <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-0.5">
                            {tools.map((tool) => {
                                const Icon = getIconByName(tool.icon);

                                return (
                                    <a
                                        key={tool.id}
                                        href={tool.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/80 border border-transparent hover:border-border transition-all duration-150 text-foreground group"
                                    >
                                        <div className="p-1.5 rounded-md bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                                            <Icon className="size-3.5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-medium truncate flex items-center justify-between gap-1">
                                                <span className="truncate">{tool.label}</span>
                                                <ExternalLink className="size-2.5 text-muted-foreground opacity-60 group-hover:opacity-100 shrink-0" />
                                            </div>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}

                {isLoading && apps.length === 0 && tools.length === 0 && (
                    <div className="py-6 text-center text-xs text-muted-foreground">{labels.loading}</div>
                )}

                {!isLoading && hasLoaded && apps.length === 0 && tools.length === 0 && (
                    <div className="py-6 text-center text-xs text-muted-foreground">{labels.noAppsAvailable}</div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
