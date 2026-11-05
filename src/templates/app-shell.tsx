"use client";

import { type ReactNode } from "react";
import { AppBreadcrumbs, BreadcrumbNamesProvider } from "../blocks/app-breadcrumbs";
import { UiLinkProvider, type UiLinkComponent } from "../blocks/ui-link";
import { Separator } from "../ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";

interface AppShellProps {
    /** The app's own Link, so navigation keeps the language in the URL. */
    link: UiLinkComponent;
    sidebar: ReactNode;
    pathname: string;
    homeLabel: string;
    labels: Record<string, string>;
    /** Parts of the URL with no page of their own. */
    hasNoPage?: (href: string) => boolean;
    children: ReactNode;
}

/** The frame around every dashboard page: the sidebar, the header with breadcrumbs, and the page. */
export function AppShell({ link, sidebar, pathname, homeLabel, labels, hasNoPage, children }: AppShellProps) {
    return (
        <UiLinkProvider component={link}>
            <BreadcrumbNamesProvider>
                <SidebarProvider>
                    {sidebar}
                    <SidebarInset>
                        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 lg:px-8 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
                                <Separator orientation="vertical" className="mr-2 h-4 bg-muted" />
                                <AppBreadcrumbs
                                    pathname={pathname}
                                    homeLabel={homeLabel}
                                    labels={labels}
                                    hasNoPage={hasNoPage}
                                />
                            </div>
                        </header>
                        <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8 bg-background min-w-0">{children}</div>
                    </SidebarInset>
                </SidebarProvider>
            </BreadcrumbNamesProvider>
        </UiLinkProvider>
    );
}
