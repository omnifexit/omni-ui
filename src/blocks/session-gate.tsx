"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, type ReactNode } from "react";
import { FullScreenLoader } from "./full-screen-loader";

interface SessionGateProps {
    locale: string;
    isInitialized: boolean;
    isAuthenticated: boolean;
    isLoading: boolean;
    fetchUser: () => void;
    labels: { loading: string; toLogin: string; toApp: string };
    children: ReactNode;
}

/** Sends someone to the login page or into the app, depending on whether they have a session. */
export function SessionGate({
    locale,
    isInitialized,
    isAuthenticated,
    isLoading,
    fetchUser,
    labels,
    children,
}: SessionGateProps) {
    const router = useRouter();
    const pathname = usePathname();

    const redirectTarget = useMemo(() => {
        if (!isInitialized || isLoading) return null;

        const isPublicRoute = pathname.includes("/login");

        if (!isAuthenticated && !isPublicRoute) return `/${locale}/login`;
        if (isAuthenticated && isPublicRoute) return `/${locale}`;

        return null;
    }, [isAuthenticated, isInitialized, isLoading, pathname, locale]);

    useEffect(() => {
        if (!isInitialized) fetchUser();
    }, [isInitialized, fetchUser]);

    useEffect(() => {
        if (redirectTarget) router.push(redirectTarget);
    }, [redirectTarget, router]);

    if (!isInitialized) return <FullScreenLoader message={labels.loading} />;

    if (redirectTarget) return <FullScreenLoader message={isAuthenticated ? labels.toApp : labels.toLogin} />;

    return <>{children}</>;
}
