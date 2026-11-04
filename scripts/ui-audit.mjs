#!/usr/bin/env node
// Prints how often each UI pattern is hand-written per app, and how many different versions of it exist.
//
//   node scripts/ui-audit.mjs [dashboard folders]     defaults to the apps next to this repo
//
// It only reports. The numbers should fall over time; the lint rules in config/eslint.mjs stop them coming back.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..", "..");
const defaults = ["OmniSales", "OmniDesk", "OmniAuth", "OmniTemplate-App"].map((app) => join(root, app, "dashboard"));
const folders = process.argv.length > 2 ? process.argv.slice(2).map((dir) => resolve(dir)) : defaults;

const tag = (name) => new RegExp(`<${name}\\b(?:[^>"{]|"[^"]*"|\\{[^}]*\\})*`, "g");
const patterns = {
    "Bordered box as a plain div": /<div\b[^>]*?className="([^"]*\bborder\b[^"]*\brounded[^"]*)"/g,
    "<Card>": tag("Card"),
    "<CardTitle>": tag("CardTitle"),
    "<Button>": tag("Button"),
    "<Badge>": tag("Badge"),
    "<Label> with its own classes": /<Label\b[^>]*?className="([^"]*)"/g,
    "Headings (h1-h4)": /<h[1-4]\b[^>]*?className="([^"]*)"/g,
    "<Table> by hand": tag("Table"),
    "<TableHead>": tag("TableHead"),
    "Modals (DialogContent)": tag("DialogContent"),
    "Raw colours":
        /\b((?:text|bg|border)-(?:red|green|blue|yellow|orange|amber|emerald|rose|purple|pink|indigo|slate|gray|zinc|sky|teal|violet|lime|cyan|fuchsia)-\d{2,3})\b/g,
    "Hand-set font sizes": /\b(text-\[[0-9.]+(?:px|rem)\])/g,
};

function sourceFiles(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) return entry.name === "ui" ? [] : sourceFiles(path);
        return entry.name.endsWith(".tsx") ? [path] : [];
    });
}

const apps = folders.filter(existsSync).map((folder) => {
    const files = ["app", "components"].filter((dir) => existsSync(join(folder, dir)));
    const text = files.flatMap((dir) => sourceFiles(join(folder, dir))).map((file) => readFileSync(file, "utf8"));
    return { name: basename(dirname(folder)), text: text.join("\n") };
});

const rows = Object.entries(patterns).map(([label, pattern]) => {
    const versions = new Set();
    const counts = apps.map((app) => {
        const matches = [...app.text.matchAll(pattern)];
        matches.forEach((match) => versions.add(match[1] ?? match[0].match(/className="([^"]*)"/)?.[1] ?? ""));
        return matches.length;
    });
    return [label, ...counts, counts.reduce((sum, count) => sum + count, 0), versions.size];
});

const table = [["Pattern", ...apps.map((app) => app.name), "Total", "Versions"], ...rows].map((row) => row.map(String));
const widths = table[0].map((_, column) => Math.max(...table.map((row) => row[column].length)));
for (const row of table) {
    console.log(
        row.map((cell, column) => (column ? cell.padStart(widths[column]) : cell.padEnd(widths[column]))).join("  "),
    );
}
