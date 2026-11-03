"use client";

import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { UiLink } from "./ui-link";

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <UiLink
            href={href}
            className="group inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
            <ArrowLeft className="mr-1 size-4 transition-transform group-hover:-translate-x-1" />
            {children}
        </UiLink>
    );
}
