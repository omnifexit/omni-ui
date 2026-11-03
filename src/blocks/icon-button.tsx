"use client";

import type { ComponentProps, ComponentType } from "react";
import { cn } from "../lib/utils";
import { Button } from "../ui/button";
import { UiLink } from "./ui-link";

interface IconButtonProps extends Omit<ComponentProps<typeof Button>, "children" | "size" | "variant" | "asChild"> {
    icon: ComponentType<{ className?: string }>;
    /** Shown on hover and read by screen readers. */
    label: string;
    tone?: "default" | "danger";
    href?: string;
}

export function IconButton({ icon: Icon, label, tone = "default", href, className, ...props }: IconButtonProps) {
    const classes = cn("relative z-10", tone === "danger" && "text-destructive hover:text-destructive", className);

    if (href) {
        return (
            <Button
                variant="ghost"
                size="icon-sm"
                title={label}
                aria-label={label}
                asChild
                className={classes}
                {...props}
            >
                <UiLink href={href}>
                    <Icon />
                </UiLink>
            </Button>
        );
    }

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            title={label}
            aria-label={label}
            className={classes}
            {...props}
        >
            <Icon />
        </Button>
    );
}
