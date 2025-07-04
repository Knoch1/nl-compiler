const css = require('css');

function compactCssStringify(ast) {
	const lines = [];
	let lineCount = 0;

	for (const rule of ast.stylesheet.rules) {
		if (rule.type === 'rule') {
			const decls = rule.declarations
				.filter(d => d.type === 'declaration')
				.map(d => {
					const val = d.value.trim();
					const finalVal = lineCount < 21
						? val
						: val.endsWith('!important')
							? val
							: val + ' !important';
					return `${d.property}: ${finalVal};`;
				})
				.join(' ');

			lines.push(`\t${rule.selectors.join(', ')} {${decls}}`);
			lineCount++;
		}

		if (rule.type === 'media') {
			lines.push(`\t@media ${rule.media} {`);

			for (const nested of rule.rules) {
				if (nested.type === 'rule') {
					const decls = nested.declarations
						.filter(d => d.type === 'declaration')
						.map(d => {
							const val = d.value.trim();
							const finalVal = lineCount < 21
								? val
								: val.endsWith('!important')
									? val
									: val + ' !important';
							return `${d.property}: ${finalVal};`;
						})
						.join(' ');

					lines.push(`\t  ${nested.selectors.join(', ')} {${decls}}`);
					lineCount++;
				}
			}

			lines.push('\t}');
		}
	}

	return lines.join('\n');
}

function formatInlineCss(html) {
	return html.replace(/<style[^>]*type="text\/css"[^>]*>([\s\S]*?)<\/style>/g, (match, rawCss) => {
		try {
			const parsed = css.parse(rawCss, { silent: true });
			const compact = compactCssStringify(parsed);
			return `<style type="text/css">\n${compact.trim()}\n</style>`;
		} catch (e) {
			console.warn('CSS parse error:', e);
			return match; // fallback to original
		}
	});
}
module.exports = {
	formatInlineCss
};