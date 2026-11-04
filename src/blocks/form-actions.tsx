import type { ComponentType, ReactNode } from "react";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "../ui/button";

interface FormActionsProps {
    submitLabel: ReactNode;
    cancelLabel?: ReactNode;
    onCancel?: () => void;
    submitting?: boolean;
    disabled?: boolean;
    icon?: ComponentType<{ className?: string }>;
}

export function FormActions({
    submitLabel,
    cancelLabel,
    onCancel,
    submitting,
    disabled,
    icon: Icon = Save,
}: FormActionsProps) {
    return (
        <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto [&>*:last-child:nth-child(odd)]:col-span-2">
            <Button type="submit" disabled={submitting || disabled} className="w-full sm:w-auto">
                {submitting ? <Loader2 className="animate-spin" /> : <Icon />}
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
