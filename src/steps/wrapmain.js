function wrapMainTables($, width) {
	const mainTable = $('table.main').first();
	if (mainTable.length === 0) return;
	mainTable.before('<!--#loop#-->\n<!--#/loop#-->');
	
	const td = mainTable.find('tr > td').first();
	if (td.length === 0) return;

	td.children('table').each((i, table) => {
		const $table = $(table);
		const $wrapper = $(`<div style="width: 100%; max-width: ${width}; margin: 0 auto;"></div>`);
		
		// Clone the table to preserve it before moving
		const $cloned = $table.clone();
		
		// Replace original table with wrapper
		$table.replaceWith($wrapper);
		
		// Append cloned table inside wrapper
		$wrapper.append($cloned);
	});
	const content = td.contents();
	mainTable.replaceWith(content);
}

module.exports ={wrapMainTables};