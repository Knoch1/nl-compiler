
function buttonModule ($, Dhref){
 	$('table.button').each((_, table) => {
		const $table = $(table);
		const $parentTd = $table.closest('td');
		const $innerTd = $table.find('tr > td').first();

		if (!$parentTd.length || !$innerTd.length) return;

		// Extract styles and attributes
		const tableStyles = parseStyle($table.attr('style') || '');
		const tdStyles = parseStyle($innerTd.attr('style') || '');

		const href = $table.attr('href') || Dhref;
		const title = $table.attr('title') || $innerTd.text().trim();
		const buttonText = $innerTd.text().trim();

		const backgroundColor = tableStyles['background-color'];
		const border = tableStyles['border']||`1px solid ${backgroundColor}`;
		const fontSize = tdStyles['font-size'];
		const fontFamily = tdStyles['font-family'];
		const color = tdStyles['color'];
		const height = tdStyles['height'];
		const textAlign = tdStyles['text-align'];
		const padding = tdStyles['padding'];

		const borderRadius = tableStyles['border-radius'] || '0px';
		const borderCollapse = borderRadius ? 'separate' : 'collapse';
		const borderRadiusStyle = borderRadius ? `border-radius: ${borderRadius};` : '';

		// Calculate adjusted padding if border exists
		let adjustedPadding = padding;
		if (padding && !tableStyles['border']) {
		const matchBorder = border.match(/^(\d+)px/);
		const borderWidth = matchBorder ? parseInt(matchBorder[1], 10) : 0;

		const parts = padding.split(/\s+/).map(p => parseInt(p));

		// Normalize padding to 4 parts: [top, right, bottom, left]
		let [top, right, bottom, left] = (() => {
			if (parts.length === 1) return [parts[0], parts[0], parts[0], parts[0]];
			if (parts.length === 2) return [parts[0], parts[1], parts[0], parts[1]];
			if (parts.length === 3) return [parts[0], parts[1], parts[2], parts[1]];
			return parts;
		})();

		// Adjust each side
		top = Math.max(0, top - borderWidth);
		right = Math.max(0, right - borderWidth);
		bottom = Math.max(0, bottom - borderWidth);
		left = Math.max(0, left - borderWidth);

		adjustedPadding = `${top}px ${right}px ${bottom}px ${left}px`;
		}

		// Build the full replacement <td>
		const replacement = `
		<td style="margin: 0 auto; text-align: ${textAlign};">
		<table class="button" border="0" cellpadding="0" cellspacing="0" style="display: inline-table; margin: 0 auto; padding: 0; border-collapse: collapse; border: 0; text-align: ${textAlign};">
			<tr style="padding: 0; margin: 0; border-spacing: 0; font-size: 0; mso-line-height-alt: 0; mso-margin-top-alt: 1px;">
			<td style="padding: 0; margin: 0 auto; text-align: ${textAlign};">
				<table align="${textAlign}" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0 auto; background-color: ${backgroundColor}; border-collapse: ${borderCollapse}; border: ${border}; ${borderRadiusStyle}">
				<tr style="padding: 0; margin: 0; border-spacing: 0; font-size: 0; mso-line-height-alt: 0; mso-margin-top-alt: 1px;">
					<td align="${textAlign}" style="height: ${height}; mso-line-height-rule: exactly; line-height: ${height}; font-size: ${fontSize}; padding: ${adjustedPadding}; margin: 0 auto; color: ${color}; text-decoration: none; text-align: ${textAlign}; background-color: ${backgroundColor}; border: ${border}; ${borderRadiusStyle}">
					<p style="font-size: ${fontSize}; mso-line-height-rule: exactly; line-height: ${height}; color: ${color}; font-family: ${fontFamily}; margin: 0; padding: 0; text-align: center;">
						<!--#text_line#-->
						<a class="more" href="${href}" style="width: 100%; height: auto; min-height: ${height}; font-size: ${fontSize}; mso-line-height-rule: exactly; line-height: ${height}; color: ${color}; font-family: ${fontFamily}; font-weight: 400; text-decoration: none; display: block;" target="_blank" title="${title}">
						<span style="font-size: ${fontSize}; color: ${color}; text-decoration: none;">${buttonText}</span>
						</a>
						<!--#/text_line#-->
					</p>
					</td>
				</tr>
				</table>
			</td>
			</tr>
		</table>
		</td>`;

		$parentTd.replaceWith(replacement);
	});
	function parseStyle(styleStr) {
		const styles = {};
		styleStr.split(';').forEach(rule => {
			const [prop, val] = rule.split(':').map(s => s && s.trim());
			if (prop && val) styles[prop] = val;
		});
		return styles;
	}

}
module.exports = {buttonModule};
