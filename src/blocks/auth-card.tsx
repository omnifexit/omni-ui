import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";
import { Card } from "../ui/card";

interface AuthCardProps {
    logo: StaticImageData;
    /** For something that needs the room, like a QR code with instructions. */
    wide?: boolean;
    children: ReactNode;
}

/** The centred card with the logo on every login and account page, on any screen. */
export function AuthCard({ logo, wide, children }: AuthCardProps) {
    return (
        <div className="flex min-h-svh w-full items-center justify-center bg-background p-4 sm:bg-muted/40">
            <Card className={cn("w-full gap-5 py-8 shadow-lg", wide ? "max-w-2xl" : "max-w-md")}>
                <Image src={logo} alt="OmnifexIT" priority className="mx-auto h-14 w-auto object-contain" />
                {children}
            </Card>
        </div>
    );
}
