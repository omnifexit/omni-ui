"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect } from "react";
import { LogIn } from "../icons";
import { toast } from "../toast";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

interface SsoLoginPageProps {
    /** The service's login route, like `/sales/sso/redirect`. */
    ssoPath: string;
    logo: StaticImageData;
    /** OmniAuth sent someone back because they have no access to this app. */
    isDenied?: boolean;
    labels: {
        signIn: string;
        description: string;
        button: string;
        notice: string;
        deniedTitle: string;
        deniedDescription: string;
    };
}

/** The page of every app that logs in through OmniAuth. */
export function SsoLoginPage({ ssoPath, logo, isDenied, labels }: SsoLoginPageProps) {
    useEffect(() => {
        if (isDenied) {
            toast.error(labels.deniedTitle, {
                id: "access-denied",
                description: labels.deniedDescription,
                duration: 5000,
            });
        }
    }, [isDenied, labels.deniedTitle, labels.deniedDescription]);

    const handleLogin = () => {
        // A full page navigation: this is the service's route, not a Next.js page.
        window.location.assign(new URL(ssoPath, window.location.origin).href);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted">
            <div className="absolute w-auto top-8 left-8">
                <Image
                    src={logo}
                    alt="OmnifexIT Logo"
                    height={28}
                    sizes="100vw"
                    priority
                    className="h-7 w-auto object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
            </div>

            <Card className="w-[400px]">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">{labels.signIn}</CardTitle>
                    <CardDescription>{labels.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleLogin} className="w-full" size="lg">
                        <LogIn className="mr-2 h-4 w-4" />
                        {labels.button}
                    </Button>
                </CardContent>
                <CardFooter className="flex flex-col text-center">
                    <p className="text-xs text-muted-foreground mt-4">{labels.notice}</p>
                </CardFooter>
            </Card>
        </div>
    );
}
