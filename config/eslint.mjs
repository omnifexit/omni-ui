import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
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

export default config;
