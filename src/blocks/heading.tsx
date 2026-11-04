import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

const sizes = {
    lg: "text-3xl font-bold tracking-tight",
    md: "text-lg font-semibold",
    sm: "text-sm font-semibold",
    xs: "text-xs font-semibold tracking-wider text-muted-foreground uppercase",
};

interface HeadingProps extends ComponentProps<"h2"> {
    as?: "h1" | "h2" | "h3" | "h4";
    size?: keyof typeof sizes;
}

export function Heading({ as: Tag = "h2", size = "md", className, ...props }: HeadingProps) {
    return <Tag className={cn("text-foreground", sizes[size], className)} {...props} />;
}
