"use client";

import type { ComponentType, ReactNode } from "react";
import { AlertCircle, ArrowLeft, Inbox, SearchX } from "lucide-react";
import { Button } from "../ui/button";
import { useBreadcrumbHasNoItem } from "./app-breadcrumbs";
import { UiLink } from "./ui-link";

interface StateProps {
    icon?: ComponentType<{ className?: string }>;
    title: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
}

function State({ icon: Icon = Inbox, title, description, action }: StateProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon className="size-6" />
            </div>
            <div className="space-y-1">
                <p className="font-semibold text-foreground">{title}</p>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            {action}
        </div>
    );
}

export function EmptyState(props: StateProps) {
    return <State {...props} />;
}

export function ErrorState({
    message,
    retryLabel,
    onRetry,
}: {
    message: ReactNode;
    retryLabel?: ReactNode;
    onRetry?: () => void;
}) {
    useBreadcrumbHasNoItem();

    return (
        <State
            icon={AlertCircle}
            title={message}
            action={
                onRetry && retryLabel ? (
                    <Button variant="outline" onClick={onRetry}>
                        {retryLabel}
                    </Button>
                ) : undefined
            }
        />
    );
}

export function NotFoundState({
    title,
    backHref,
    backLabel,
}: {
    title: ReactNode;
    backHref: string;
    backLabel: ReactNode;
}) {
    useBreadcrumbHasNoItem();

    return (
        <State
            icon={SearchX}
            title={title}
            action={
                <Button variant="outline" asChild>
                    <UiLink href={backHref}>
                        <ArrowLeft />
                        {backLabel}
                    </UiLink>
                </Button>
            }
        />
    );
}
