#!/usr/bin/env node
// Removes classes that only repeat what an OmniUI component already does by default.
//
//   node scripts/remove-default-overrides.mjs <dashboard folder>          list what would change
//   node scripts/remove-default-overrides.mjs <dashboard folder> --write  change the files, then run the app's Prettier
//
// Only plain className="..." strings on elements imported from OmniUI are touched. A class goes only when
// tailwind-merge gives the same result without it, so an override like "text-xs text-sm" is left alone.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { twMerge } from "tailwind-merge";
import ts from "typescript";

// Keep in step with the components in src/ui.
const DEFAULTS = {
    Label: { from: "ui/label", classes: "text-sm font-semibold text-foreground" },
    Input: { from: "ui/input", classes: "h-10 w-full" },
    SelectTrigger: { from: "ui/select", classes: "h-10 w-full bg-card shadow-sm", plainSizeOnly: true },
    Button: { from: "ui/button", classes: "font-semibold" },
    TableHead: { from: "ui/table", classes: "h-11 font-semibold text-foreground" },
    Card: { from: "ui/card", classes: "overflow-hidden rounded-xl border border-border bg-card shadow-sm" },
};
// Only true for a Button with no size set.
const BUTTON_DEFAULT_SIZE = "h-10 text-sm gap-2";

const [folder, flag] = process.argv.slice(2);
if (!folder) {
    console.error("Usage: remove-default-overrides.mjs <dashboard folder> [--write]");
    process.exit(1);
}

const sameClasses = (a, b) => [...a.split(" ")].sort().join(" ") === [...b.split(" ")].sort().join(" ");

function withoutDefaults(value, defaults) {
    let tokens = value.trim().split(/\s+/);
    for (const token of defaults.split(" ")) {
        const without = tokens.filter((other) => other !== token);
        if (without.length === tokens.length) continue;
        if (sameClasses(twMerge(defaults, tokens.join(" ")), twMerge(defaults, without.join(" ")))) tokens = without;
    }
    return tokens.join(" ");
}

function omniUiImports(file) {
    const names = new Map();
    for (const statement of file.statements) {
        if (!ts.isImportDeclaration(statement)) continue;
        const match = statement.moduleSpecifier.text.match(/^@omnifexit\/omni-ui\/(.+)$/);
        const bindings = statement.importClause?.namedBindings;
        if (!match || !bindings || !ts.isNamedImports(bindings)) continue;
        for (const element of bindings.elements) {
            names.set(element.name.text, { name: (element.propertyName ?? element.name).text, from: match[1] });
        }
    }
    return names;
}

function edits(file) {
    const imported = omniUiImports(file);
    const found = [];

    const visit = (node) => {
        if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
            const source = imported.get(node.tagName.getText(file));
            const known = source && DEFAULTS[source.name];

            if (known && known.from === source.from) {
                const attributes = node.attributes.properties;
                const attribute = (name) =>
                    attributes.find((a) => ts.isJsxAttribute(a) && a.name.getText(file) === name);
                const className = attribute("className");
                const value = className?.initializer;
                const hasSize = Boolean(attribute("size"));
                const spreads = attributes.some((a) => ts.isJsxSpreadAttribute(a));

                if (value && ts.isStringLiteral(value) && !spreads && !(known.plainSizeOnly && hasSize)) {
                    const defaults =
                        source.name === "Button" && !hasSize
                            ? `${known.classes} ${BUTTON_DEFAULT_SIZE}`
                            : known.classes;
                    const next = withoutDefaults(value.text, defaults);
                    if (next !== value.text.trim()) {
                        found.push({ node: className, value: next, tag: source.name, before: value.text });
                    }
                }
            }
        }
        ts.forEachChild(node, visit);
    };
    visit(file);
    return found;
}

function* tsxFiles(dir) {
    for (const name of readdirSync(dir)) {
        if (["node_modules", ".next", "dist", "build"].includes(name)) continue;
        const path = join(dir, name);
        if (statSync(path).isDirectory()) yield* tsxFiles(path);
        else if (path.endsWith(".tsx")) yield path;
    }
}

const totals = {};
let changedFiles = 0;

for (const path of tsxFiles(folder)) {
    const text = readFileSync(path, "utf8");
    const file = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const found = edits(file);
    if (!found.length) continue;

    changedFiles++;
    let output = text;
    // From the end of the file, so earlier positions stay right.
    for (const { node, value, tag } of found.sort((a, b) => b.node.getStart(file) - a.node.getStart(file))) {
        totals[tag] = (totals[tag] ?? 0) + 1;
        const start = node.getStart(file);
        const end = node.getEnd();
        if (value) {
            output = `${output.slice(0, start)}className="${value}"${output.slice(end)}`;
        } else {
            // No classes left: take the attribute and the space in front of it away.
            const before = output.slice(0, start).replace(/\s+$/, "");
            output = before + output.slice(end);
        }
    }
    if (flag === "--write") writeFileSync(path, output);
}

console.log(`${flag === "--write" ? "Changed" : "Would change"} ${changedFiles} files:`, totals);
