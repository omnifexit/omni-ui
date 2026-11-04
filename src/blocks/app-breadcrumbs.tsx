"use client";

import {
    Fragment,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Skeleton } from "../ui/skeleton";
import { UiLink } from "./ui-link";

type Name = string | null | undefined;

const NamesContext = createContext<{
    names: Name[];
    setNames: Dispatch<SetStateAction<Name[]>>;
    hasNoItem: boolean;
    setHasNoItem: Dispatch<SetStateAction<boolean>>;
} | null>(null);

// A number, with or without a readable part ("60", "60-printer-kapot"), or a UUID, with or without one.
const ID_SEGMENT = /^(\d+(-|$)|[a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12})/i;

/** Holds the names the current page gives its breadcrumb. Wrap the layout that shows `AppBreadcrumbs`. */
export function BreadcrumbNamesProvider({ children }: { children: ReactNode }) {
    const [names, setNames] = useState<Name[]>([]);
    const [hasNoItem, setHasNoItem] = useState(false);
    const value = useMemo(() => ({ names, setNames, hasNoItem, setHasNoItem }), [names, hasNoItem]);

    return <NamesContext.Provider value={value}>{children}</NamesContext.Provider>;
}

/** The page couldn't load its item, so the breadcrumb stops waiting for a name. Used by the error and not-found states. */
export function useBreadcrumbHasNoItem() {
    const setHasNoItem = useContext(NamesContext)?.setHasNoItem;

    useEffect(() => {
        setHasNoItem?.(true);
        return () => setHasNoItem?.(false);
    }, [setHasNoItem]);
}

/**
 * Gives the breadcrumb the name to show instead of the id in the URL. Pass undefined while the data loads.
 * For a URL with two ids, like /clients/1/roles/2, pass them in order: useBreadcrumbName(client?.name, role?.name).
 */
export function useBreadcrumbName(...names: Name[]) {
    const setNames = useContext(NamesContext)?.setNames;
    const key = JSON.stringify(names);

    useEffect(() => {
        setNames?.(JSON.parse(key));
        return () => setNames?.([]);
    }, [key, setNames]);
}

interface AppBreadcrumbsProps {
    /** The path without the locale. */
    pathname: string;
    homeLabel: string;
    /** The text for each fixed part of the URL. A part with no text is left out. */
    labels: Record<string, string>;
    /** Parts of the URL with no page of their own, shown as text instead of a link. */
    hasNoPage?: (href: string) => boolean;
}

/** On phones only the last two parts show, so the bar never gets wider than the screen. */
export function AppBreadcrumbs({ pathname, homeLabel, labels, hasNoPage }: AppBreadcrumbsProps) {
    const context = useContext(NamesContext);
    const names = context?.names ?? [];
    const segments = pathname.split("/").filter(Boolean);

    let idCount = 0;
    const crumbs = segments.flatMap((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;

        if (ID_SEGMENT.test(segment)) {
            const name = names[idCount++] ?? null;

            return !name && context?.hasNoItem ? [] : [{ href, name, isId: true }];
        }

        return labels[segment] ? [{ href, name: labels[segment], isId: false }] : [];
    });
    const all = [{ href: "/", name: homeLabel, isId: false }, ...crumbs];

    return (
        <Breadcrumb className="min-w-0">
            <BreadcrumbList className="flex-nowrap">
                {all.map((crumb, index) => {
                    const isLast = index === all.length - 1;
                    const hideOnPhones = index < all.length - 2 ? "max-sm:hidden" : "";
                    const text =
                        crumb.isId && !crumb.name ? (
                            <Skeleton
                                data-slot="breadcrumb-name-loading"
                                className="inline-block h-4 w-24 align-middle"
                            />
                        ) : (
                            crumb.name
                        );

                    return (
                        <Fragment key={crumb.href}>
                            {index > 0 && (
                                <BreadcrumbSeparator className={index < all.length - 1 ? "max-sm:hidden" : ""} />
                            )}
                            <BreadcrumbItem className={`min-w-0 ${hideOnPhones}`}>
                                {isLast ? (
                                    <BreadcrumbPage className="block max-w-56 truncate font-semibold text-foreground">
                                        {text}
                                    </BreadcrumbPage>
                                ) : hasNoPage?.(crumb.href) ? (
                                    <span className="block max-w-40 truncate font-medium text-muted-foreground">
                                        {text}
                                    </span>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <UiLink
                                            href={crumb.href}
                                            className="block max-w-40 truncate font-medium text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {text}
                                        </UiLink>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
