import type { ReactNode } from "react";
import { Label } from "../ui/label";

interface FieldProps {
    label: ReactNode;
    htmlFor?: string;
    error?: ReactNode;
    hint?: ReactNode;
    children: ReactNode;
}

export function Field({ label, htmlFor, error, hint, children }: FieldProps) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={htmlFor}>{label}</Label>
            {children}
            {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
            {error && <p className="text-xs font-medium text-destructive">{error}</p>}
        </div>
    );
}
