"use client";

import type { StaticImageData } from "next/image";
import { useEffect } from "react";
import { LogIn } from "../icons";
import { toast } from "../toast";
import { Button } from "../ui/button";
import { AuthCard } from "../blocks/auth-card";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

interface SsoLoginPageProps {
    /** The service's login route, like `/sales/sso/redirect`. */
    ssoPath: string;
    logo: StaticImageData;
    /** Why someone came back here: no access to this app, or a login that didn't finish. */
    error?: string | null;
    labels: {
        signIn: string;
        description: string;
        button: string;
        notice: string;
        deniedTitle: string;
        deniedDescription: string;
        failedTitle: string;
        failedDescription: string;
    };
}

/** The page of every app that logs in through OmniAuth. */
export function SsoLoginPage({ ssoPath, logo, error, labels }: SsoLoginPageProps) {
    useEffect(() => {
        if (error === "access_denied") {
            toast.error(labels.deniedTitle, {
                id: "access-denied",
                description: labels.deniedDescription,
                duration: 5000,
            });
        }

        if (error === "login_failed") {
            toast.error(labels.failedTitle, {
                id: "login-failed",
                description: labels.failedDescription,
                duration: 5000,
            });
        }
    }, [error, labels.deniedTitle, labels.deniedDescription, labels.failedTitle, labels.failedDescription]);

    const handleLogin = () => {
        // A full page navigation: this is the service's route, not a Next.js page.
        window.location.assign(new URL(ssoPath, window.location.origin).href);
    };

    return (
        <AuthCard logo={logo}>
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">{labels.signIn}</CardTitle>
                <CardDescription>{labels.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleLogin} className="w-full" size="lg">
                    <LogIn className="mr-2 h-4 w-4" />
                    {labels.button}
                </Button>
            </CardContent>
            <CardFooter className="justify-center text-center">
                <p className="text-xs text-muted-foreground">{labels.notice}</p>
            </CardFooter>
        </AuthCard>
    );
}
