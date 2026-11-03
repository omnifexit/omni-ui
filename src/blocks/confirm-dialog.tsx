"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";
import { buttonVariants } from "../ui/button";

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: ReactNode;
    description?: ReactNode;
    confirmLabel: ReactNode;
    cancelLabel: ReactNode;
    onConfirm: () => void;
    busy?: boolean;
    danger?: boolean;
}

/** For short confirmations only. Forms for creating and editing get their own page. */
export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel,
    cancelLabel,
    onConfirm,
    busy,
    danger = true,
}: ConfirmDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={busy}>{cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={busy}
                        className={danger ? buttonVariants({ variant: "destructive" }) : undefined}
                        onClick={(event) => {
                            // The caller closes the dialog once the work is done.
                            event.preventDefault();
                            onConfirm();
                        }}
                    >
                        {busy && <Loader2 className="animate-spin" />}
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
