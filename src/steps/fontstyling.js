function applyInheritedTextStyles($) {
	const TEXT_TAGS = ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'];
	const STYLE_PROPS = ['font-size', 'font-family', 'line-height', 'font-weight', 'color'];

	$('td').each((_, td) => {
		const $td = $(td);
		const tdStyleAttr = $td.attr('style') || '';

		// Extract styles from the td
		const tdStyles = tdStyleAttr
		.split(';')
		.map(s => s.trim())
		.filter(Boolean)
		.reduce((acc, rule) => {
			const [prop, value] = rule.split(':').map(p => p.trim());
			if (STYLE_PROPS.includes(prop)) {
			acc[prop] = value;
			}
			return acc;
		}, {});

		// Apply to each direct child if not already set
		$td.children(TEXT_TAGS.join(',')).each((_, child) => {
		const $child = $(child);
		const childStyleAttr = $child.attr('style') || '';

		// Convert child's style to a map
		const childStyles = childStyleAttr
			.split(';')
			.map(s => s.trim())
			.filter(Boolean)
			.reduce((acc, rule) => {
			const [prop, value] = rule.split(':').map(p => p.trim());
			acc[prop] = value;
			return acc;
			}, {});

		// Merge in td styles, but only if not already defined on child
		for (const prop of STYLE_PROPS) {
			if (!(prop in childStyles) && prop in tdStyles) {
			childStyles[prop] = tdStyles[prop];
			}
		}

		// Write new style back to child
		const newStyle = Object.entries(childStyles)
			.map(([k, v]) => `${k}: ${v}`)
			.join('; ');
		$child.attr('style', newStyle);
		});
	});

	$(TEXT_TAGS.join(',')).each((_, el) => {
		const $el = $(el);
		const styleAttr = $el.attr('style') || '';

		// Only add if not already present
		if (!/mso-line-height-rule\s*:\s*exactly/i.test(styleAttr)) {
		const newStyle = styleAttr.trim().replace(/;?$/, ';') + ' mso-line-height-rule:exactly;';
		$el.attr('style', newStyle.trim());
		}
	});
}
module.exports = {applyInheritedTextStyles};