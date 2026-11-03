import type { ReactNode } from "react";

// The filters next to a search box. On phones they sit two per row, and an odd last
// one fills its row. From the sm breakpoint they act as direct children of the row
// around them, so the page decides their spacing and each filter its own width.
export function FilterGroup({ children }: { children: ReactNode }) {
    return (
        <div className="grid grid-cols-2 gap-2 empty:hidden sm:contents [&>*]:min-w-0 [&>*:last-child:nth-child(odd)]:col-span-2">
            {children}
        </div>
    );
}
