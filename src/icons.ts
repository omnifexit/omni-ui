import {
    Activity,
    Bot,
    Box,
    Brain,
    Briefcase,
    Database,
    FileSignature,
    HardDrive,
    KeyRound,
    LayoutDashboard,
    LifeBuoy,
    Mail,
    Receipt,
    Server,
    Shield,
    Sparkles,
    Target,
    Workflow,
    Wrench,
    type LucideIcon,
} from "lucide-react";

export * from "lucide-react";

// Icons that are stored by name, like the ones for apps and tools.
const ICON_MAP: Record<string, LucideIcon> = {
    activity: Activity,
    aiweb: Sparkles,
    bot: Bot,
    box: Box,
    brain: Brain,
    briefcase: Briefcase,
    database: Database,
    "file-signature": FileSignature,
    "hard-drive": HardDrive,
    "key-round": KeyRound,
    "layout-dashboard": LayoutDashboard,
    "life-buoy": LifeBuoy,
    mail: Mail,
    receipt: Receipt,
    server: Server,
    shield: Shield,
    sparkles: Sparkles,
    storage: HardDrive,
    target: Target,
    workflow: Workflow,
    wrench: Wrench,
};

export function getIconByName(iconName?: string | null): LucideIcon {
    if (!iconName) return LayoutDashboard;
    const key = iconName.toLowerCase().trim();
    return ICON_MAP[key] || Box;
}
