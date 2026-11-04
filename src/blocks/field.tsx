import type { ReactNode } from "react";
import { cn } from "../lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface FieldProps {
    label: ReactNode;
    htmlFor?: string;
    error?: ReactNode;
    hint?: ReactNode;
    /** Marks the label. The input still needs its own `required`. */
    required?: boolean;
    /** In a FormCard: shares a row with the next pair on phones. Only for short values. */
    pair?: boolean;
    /** In a FormCard: twice as wide as a normal field, for something like a title. */
    long?: boolean;
    /** In a FormCard: always has a row of its own. */
    wide?: boolean;
    className?: string;
    children: ReactNode;
}

export function Field({ label, htmlFor, error, hint, required, pair, long, wide, className, children }: FieldProps) {
    return (
        <div
            data-pair={pair || undefined}
            data-long={long || undefined}
            data-wide={wide || undefined}
            className={cn("grid grid-cols-[minmax(0,1fr)] gap-2", className)}
        >
            <Label htmlFor={htmlFor}>
                {label}
                {required && (
                    <span aria-hidden className="-ml-1 text-destructive">
                        *
                    </span>
                )}
            </Label>
            {children}
            {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
            {error && <p className="text-xs font-medium text-destructive">{error}</p>}
        </div>
    );
}

interface ToggleFieldProps {
    id: string;
    label: ReactNode;
    description?: ReactNode;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    pair?: boolean;
    long?: boolean;
    wide?: boolean;
}

/** A yes or no choice as tall as a normal field, so it lines up with the fields beside it. */
export function ToggleField({
    id,
    label,
    description,
    checked,
    onCheckedChange,
    disabled,
    pair,
    long,
    wide,
}: ToggleFieldProps) {
    return (
        <div
            data-pair={pair || undefined}
            data-long={long || undefined}
            data-wide={wide || undefined}
            className="flex min-h-17 items-center gap-3 self-stretch rounded-md border border-border bg-card px-3 py-2 shadow-xs"
        >
            <Checkbox
                id={id}
                checked={checked}
                disabled={disabled}
                onCheckedChange={(value) => onCheckedChange(value === true)}
            />
            <div className="min-w-0 space-y-0.5">
                <Label htmlFor={id} className="cursor-pointer">
                    {label}
                </Label>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </div>
        </div>
    );
}
