# OmniUI

Shared UI for the OmnifexIT dashboards: the theme, the shadcn components and the icon and toast re-exports.

Each dashboard installs a Git tag and compiles the source itself:

```json
"@omnifexit/omni-ui": "github:omnifexit/omni-ui#v0.1.0"
```

```ts
// next.config.ts
transpilePackages: ["@omnifexit/omni-ui"];
```

```css
/* globals.css */
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@omnifexit/omni-ui/theme.css";
@source "../node_modules/@omnifexit/omni-ui/src";
```

```tsx
import { Button } from "@omnifexit/omni-ui/ui/button";
import { Trash2 } from "@omnifexit/omni-ui/icons";
import { toast } from "@omnifexit/omni-ui/toast";
```

To update: change this repo, push and tag, then run `pnpm update @omnifexit/omni-ui` in each dashboard on your own machine (it needs `git`).
