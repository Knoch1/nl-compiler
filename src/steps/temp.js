function temp($) {

  //     $('.row').removeClass('row');
  // $('.column').removeClass('column');
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


  // const TD_PROPS = [
  //   'border', 'border-top', 'border-bottom', 'border-left', 'border-right',
  //   'width', 'max-width'
  // ];
  // const PARENT_TD_PROPS = [
  //   'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right'
  // ];

  // $('table.line').each((_, table) => {
  //   const $table = $(table);
  //   const originalStyle = $table.attr('style') || '';

  //   let tdStyles = [];
  //   let parentTdStyles = [];
  //   let remainingTableStyles = [];

  //   // Parse and route style props
  //   originalStyle.split(';').forEach(styleRule => {
  //     const trimmed = styleRule.trim();
  //     if (!trimmed) return;

  //     const [prop, ...rest] = trimmed.split(':');
  //     if (!prop || rest.length === 0) return;

  //     const propName = prop.trim();
  //     const propValue = rest.join(':').trim();

  //     if (TD_PROPS.includes(propName)) {
  //       tdStyles.push(`${propName}: ${propValue}`);
  //     } else if (PARENT_TD_PROPS.includes(propName)) {
  //       parentTdStyles.push(`${propName}: ${propValue}`);
  //     } else {
  //       remainingTableStyles.push(`${propName}: ${propValue}`);
  //     }
  //   });

  //   // Update table style (set width: 100%)
  //   const newTableStyle = ['width: 100%', ...remainingTableStyles].join('; ');
  //   $table.attr('style', newTableStyle);

  //   const tdStyleAttr = tdStyles.join('; ');
  //   const parentTdStyleAttr = parentTdStyles.join('; ');

  //   // Find parent <td> (if it exists) and move padding there
  //   const $parentTd = $table.closest('td');
  //   if ($parentTd.length && parentTdStyleAttr) {
  //     const existing = $parentTd.attr('style') || '';
  //     const combined = [existing, parentTdStyleAttr].filter(Boolean).join('; ').replace(/;;+/g, ';').trim();
  //     $parentTd.attr('style', combined);
  //   }

  //   // Apply to each child td
  //   $table.find('td').each((_, td) => {
  //     const $td = $(td);
  //     const existing = $td.attr('style') || '';
  //     const combined = [existing, tdStyleAttr].filter(Boolean).join('; ').replace(/;;+/g, ';').trim();
  //     $td.attr('style', combined);
  //     $td.html('&nbsp;');
  //   });
  // });

// $('table.row').each(function () {
//     const $table = $(this);
//     const styleAttr = $table.attr('style') || '';

//     // Match padding from inline style
//     const paddingMatch = styleAttr.match(/padding\s*:\s*[^;]+/i);
//     if (!paddingMatch) return;

//     const paddingStyle = paddingMatch[0]; // e.g., "padding: 10px 20px"
//     const td = $table.closest('td');
//     if (!td.length) return;

//     // Transfer or merge the padding into the <td>'s style
//     let tdStyle = td.attr('style') || '';
//     if (tdStyle.includes('padding')) {
//       tdStyle = tdStyle.replace(/padding\s*:\s*[^;]+/i, paddingStyle);
//     } else {
//       tdStyle = tdStyle.trim();
//       tdStyle += (tdStyle ? '; ' : '') + paddingStyle;
//     }
//     td.attr('style', tdStyle);

//     // Remove padding from <table.row>
//     let newTableStyle = styleAttr.replace(/padding\s*:\s*[^;]+;?\s*/i, '').trim();
//     if (newTableStyle === '') {
//       $table.removeAttr('style');
//     } else {
//       $table.attr('style', newTableStyle);
//     }
//   });


//  $('td > table.line').each((_, table) => {
//     const $table = $(table);
//     const $outerTd = $table.closest('td');
//     const $innerTd = $table.find('tr').first().find('td').first();

//     if ($innerTd.length === 0) return;

//     // Extract styles from the inner <td>
//     const innerStyles = parseStyle($innerTd.attr('style') || '');

//     // Move relevant styles to outer <td>
//     const inheritedStyles = {};
//     const remainingInnerStyles = {};

//     const moveToOuter = ['padding', 'margin', 'border', 'width', 'max-width'];
//     const keepInInner = ['border-top', 'width', 'max-width'];

//     for (const [prop, val] of Object.entries(innerStyles)) {
//       if (moveToOuter.includes(prop)) {
//         inheritedStyles[prop] = val;
//       } else if (keepInInner.includes(prop)) {
//         remainingInnerStyles[prop] = val;
//       }
//     }

//     // Apply to outer <td>
//     const existingOuterStyles = parseStyle($outerTd.attr('style') || '');
//     const newOuterStyle = { ...existingOuterStyles, ...inheritedStyles };
//     $outerTd.attr('style', styleToString(newOuterStyle));

//     // Clean and reapply inner <td> styles
//     $innerTd.attr('style', styleToString(remainingInnerStyles));

//     // Clean inner <table> style
//     const cleanedTableStyle = {
//       'width': '100%',
//       'border-collapse': 'collapse',
//       'border': '0',
//       ...parseStyle($table.attr('style') || {})
//     };
//     $table.attr('style', styleToString(cleanedTableStyle));

//     // Optional: strip class if you want to remove `.line` after processing
//     // $table.removeClass('line');
//   });

//   function parseStyle(styleStr) {
//     const styles = {};
//     styleStr.split(';').forEach(part => {
//       const [prop, val] = part.split(':').map(s => s && s.trim());
//       if (prop && val) styles[prop] = val;
//     });
//     return styles;
//   }

//   function styleToString(styleObj) {
//     return Object.entries(styleObj)
//       .map(([k, v]) => `${k}: ${v}`)
//       .join('; ');
//   }


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



  // $('table').each((_, table) => {
  //   const $table = $(table);
  //   const classAttr = $table.attr('class') || '';

  //   // Extract td-* classes
  //   const classList = classAttr.split(/\s+/);
  //   const tdClasses = classList.filter(c => c.startsWith('td-'));
  //   const otherClasses = classList.filter(c => !c.startsWith('td-'));

  //   if (tdClasses.length === 0) return; // Nothing to do

  //   const hasRowOrColumn = classList.includes('row') || classList.includes('column');

  //   if (hasRowOrColumn) {
  //     // Move td-* classes to parent <td>
  //     const $td = $table.closest('td');
  //     if ($td.length) {
  //       const tdClassList = ($td.attr('class') || '').split(/\s+/);
  //       const newTdClassList = [...new Set([...tdClassList, ...tdClasses])];
  //       $td.attr('class', newTdClassList.join(' ').trim());
  //     }
  //   } else {
  //     // Move td-* classes to first child <td>
  //     const $childTd = $table.find('td').first();
  //     if ($childTd.length) {
  //       const childClassList = ($childTd.attr('class') || '').split(/\s+/);
  //       const newChildClassList = [...new Set([...childClassList, ...tdClasses])];
  //       $childTd.attr('class', newChildClassList.join(' ').trim());
  //     }
  //   }

  //   // Update <table> class without td-* entries
  //   if (otherClasses.length > 0) {
  //     $table.attr('class', otherClasses.join(' ').trim());
  //   } else {
  //     $table.removeAttr('class');
  //   }
  // });
    $('table').each((_, table) => {
    const $table = $(table);
    const classAttr = $table.attr('class') || '';
    const classList = classAttr.split(/\s+/);

    const tdUClasses = classList.filter(c => /^td-u-/.test(c));
    const tdDClasses = classList.filter(c => /^td-d-/.test(c));

    // Move td-u-* classes to parent <td>
    if (tdUClasses.length) {
      const $parentTd = $table.closest('td');
      if ($parentTd.length) {
        const existing = $parentTd.attr('class') || '';
        const updated = [...new Set([...existing.split(/\s+/), ...tdUClasses])].join(' ').trim();
        $parentTd.attr('class', updated);
      }
    }

    // Move td-d-* classes to the first child <td>
    if (tdDClasses.length) {
      const $childTd = $table.find('tr').first().find('td').first();
      if ($childTd.length) {
        const existing = $childTd.attr('class') || '';
        const updated = [...new Set([...existing.split(/\s+/), ...tdDClasses])].join(' ').trim();
        $childTd.attr('class', updated);
      }
    }

    // Remove td-u-* and td-d-* from the table class
    const remaining = classList.filter(c => !/^td-[ud]-/.test(c));
    if (remaining.length) {
      $table.attr('class', remaining.join(' '));
    } else {
      $table.removeAttr('class');
    }
  });

  
}
module.exports = {temp};