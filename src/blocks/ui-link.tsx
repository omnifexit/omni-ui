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

type UiLinkProps = Omit<ComponentProps<typeof NextLink>, "locale">;

export type UiLinkComponent = ComponentType<UiLinkProps>;

const UiLinkContext = createContext<UiLinkComponent>(NextLink);

/** Tells OmniUI which link to use, so the apps' locale-aware link works inside shared blocks. */
export function UiLinkProvider({ component, children }: { component: UiLinkComponent; children: ReactNode }) {
    return <UiLinkContext.Provider value={component}>{children}</UiLinkContext.Provider>;
}

export function UiLink(props: UiLinkProps) {
    return createElement(useContext(UiLinkContext), props);
}
