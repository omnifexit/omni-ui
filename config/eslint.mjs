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
                    patterns: [
                        {
                            group: ["@/components/ui/*"],
                            message: "Import components from @omnifexit/omni-ui, or add the missing one there.",
                        },
                    ],
                },
            ],
            // Add a rule here only once its pattern is gone from every app, so it never blocks unrelated work.
            // A real exception gets an eslint-disable comment with the reason.
            "no-restricted-syntax": [
                "error",
                {
                    selector: "Literal[value=/text-\\[[0-9.]+(px|rem)\\]/]",
                    message: "Use text-2xs, text-xs or another size from the theme.",
                },
                {
                    selector: "TemplateElement[value.raw=/text-\\[[0-9.]+(px|rem)\\]/]",
                    message: "Use text-2xs, text-xs or another size from the theme.",
                },
                {
                    selector: "JSXOpeningElement[name.name='Label'] > JSXAttribute[name.name='className']",
                    message: "Label has one look. Put layout classes on the element around it.",
                },
                {
                    selector: "JSXOpeningElement[name.name='Table']",
                    message: "Use DataTable.",
                },
                {
                    selector: "JSXOpeningElement[name.name='DialogContent']",
                    message: "Forms get their own page. Short confirmations use ConfirmDialog.",
                },
            ],
        },
    },
];

export default config;
