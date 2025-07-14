function removeCode($) {
	 $('table').each((_, table) => {
    const $table = $(table);
    const classAttr = $table.attr('class');
    if (!classAttr) return;

    const newClassList = classAttr
      .split(/\s+/)
      .filter(cls => !cls.startsWith('td-'));

    if (newClassList.length > 0) {
      $table.attr('class', newClassList.join(' '));
    } else {
      $table.removeAttr('class');
    }
  });
  $('tr').each((_, tr) => {
    const $tr = $(tr);
    const hasChildren = $tr.children().length > 0;
    const hasText = $tr.text().trim().length > 0;
    let hasComments = false;

    // Check for comment nodes inside this <tr>
    tr.childNodes.forEach(node => {
      if (node.type === 'comment') {
        hasComments = true;
      }
    });

    if (!hasChildren && !hasText && !hasComments) {
      $tr.remove();
    }
  });

	$('.row').removeClass('row');
	$('.column').removeClass('column');

	function removeEmptyClassAttr($el) {
		const classAttr = $el.attr("class");
		if (!classAttr || !classAttr.trim()) {
			$el.removeAttr("class");
		}
	}

	$("table, td").each((_, el) => {
		removeEmptyClassAttr($(el));
	});
	$("td").each((_, td) => {
		const $td = $(td);
		const siblings = $td.siblings("td");

		if (siblings.length === 0) {
		// Check width="100%" or style="width:100%"
		const widthAttr = $td.attr("width")?.trim();
		const style = $td.attr("style") || "";

		const has100Width =
			widthAttr === "100%" || /width\s*:\s*100%/.test(style);

		if (has100Width) {
			// Find parent table
			const $table = $td.closest("table");

			let tableWidth =
			$table.attr("width") ||
			/width\s*:\s*(\d+)(px)?/.exec($table.attr("style") || "")?.[1];

			if (tableWidth) {
			// Sanitize
			tableWidth = tableWidth.replace(/[^0-9]/g, "");

			// Apply max-width
			const newStyle = style.replace(/max-width\s*:\s*[^;]+;?/g, "").trim();
			$td.attr("style", `${newStyle}; max-width: ${tableWidth}px;`.trim());
			}
		}
		}
	});

    $("tr").attr(
    "style",
    "padding: 0px; margin: 0px; border-spacing: 0; font-size:0; mso-line-height-alt:0; mso-margin-top-alt:1px;"
  );
}
module.exports = {removeCode};