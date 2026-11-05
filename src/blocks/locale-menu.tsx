"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "../icons";
import { DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "../ui/dropdown-menu";

const LOCALES = ["en", "nl"] as const;

/** The language choice, as items inside an existing dropdown. */
export function LocaleMenu({ locale, labels }: { locale: string; labels: Record<(typeof LOCALES)[number], string> }) {
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (newLocale: string) => {
        const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newPath);
        router.refresh();
    };

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger className="rounded-lg text-sm flex items-center gap-2 p-2.5">
                <Globe className="h-4 w-4" />
                <span>{labels[locale as (typeof LOCALES)[number]]}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="min-w-[140px]">
                {LOCALES.map((loc) => (
                    <DropdownMenuItem
                        key={loc}
                        onClick={() => switchLocale(loc)}
                        className={loc === locale ? "font-semibold bg-accent" : ""}
                    >
                        {labels[loc]}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    );
}
