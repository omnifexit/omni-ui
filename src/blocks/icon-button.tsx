"use client";

import type { ComponentProps, ComponentType } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "../ui/button";
import { UiLink } from "./ui-link";

interface IconButtonProps extends Omit<ComponentProps<typeof Button>, "children" | "size" | "variant" | "asChild"> {
    icon: ComponentType<{ className?: string }>;
    /** Shown on hover and read by screen readers. */
    label: string;
    tone?: "default" | "danger";
    /** Outline is for sitting next to other outlined buttons or an input, not for row actions. */
    variant?: "ghost" | "outline";
    /** Shows a spinner and can't be clicked while its work is running. */
    busy?: boolean;
    href?: string;
}

export function IconButton({
    icon: Icon,
    label,
    tone = "default",
    variant = "ghost",
    busy,
    href,
    disabled,
    className,
    ...props
}: IconButtonProps) {
    const classes = cn("relative z-10", tone === "danger" && "text-destructive hover:text-destructive", className);

    if (href) {
        return (
            <Button
                variant={variant}
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
            variant={variant}
            size="icon-sm"
            title={label}
            aria-label={label}
            disabled={disabled || busy}
            className={classes}
            {...props}
        >
            {busy ? <Loader2 className="animate-spin" /> : <Icon />}
        </Button>
    );
}
