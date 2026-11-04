"use client";

import { useEffect, useRef, useState, type FormEventHandler, type ReactNode } from "react";
import { BackLink } from "../blocks/back-link";
import { FormCardSkeleton } from "../blocks/form-card";
import { cn } from "../lib/utils";
import { PageHeader } from "../ui/page-header";
import { Skeleton } from "../ui/skeleton";
import { BackLinkSkeleton } from "./page-parts";

interface FormPageProps {
    title: ReactNode;
    description?: ReactNode;
    backHref: string;
    backLabel: ReactNode;
    /** The form's Save and Cancel. */
    actions: ReactNode;
    onSubmit: FormEventHandler<HTMLFormElement>;
    children: ReactNode;
}

// The title and buttons share a row. From tablet width up it stays in view on long forms,
// as a full-width bar under the top bar. On phones the buttons are at the bottom instead,
// where filling in the form ends.
const HEADER = "-my-2 bg-background py-2 md:sticky md:top-16 md:z-5 md:-mx-4 md:px-4 lg:-mx-8 lg:px-8";

export function FormPage({ title, description, backHref, backLabel, actions, onSubmit, children }: FormPageProps) {
    const backRef = useRef<HTMLDivElement>(null);
    const [stuck, setStuck] = useState(false);

    // Once the back link has scrolled away, the title row is what the form slides under.
    useEffect(() => {
        const element = backRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), {
            rootMargin: "-64px 0px 0px 0px",
        });
        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div ref={backRef} className="-mb-1 flex">
                <BackLink href={backHref}>{backLabel}</BackLink>
            </div>
            <PageHeader
                title={title}
                description={description}
                action={actions}
                actionsHiddenOnPhones
                className={cn(HEADER, stuck && "md:shadow-[0_1px_0_0_var(--border)]")}
            />
            {children}
            <div className="md:hidden">{actions}</div>
        </form>
    );
}

/** Give it the same cards as the form, so the page doesn't jump when the form loads. */
export function FormPageSkeleton({ children }: { children?: ReactNode }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="-mb-1 flex">
                <BackLinkSkeleton />
            </div>
            <div className="-my-2 flex flex-wrap items-center justify-between gap-4 py-2">
                <Skeleton className="h-9 w-56 max-w-full" />
                <div className="flex gap-3 max-md:hidden">
                    <Skeleton className="h-10 w-20 rounded-md" />
                    <Skeleton className="h-10 w-24 rounded-md" />
                </div>
            </div>
            {children ?? <FormCardSkeleton />}
            <div className="grid grid-cols-2 gap-3 md:hidden">
                <Skeleton className="h-10 rounded-md" />
                <Skeleton className="h-10 rounded-md" />
            </div>
        </div>
    );
}
