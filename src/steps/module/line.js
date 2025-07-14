function lineModule ($){
	$('td > table.line').each((_, table) => {
		const $table = $(table);
		const $outerTd = $table.closest('td');
		const $innerTd = $table.find('tr').first().find('td').first();

		if ($innerTd.length === 0) return;

		// Parse original styles
		const tableStyles = parseStyle($table.attr('style') || '');
		const outerTdStyles = parseStyle($outerTd.attr('style') || '');
		const innerTdStyles = parseStyle($innerTd.attr('style') || '');

		// --- Derive outer <td> styles
		const derivedOuterStyles = {
		'background-color': outerTdStyles['background-color'] || '#FFFFFF',
		'margin': '0 auto',
		'padding': innerTdStyles['padding'] || '0',
		'border': '0'
		};

		// --- Clean <table> styles
		const derivedTableStyles = {
		'background-color': tableStyles['background-color'] || '#FFFFFF',
		'width': tableStyles['width'] || '100%',
		'border-collapse': 'collapse',
		'border': '0'
		};

		// --- Inner <td> styles
		const derivedInnerTdStyles = {
		'background-color': innerTdStyles['background-color'] || '#FFFFFF',
		'margin': '0 auto',
		'padding': '0',
		'width': innerTdStyles['width'] || tableStyles['max-width'] || 'auto',
		'max-width': innerTdStyles['max-width'] || tableStyles['max-width'] || 'none'
		};

		// Derive border-top from original border
		const borderStyle = tableStyles['border'] || innerTdStyles['border'];
		if (borderStyle) {
		derivedInnerTdStyles['border-top'] = parseBorderTop(borderStyle);
		}

		// Apply styles and attributes
		$outerTd.attr('align', 'center');
		$outerTd.attr('style', styleToString(derivedOuterStyles));
		$table.attr('align', 'center');
		$table.attr('style', styleToString(derivedTableStyles));
		$innerTd.attr('align', 'center');
		$innerTd.attr('style', styleToString(derivedInnerTdStyles));

		// Ensure content
		if (!$innerTd.html().trim()) {
		$innerTd.html('&nbsp;');
		}
	});

	function parseStyle(styleStr) {
		const styles = {};
		styleStr.split(';').forEach(rule => {
		const [prop, val] = rule.split(':').map(s => s && s.trim());
		if (prop && val) styles[prop] = val;
		});
		return styles;
	}

	function styleToString(styles) {
		return Object.entries(styles).map(([k, v]) => `${k}: ${v}`).join('; ');
	}

	function parseBorderTop(borderValue) {
		// Converts `1px solid #F87844` or `1px #F87844` to `1px solid #F87844`
		if (!borderValue) return '1px solid #000';
		if (borderValue.includes('solid') || borderValue.includes('dashed') || borderValue.includes('dotted')) {
		return borderValue;
		}
		// Default to solid if only width/color given
		return `1px solid ${borderValue.split(' ').pop()}`;
	}
	  $("table.line").each((_, table) => {
    const $table = $(table);
    const $outerTd = $table.closest("td");

    if ($outerTd.length) {
      const style = $outerTd.attr("style") || "";
      const newStyle = style
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s && !s.toLowerCase().startsWith("width:"))
        .join("; ");

      $outerTd.attr("style", newStyle);
    }
  });
}
module.exports = {lineModule}