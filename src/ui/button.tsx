"use client";

import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

export function Button({ className, ...props }: ComponentProps<"button">) {
    return <button className={cn("omni-ui-marker rounded-3xl bg-rose-600 px-7 py-3 text-white", className)} {...props} />;
}
