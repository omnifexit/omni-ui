import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface SectionProps {
    title?: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    actions?: ReactNode;
    /** Footer with a line above it, for the form's buttons. */
    footer?: ReactNode;
    className?: string;
    children: ReactNode;
}

export function Section({ title, description, icon, actions, footer, className, children }: SectionProps) {
    return (
        <Card className={className}>
            {(title || description || actions) && (
                <CardHeader className="has-data-[slot=section-actions]:grid-cols-[1fr_auto]">
                    <div className="grid gap-2">
                        {title && (
                            <div className="flex items-center gap-2">
                                {icon}
                                <CardTitle className="text-lg">{title}</CardTitle>
                            </div>
                        )}
                        {description && <CardDescription>{description}</CardDescription>}
                    </div>
                    {actions && <div data-slot="section-actions">{actions}</div>}
                </CardHeader>
            )}
            <CardContent className="space-y-4 pb-0">{children}</CardContent>
            {footer && <div className="border-t border-border px-6 pt-6">{footer}</div>}
        </Card>
    );
}
