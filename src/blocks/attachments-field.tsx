"use client";

import { useRef, type ChangeEvent, type ReactNode } from "react";
import { File as FileIcon, Paperclip, X } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

interface AttachmentsFieldProps {
    label: ReactNode;
    addLabel: ReactNode;
    /** Read out by screen readers on each remove button. */
    removeLabel: string;
    /** Files saved earlier. */
    existing?: { id: number; file_name: string }[];
    onRemoveExisting?: (id: number) => void;
    /** Files picked now, not saved yet. */
    files: File[];
    onRemoveFile: (index: number) => void;
    onAdd: (event: ChangeEvent<HTMLInputElement>) => void;
}

function Attachment({
    name,
    size,
    removeLabel,
    onRemove,
}: {
    name: string;
    size?: number;
    removeLabel: string;
    onRemove: () => void;
}) {
    return (
        <div className="flex h-10 min-w-0 flex-[1_1_16rem] items-center gap-2 rounded-md border border-border bg-muted/50 pr-1 pl-3">
            <FileIcon className="size-4 shrink-0 text-primary" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{name}</span>
            {size !== undefined && (
                <span className="shrink-0 text-xs text-muted-foreground">{(size / 1024).toFixed(1)} KB</span>
            )}
            <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={removeLabel}
                onClick={onRemove}
                className="size-8 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
                <X className="size-4" />
            </Button>
        </div>
    );
}

export function AttachmentsField({
    label,
    addLabel,
    removeLabel,
    existing,
    onRemoveExisting,
    files,
    onRemoveFile,
    onAdd,
}: AttachmentsFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div data-wide className="grid gap-2">
            <Label>{label}</Label>
            <div className="flex flex-wrap gap-3">
                {existing?.map((media) => (
                    <Attachment
                        key={media.id}
                        name={media.file_name}
                        removeLabel={removeLabel}
                        onRemove={() => onRemoveExisting?.(media.id)}
                    />
                ))}
                {files.map((file, index) => (
                    <Attachment
                        key={index}
                        name={file.name}
                        size={file.size}
                        removeLabel={removeLabel}
                        onRemove={() => onRemoveFile(index)}
                    />
                ))}
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex h-10 min-w-0 flex-[1_1_16rem] items-center justify-center gap-2 rounded-md border border-dashed border-border text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:bg-muted/50 hover:text-primary"
                >
                    <Paperclip className="size-4" />
                    {addLabel}
                </button>
                <input type="file" multiple className="hidden" ref={inputRef} onChange={onAdd} />
            </div>
        </div>
    );
}
