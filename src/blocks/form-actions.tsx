import type { ReactNode } from "react";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "../ui/button";

interface FormActionsProps {
    submitLabel: ReactNode;
    cancelLabel?: ReactNode;
    onCancel?: () => void;
    submitting?: boolean;
    disabled?: boolean;
}

export function FormActions({ submitLabel, cancelLabel, onCancel, submitting, disabled }: FormActionsProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" disabled={submitting || disabled} className="w-full sm:w-auto">
                {submitting ? <Loader2 className="animate-spin" /> : <Save />}
                {submitLabel}
            </Button>
            {onCancel && cancelLabel && (
                <Button
                    type="button"
                    variant="outline"
                    disabled={submitting}
                    onClick={onCancel}
                    className="w-full sm:w-auto"
                >
                    <X />
                    {cancelLabel}
                </Button>
            )}
        </div>
    );
}
