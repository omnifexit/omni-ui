"use client";

import NextLink from "next/link";
import {
    createContext,
    createElement,
    useContext,
    type ComponentProps,
    type ComponentType,
    type ReactNode,
} from "react";

export type UiLinkComponent = ComponentType<ComponentProps<typeof NextLink>>;

const UiLinkContext = createContext<UiLinkComponent>(NextLink);

/** Tells OmniUI which link to use, so the apps' locale-aware link works inside shared blocks. */
export function UiLinkProvider({ component, children }: { component: UiLinkComponent; children: ReactNode }) {
    return <UiLinkContext.Provider value={component}>{children}</UiLinkContext.Provider>;
}

export function UiLink(props: ComponentProps<typeof NextLink>) {
    return createElement(useContext(UiLinkContext), props);
}
