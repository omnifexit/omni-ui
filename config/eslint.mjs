import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default [
    ...nextVitals,
    ...nextTs,
    {
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        { name: "lucide-react", message: "Import icons from @omnifexit/omni-ui/icons." },
                        { name: "sonner", message: "Import toast from @omnifexit/omni-ui/toast." },
                    ],
                },
            ],
        },
    },
];
