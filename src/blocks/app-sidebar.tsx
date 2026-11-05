"use client";

import Image, { type StaticImageData } from "next/image";
import { type ComponentProps, type ComponentType, type ReactNode } from "react";
import { LogOut, MoreHorizontal } from "../icons";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "../ui/sidebar";
import { UiLink } from "./ui-link";

interface SidebarLink {
    title: string;
    url: string;
    icon: ComponentType<{ className?: string }>;
    /** Shown when the person has this permission, or any of these. */
    permission?: string | string[];
}

export interface SidebarNavItem extends SidebarLink {
    isActive?: boolean;
}

interface AppSidebarProps extends ComponentProps<typeof Sidebar> {
    navigation: SidebarNavItem[];
    quickActions?: SidebarLink[];
    quickActionsLabel?: string;
    hasPermission: (permission: string) => boolean;
    user: { name?: string; email?: string } | null;
    onLogout: () => void;
    logoutLabel: string;
    logo: StaticImageData;
    collapsedLogo: StaticImageData;
    renderSwitcher: (isCollapsed: boolean) => ReactNode;
    /** Goes above the logout button, like the language choice. */
    userMenu?: ReactNode;
}

export function AppSidebar({
    navigation,
    quickActions = [],
    quickActionsLabel,
    hasPermission,
    user,
    onLogout,
    logoutLabel,
    logo,
    collapsedLogo,
    renderSwitcher,
    userMenu,
    ...props
}: AppSidebarProps) {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    const isAllowed = ({ permission }: SidebarLink) =>
        !permission || (Array.isArray(permission) ? permission.some(hasPermission) : hasPermission(permission));

    const filteredNavigation = navigation.filter(isAllowed);
    const filteredQuickActions = quickActions.filter(isAllowed);

    return (
        <Sidebar collapsible="icon" className="border-r border-border/60" {...props}>
            <SidebarHeader className="border-b border-border bg-card/50 backdrop-blur-sm">
                <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between px-3"}`}>
                    <div
                        className={`flex h-auto items-center justify-center opacity-85 pt-1 ${(isCollapsed && "pt-0 w-14.5") || "w-36"}`}
                    >
                        <Image
                            src={isCollapsed ? collapsedLogo : logo}
                            alt="OmnifexIT Logo"
                            height={0}
                            width={0}
                            priority
                            className="object-contain transition-all duration-300 transform"
                        />
                    </div>
                    {!isCollapsed && renderSwitcher(false)}
                </div>
            </SidebarHeader>
            {isCollapsed && <div className="flex justify-center pt-2">{renderSwitcher(true)}</div>}
            <SidebarContent className="px-2 py-4 bg-card/50">
                <SidebarMenu>
                    {filteredNavigation.map((item) => (
                        <SidebarMenuItem key={item.title} className="mb-1">
                            <SidebarMenuButton
                                asChild
                                tooltip={item.title}
                                isActive={item.isActive}
                                className={`
                                    transition-all duration-200 rounded-lg h-10 px-3
                                    ${
                                        item.isActive
                                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 hover:text-primary-foreground"
                                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                    }
                                `}
                            >
                                <UiLink
                                    href={item.url}
                                    className={`flex items-center ${isCollapsed ? "justify-center gap-0" : "gap-3"}`}
                                >
                                    <item.icon
                                        className={`
                                            ${isCollapsed ? "size-5" : "size-4.5"}
                                            ${item.isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}
                                            transition-all duration-200`}
                                    />
                                    <span className="font-medium group-data-[collapsible=icon]:hidden">
                                        {item.title}
                                    </span>
                                </UiLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>

                {filteredQuickActions.length > 0 && (
                    <>
                        <div className="px-3 mb-2 mt-4 text-xs text-center font-semibold text-muted-foreground uppercase tracking-wider group-data-[collapsible=icon]:hidden">
                            {quickActionsLabel}
                        </div>
                        <SidebarMenu>
                            {filteredQuickActions.map((action) => (
                                <SidebarMenuItem key={action.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={action.title}
                                        className="hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg h-10 px-3 cursor-pointer"
                                    >
                                        <UiLink
                                            href={action.url}
                                            className={`flex items-center ${isCollapsed ? "justify-center gap-0" : "gap-3"}`}
                                        >
                                            <action.icon
                                                className={`${isCollapsed ? "size-5" : "size-4.5"} text-muted-foreground`}
                                            />
                                            <span className="font-medium group-data-[collapsible=icon]:hidden">
                                                {action.title}
                                            </span>
                                        </UiLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </>
                )}
            </SidebarContent>

            <SidebarFooter className="border-t border-border p-2 bg-card/50">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="w-full rounded-xl hover:bg-muted transition-colors duration-200"
                                >
                                    <Avatar className="h-9 w-9 rounded-lg border border-border shadow-sm ring-1 ring-border/50 text-sm">
                                        <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold">
                                            {user?.name?.charAt(0).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                        <span className="truncate font-semibold text-foreground">{user?.name}</span>
                                        <span className="truncate text-xs text-muted-foreground font-medium">
                                            {user?.email}
                                        </span>
                                    </div>
                                    <MoreHorizontal className="ml-auto size-4 group-data-[collapsible=icon]:hidden text-muted-foreground" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl shadow-xl border-border p-1"
                                side="top"
                                align="end"
                                sideOffset={8}
                            >
                                {userMenu}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={onLogout}
                                    className="rounded-lg text-sm flex items-center gap-2 p-2.5 transition-colors cursor-pointer
                                    text-destructive focus:bg-destructive/10 focus:text-destructive"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>{logoutLabel}</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
