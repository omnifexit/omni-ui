import type { ReactNode } from "react";
import { BackLink } from "../blocks/back-link";
import { Section } from "../blocks/section";
import { PageHeader } from "../ui/page-header";
import { BackLinkSkeleton, FieldsSkeleton, HeaderSkeleton } from "./page-parts";

interface FormPageProps {
    title: ReactNode;
    description?: ReactNode;
    backHref: string;
    backLabel: ReactNode;
    isLoading?: boolean;
    /** Shown instead of the form when there's nothing to edit. */
    notFound?: ReactNode;
    children: ReactNode;
}

export function FormPage({ title, description, backHref, backLabel, isLoading, notFound, children }: FormPageProps) {
    if (isLoading) return <FormPageSkeleton />;
    if (notFound) return <>{notFound}</>;

    return (
        <div className="space-y-6">
            <BackLink href={backHref}>{backLabel}</BackLink>
            <PageHeader title={title} description={description} />
            {children}
        </div>
    );
}

export function FormPageSkeleton({ rows = 4 }: { rows?: number }) {
    return (
        <div className="space-y-6">
            <BackLinkSkeleton />
            <HeaderSkeleton />
            <Section>
                <FieldsSkeleton rows={rows} />
            </Section>
        </div>
    );
}
