function temp($) {

      $('.row').removeClass('row');
  $('.column').removeClass('column');
  function removeEmptyClassAttr($el) {
    const classAttr = $el.attr('class');
    if (!classAttr || !classAttr.trim()) {
      $el.removeAttr('class');
    }
  }

  $('table, td').each((_, el) => {
    removeEmptyClassAttr($(el));
  });

  $("tr").attr(
    "style",
    "padding: 0px; margin: 0px; border-spacing: 0; font-size:0; mso-line-height-alt:0; mso-margin-top-alt:1px;"
  );
  $('td').each((_, td) => {
    const $td = $(td);
    const siblings = $td.siblings('td');

    if (siblings.length === 0) {
      // Check width="100%" or style="width:100%"
      const widthAttr = $td.attr('width')?.trim();
      const style = $td.attr('style') || '';

      const has100Width = widthAttr === '100%' || /width\s*:\s*100%/.test(style);

      if (has100Width) {
        // Find parent table
        const $table = $td.closest('table');

        let tableWidth =
          $table.attr('width') ||
          (/width\s*:\s*(\d+)(px)?/.exec($table.attr('style') || '')?.[1]);

        if (tableWidth) {
          // Sanitize
          tableWidth = tableWidth.replace(/[^0-9]/g, '');

          // Apply max-width
          const newStyle = style.replace(/max-width\s*:\s*[^;]+;?/g, '').trim();
          $td.attr('style', `${newStyle}; max-width: ${tableWidth}px;`.trim());
        }
      }
    }

    
  });
  // function injectCssRulesIfNotExists() {
  //     const rules = [
  //       'body, table, td {background-color: #FFFFFF;}',
	// 	    'body table br[data-mce-bogus="1"] {display: block !important;}',
	// 	    'h1 {text-align:center; font-weight:500; margin: 0; padding: 0; letter-spacing:0px;}',
	// 	    'h2 {text-align:center; font-weight:bold; margin: 0; padding: 0; letter-spacing:0px;}',
	// 	    'h3 {text-align:center; font-weight:bold; margin: 0; padding: 0; letter-spacing:0px;}',
	// 	    'h4 {text-align:center; font-weight:bold; margin: 0; padding: 0; letter-spacing:0px;}',
  //       'p {text-align:center; font-weight: normal; margin: 0; padding: 0; }',
  //       'a:link, a:visited, a:hover, a:active {text-decoration: none; }',
  //       'a, td, p {text-decoration: none;}',
  //       'ul {margin-top:0px; margin-bottom:0px; margin-left:20px;}',
  //       'li {font-weight:normal; font-family:Tahoma, sans-serif; font-size:14px; line-height:20px;}',
  //       'table {border-spacing: 0;}',
  //       'table, td, tr, p {text-decoration: none;}',
  //       'img {line-height: 0px; display: block;}',
  //       'a[x-apple-data-detectors] { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; }'
  //     ];

  //     if ($('head').length === 0) {
  //       $('html').prepend('<head></head>');
  //     }
  //     let $style = $('head style[type="text/css"]');

  //     // If no style element exists, create one
  //     if ($style.length === 0) {
  //       $('head').append('<style type="text/css"></style>');
  //       $style = $('head style[type="text/css"]');
  //     }

  //     const styleContent = $style.html() || '';
  //     const existingSelectors = new Set();

  //     // Extract existing selectors (basic way)
  //     styleContent.replace(/([^\{\}]+)\{/g, (_, selector) => {
  //       existingSelectors.add(selector.trim());
  //       return '';
  //     });

  //     const newRules = [];

  //     for (const rule of rules) {
  //       const match = rule.match(/^([^{]+)\{([^}]+)\}$/);
  //       if (!match) continue; // skip invalid

  //       const selector = match[1].trim();
  //       let declarations = match[2].trim();

  //       if (existingSelectors.has(selector)) continue;

  //       // Add !important to all declarations
  //       declarations = declarations
  //         .split(';')
  //         .map(d => {
  //           const [prop, value] = d.split(':').map(s => s?.trim());
  //           if (!prop || !value) return null;
  //           return `${prop}: ${value.replace(/!important$/, '').trim()} !important`;
  //         })
  //         .filter(Boolean)
  //         .join('; ');

  //       newRules.push(`${selector} { ${declarations}; }`);
  //     }

  //     if (newRules.length > 0) {
  //       const updatedContent = styleContent.trim() + '\n' + newRules.join('\n') + '\n';
  //       $style.html(updatedContent);
  //     }
  //   }
  //   injectCssRulesIfNotExists();

}
module.exports = {temp};