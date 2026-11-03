import assert from "node:assert/strict";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import ts from "typescript6";

const root = resolve(import.meta.dirname, "..");
const config = ts.readConfigFile(resolve(root, "tsconfig.json"), ts.sys.readFile);
const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const visited = new Set<string>();
const forbiddenFiles = new Set([
	resolve(root, "src/components/QuestionCard.tsx"),
	resolve(root, "src/lib/markdown.tsx"),
	resolve(root, "src/lib/MarkdownSyntaxHighlighter.tsx"),
]);

function checkStaticImports(file: string, chain: string[]) {
	if (visited.has(file)) return;
	visited.add(file);
	assert(!forbiddenFiles.has(file), `Loading view imports question rendering: ${chain.join(" → ")}`);
	const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
	for (const statement of source.statements) {
		if (!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement)) continue;
		if (!statement.moduleSpecifier || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
		if (ts.isImportDeclaration(statement)) {
			const clause = statement.importClause;
			if (clause?.isTypeOnly) continue;
			if (clause && !clause.name && clause.namedBindings && ts.isNamedImports(clause.namedBindings) && clause.namedBindings.elements.length > 0 && clause.namedBindings.elements.every((element) => element.isTypeOnly)) continue;
		} else {
			if (statement.isTypeOnly) continue;
			if (statement.exportClause && ts.isNamedExports(statement.exportClause) && statement.exportClause.elements.length > 0 && statement.exportClause.elements.every((element) => element.isTypeOnly)) continue;
		}
		const name = statement.moduleSpecifier.text;
		assert(!/^(react-markdown|remark-|rehype-|katex|react-syntax-highlighter|refractor)/.test(name), `Loading view imports ${name}: ${chain.join(" → ")}`);
		const resolved = ts.resolveModuleName(name, file, options, ts.sys).resolvedModule;
		if (resolved && !resolved.isExternalLibraryImport && /\.[cm]?tsx?$/.test(resolved.resolvedFileName)) {
			checkStaticImports(resolved.resolvedFileName, [...chain, name]);
		}
	}
}

checkStaticImports(resolve(root, "src/routes/$lang.$subjectId_.practice_.$topic.tsx"), ["practice route"]);
console.log(`Loading view has no eager question/Markdown dependencies (${visited.size} local modules checked).`);

const { createElement } = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const { I18nContext } = await import("../src/i18n/context-value");
const { es } = await import("../src/i18n/es");
const { default: SimulatorPreview } = await import("../src/components/SimulatorPreview");
const render = (questionType: import("../src/data/types").QuestionType) => renderToStaticMarkup(
	createElement(I18nContext.Provider, { value: { t: es, lang: "es", setLang: async () => {} } },
		createElement(SimulatorPreview, { questionType, optionCount: 5, textPartCount: 3 })),
);

for (const type of ["mc", "text", "multiple-text", "fill", "table-fill", "matching"] as const) {
	const html = render(type);
	assert(html.includes(`data-question-type="${type}"`));
	assert(html.includes('aria-hidden="true"'));
	assert(!/<(button|input|textarea|select|a)(\s|>)/.test(html), `${type}: loading placeholders must be inert`);
	switch (type) {
		case "mc": assert.equal(html.match(/data-loading-option=/g)?.length, 5); break;
		case "multiple-text": assert.equal(html.match(/data-loading-part=/g)?.length, 3); break;
		case "text": assert(html.includes("height:120px")); break;
		case "fill": assert.equal(html.match(/height:34px/g)?.length, 2); break;
		case "table-fill": assert.equal(html.match(/<td /g)?.length, 6); break;
		case "matching": assert.equal(html.match(/height:36px/g)?.length, 9); break;
	}
}
console.log("All six loading views render without question code; option and part counts are preserved.");
