import type { ComponentType, ReactNode } from "react";
import { cn } from "../lib/utils";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

// As many columns as fit, and each row stretches to fill the width, so a last row of one
// or two fields leaves no gap. Put fields in the order that makes sense first, then use
// `long` on a Field to fill a row. Text areas take a row of their own, start at about
// three lines and grow as you type.
const FIELDS =
    "flex flex-wrap items-start gap-4 [&>*]:min-w-0 [&>*]:flex-[1_1_var(--form-field,16rem)] " +
    "[&>[data-long]]:flex-[2_1_calc(var(--form-field,16rem)*2+1rem)] " +
    "[&>[data-wide]]:basis-full [&>*:has(textarea)]:basis-full " +
    "max-sm:[&>[data-pair]]:basis-[calc(50%-0.5rem)] " +
    "[&_textarea]:max-h-[60vh] [&_textarea]:field-sizing-content " +
    // Tabbing to a field must not hide it under the title row, which stays in view.
    "[&_:is(input,textarea,button)]:scroll-mt-32";

const CARD = "gap-4 p-6";

interface FormCardProps {
    /** Leave it out on a form with one card: the page title already says what it is. */
    title?: ReactNode;
    description?: ReactNode;
    icon?: ComponentType<{ className?: string }>;
    /**
     * For a form inside a bigger page, which has no title row of its own to put its
     * buttons on. They sit on the card's title row, and at the bottom on phones.
     */
    actions?: ReactNode;
    /** Stays on the title row on every screen. */
    headerExtra?: ReactNode;
    children: ReactNode;
    className?: string;
}

export function FormCard({ title, description, icon: Icon, actions, headerExtra, children, className }: FormCardProps) {
    return (
        <Card className={cn(CARD, className)}>
            {(title || actions || headerExtra) && (
                <div className="flex items-center justify-between gap-4">
                    {title && (
                        <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                {Icon && <Icon className="h-5 w-5 shrink-0 text-primary" />}
                                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                            </div>
                            {description && <p className="text-sm text-muted-foreground">{description}</p>}
                        </div>
                    )}
                    {(actions || headerExtra) && (
                        <div className="ml-auto flex shrink-0 items-center gap-3">
                            {headerExtra}
                            {actions && <div className="max-md:hidden">{actions}</div>}
                        </div>
                    )}
                </div>
            )}
            <div className={FIELDS}>{children}</div>
            {actions && <div className="md:hidden">{actions}</div>}
        </Card>
    );
}

// Small cards that belong together, side by side when each still has room for two columns.
export function FormCardRow({ children }: { children: ReactNode }) {
    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,33rem),1fr))] gap-4 [--form-field:14rem]">
            {children}
        </div>
    );
}

function FieldSkeleton({ kind, hint, textClassName }: { kind: string; hint: boolean; textClassName?: string }) {
    return (
        <div
            data-pair={kind === "p" || undefined}
            data-long={kind === "l" || undefined}
            data-wide={kind === "w" || kind === "t" || undefined}
            className="grid grid-cols-[minmax(0,1fr)] gap-2"
        >
            <Skeleton className="h-5 w-24 max-w-full" />
            <Skeleton className={cn("h-10 w-full rounded-md", kind === "t" && (textClassName ?? "h-20"))} />
            {hint && <Skeleton className="h-4 w-3/4" />}
        </div>
    );
}

interface FormCardSkeletonProps {
    titled?: boolean;
    described?: boolean;
    /** The card has buttons on its title row. */
    withActions?: boolean;
    /**
     * The fields in order: f a field, p a pair, l long, w wide and t a text area. Add a +
     * if it has a hint, and spaces wherever they help to read it. "f f p p t" is two
     * fields, a pair and a text area.
     */
    layout?: string;
    /** The height of the text areas, if they don't start at the normal height. */
    textClassName?: string;
    /** Anything before the fields, such as a box that isn't a field. */
    children?: ReactNode;
    /** Anything after the fields, such as a list. */
    after?: ReactNode;
    /** The height of the description, if it takes more than one line on some screens. */
    descriptionClassName?: string;
    className?: string;
}

export function FormCardSkeleton({
    titled,
    described,
    withActions,
    layout = "f f f f",
    textClassName,
    children,
    after,
    descriptionClassName,
    className,
}: FormCardSkeletonProps) {
    const fields = [...layout.matchAll(/([fplwt])(\+?)/g)];

    return (
        <Card className={cn(CARD, className)}>
            {(titled || withActions) && (
                <div className="flex items-center justify-between gap-4">
                    {titled && (
                        <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                                <Skeleton className="size-5 shrink-0" />
                                <Skeleton className="h-7 w-48 max-w-full" />
                            </div>
                            {described && <Skeleton className={cn("h-5 w-72 max-w-full", descriptionClassName)} />}
                        </div>
                    )}
                    {withActions && (
                        <div className="ml-auto flex gap-3 max-md:hidden">
                            <Skeleton className="h-10 w-20 rounded-md" />
                            <Skeleton className="h-10 w-24 rounded-md" />
                        </div>
                    )}
                </div>
            )}
            <div className={FIELDS}>
                {children}
                {fields.map(([, kind, hint], index) => (
                    <FieldSkeleton key={index} kind={kind} hint={hint === "+"} textClassName={textClassName} />
                ))}
                {after}
            </div>
            {withActions && <Skeleton className="h-10 rounded-md md:hidden" />}
        </Card>
    );
}
