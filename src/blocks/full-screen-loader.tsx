import { Loader2 } from "../icons";

interface FullScreenLoaderProps {
    message?: string;
}

export function FullScreenLoader({ message = "Loading..." }: FullScreenLoaderProps) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center p-8 bg-background relative z-50">
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium animate-pulse">{message}</p>
            </div>
        </div>
    );
}
