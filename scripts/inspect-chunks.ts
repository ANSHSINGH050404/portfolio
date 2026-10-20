import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

export {};

/**
 * Reports what is inside each built chunk, so code-splitting can be judged
 * by what actually moved rather than by guesswork.
 *
 * Usage: bun scripts/inspect-chunks.ts [chunksDir]
 */
const dir = process.argv[2] ?? ".next/static/chunks";

interface Info {
	name: string;
	size: number;
	marks: string[];
}

const MARKERS: [string, RegExp][] = [
	["react-dom", /react-dom|ReactDOM|__SECRET_INTERNALS/],
	["react", /react\.production|react\.development/],
	["next-router", /next\/router|next\/navigation/],
	["next-shim", /next\/dist\/client/],
	["databuddy", /databuddy/i],
	["cuelume", /cuelume/i],
	["sfx", /createOscillator|GainNode|AudioContext/],
	["slot-title", /slot-cell|slot-strip|REEL_REPEATS/],
	["terminal", /term-overlay|term-ps1|command not found/],
	["command-palette", /cmd-overlay|cmd-item|useCommandPaletteHotkey/],
	["headline-smoke", /headline-smoke/],
	["vhs", /vhs-burst/],
	["github-api", /api.github.com/],
];

const files = readdirSync(dir)
	.map((f) => join(dir, f))
	.filter((f) => f.endsWith(".js") && statSync(f).isFile());

const results: Info[] = files.map((f) => {
	const body = readFileSync(f, "utf8");
	const marks: string[] = [];
	for (const [label, re] of MARKERS) {
		if (re.test(body)) marks.push(label);
	}
	return { name: f.split(/[\\/]/).pop() ?? f, size: body.length, marks };
});

console.log("=== chunks by size (uncompressed source bytes) ===");
for (const r of results.sort((a, b) => b.size - a.size)) {
	console.log(
		`  ${(r.size / 1024).toFixed(1).padStart(8)} KB  ${r.name.padEnd(28)} ${r.marks.join(", ")}`,
	);
}
