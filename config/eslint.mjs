// The shared rules. Each app adds these after its own eslint-config-next, so that ESLint and
// everything it pulls in stay development-only dependencies of the app.
const config = [
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
