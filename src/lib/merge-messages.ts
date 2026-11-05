type Messages = { [key: string]: string | Messages };

/** Combines OmniUI's shared translations with an app's own. The app's own win. */
export function mergeMessages(shared: Messages, own: Messages): Messages {
    const merged: Messages = { ...shared };

    for (const [key, value] of Object.entries(own)) {
        const base = merged[key];
        merged[key] = typeof value === "object" && typeof base === "object" ? mergeMessages(base, value) : value;
    }

    return merged;
}
