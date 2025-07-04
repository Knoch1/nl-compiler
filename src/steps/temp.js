function temp($) {
  //     $('.row').removeClass('row');
  // $('.column').removeClass('column');
  function removeEmptyClassAttr($el) {
    const classAttr = $el.attr("class");
    if (!classAttr || !classAttr.trim()) {
      $el.removeAttr("class");
    }
  }

  $("table, td").each((_, el) => {
    removeEmptyClassAttr($(el));
  });

  $("tr").attr(
    "style",
    "padding: 0px; margin: 0px; border-spacing: 0; font-size:0; mso-line-height-alt:0; mso-margin-top-alt:1px;"
  );
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
  $("table").each((_, table) => {
    const $table = $(table);
    const classAttr = $table.attr("class") || "";
    const classList = classAttr.split(/\s+/);

    const tdUClasses = classList.filter((c) => /^td-u-/.test(c));
    const tdDClasses = classList.filter((c) => /^td-d-/.test(c));

    // Move td-u-* classes to parent <td>
    if (tdUClasses.length) {
      const $parentTd = $table.closest("td");
      if ($parentTd.length) {
        const existing = $parentTd.attr("class") || "";
        const updated = [...new Set([...existing.split(/\s+/), ...tdUClasses])]
          .join(" ")
          .trim();
        $parentTd.attr("class", updated);
      }
    }

    // Move td-d-* classes to the first child <td>
    if (tdDClasses.length) {
      const $childTd = $table.find("tr").first().find("td").first();
      if ($childTd.length) {
        const existing = $childTd.attr("class") || "";
        const updated = [...new Set([...existing.split(/\s+/), ...tdDClasses])]
          .join(" ")
          .trim();
        $childTd.attr("class", updated);
      }
    }

    // Remove td-u-* and td-d-* from the table class
    const remaining = classList.filter((c) => !/^td-[ud]-/.test(c));
    if (remaining.length) {
      $table.attr("class", remaining.join(" "));
    } else {
      $table.removeAttr("class");
    }
  });

  function parseStyle(styleStr) {
    const styles = {};
    styleStr.split(";").forEach((rule) => {
      const [prop, val] = rule.split(":").map((s) => s && s.trim());
      if (prop && val) styles[prop] = val;
    });
    return styles;
  }

  $("td a").each((_, anchor) => {
    const $a = $(anchor);
    const $td = $a.closest("td");

    if (!$td.length) return;

    const aStyles = parseStyle($a.attr("style") || "");
    const padding = aStyles["padding"];

    if (padding) {
      // Remove padding from <a>
      delete aStyles["padding"];
      const updatedAStyle = Object.entries(aStyles)
        .map(([k, v]) => `${k}: ${v}`)
        .join("; ");
      $a.attr("style", updatedAStyle);

      // Add padding to <td>
      const tdStyles = parseStyle($td.attr("style") || "");
      tdStyles["padding"] = padding;
      const updatedTdStyle = Object.entries(tdStyles)
        .map(([k, v]) => `${k}: ${v}`)
        .join("; ");
      $td.attr("style", updatedTdStyle);
    }
  });

  // 	 $('img').each((_, img) => {
  //     const $img = $(img);
  //     const innerTd = $img.closest('td');
  //     if (!innerTd.length) return;

  //     const outerTd = innerTd.parents('td').first(); // next outer <td>
  //     if (!outerTd.length) return;

  //     // Parse style of inner <td>
  //     const styleStr = innerTd.attr('style') || '';
  //     const styleMap = parseStyle(styleStr);

  //     // Collect padding-related styles
  //     const paddingProps = ['padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right'];
  //     const movedStyles = {};

  //     for (const prop of paddingProps) {
  //       if (styleMap[prop]) {
  //         movedStyles[prop] = styleMap[prop];
  //         delete styleMap[prop];
  //       }
  //     }

  //     // Apply padding to outer <td>
  //     if (Object.keys(movedStyles).length) {
  //       const outerStyle = outerTd.attr('style') || '';
  //       const outerMap = parseStyle(outerStyle);

  //       for (const [key, value] of Object.entries(movedStyles)) {
  //         outerMap[key] = value;
  //       }

  //       const newOuterStyle = Object.entries(outerMap)
  //         .map(([k, v]) => `${k}: ${v}`)
  //         .join('; ');
  //       outerTd.attr('style', newOuterStyle);
  //     }

  //     // Update inner <td> style
  //     const newInnerStyle = Object.entries(styleMap)
  //       .map(([k, v]) => `${k}: ${v}`)
  //       .join('; ');
  //     if (newInnerStyle) {
  //       innerTd.attr('style', newInnerStyle);
  //     } else {
  //       innerTd.removeAttr('style');
  //     }
  // 	outerTd.attr('align','center');
  //   });

  //     $('img').each((_, img) => {
  //     const $img = $(img);
  //     const imgWidth = $img.attr('width') || parseStyle($img.attr('style') || '')['width'];
  //     if (!imgWidth) return;

  //     // Apply width to nearest table
  //     const $table = $img.closest('table');
  //     if ($table.length && !$table.attr('width')) {
  //       $table.attr('width', imgWidth);
  // 	  $table.attr('style',`width : ${imgWidth}`);
  // 	  $table.attr('style',`width : ${imgWidth}`);
  // 	  $table.attr('align','center');
  //     }

  //     // Apply alignment and spacing styles to nearest td
  //     const $td = $img.closest('td');
  //     if ($td.length) {
  //       const existingStyle = parseStyle($td.attr('style') || '');

  //       // Merge required styles
  //       const enforcedStyles = {
  //         padding: '0',
  //         margin: '0 auto',
  //         'line-height': '0',
  //         'text-align': 'center',
  //       };

  //       const finalStyle = {
  //         ...existingStyle,
  //         ...enforcedStyles,
  //       };

  //       const styleStr = Object.entries(finalStyle)
  //         .map(([k, v]) => `${k}: ${v}`)
  //         .join('; ');

  //       $td.attr('style', styleStr);
  //     }
  //   });

  //   $('img[src$=".png"]').each((_, img) => {
  //     const $img = $(img);
  //     const $a = $img.closest('a');
  //     const $imgTd = $a.closest('td');

  //     // Only proceed if valid surrounding structure
  //     if (!$imgTd.length) return;

  //     const padding = ($imgTd.attr('style') || '').match(/padding:[^;]+/i)?.[0] || 'padding: 0';
  //     let width = $img.attr('width');

  // 	// 2. If not found, try from `style`
  // 	if (!width) {
  // 	const style = $img.attr('style') || '';
  // 	const match = style.match(/width\s*:\s*(\d+)px/);
  // 	if (match) {
  // 		width = match[1];
  // 	}
  // 	}

  // 	// 3. Fallback default
  // 	if (!width) {
  // 	width = '600';
  // 	}

  //     // Create the new table structure
  //     const newHtml = `
  //       <tr style="padding: 0px; margin: 0px auto; border-spacing: 0; font-size:0; mso-line-height-alt:0; mso-margin-top-alt:1px;">
  //         <td align="center" style="background-color: #ffffff; margin: 0 auto; ${padding};">
  //           <table width="${width}" align="center" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; width: ${width}px; max-width: ${width}px; border-collapse:collapse;">
  //             <tr style="padding: 0px; margin: 0px; border-spacing: 0; font-size:0; mso-line-height-alt:0; mso-margin-top-alt:1px;">
  //               <td style="background-color:#ffffff; padding: 0; margin: 0 auto; line-height: 0px; text-align: center;">
  //                 <a href="${$a.attr('href') || '#'}" target="_blank" title="${$img.attr('alt') || ''}">
  //                   <img src="${$img.attr('src')}" alt="${$img.attr('alt') || ''}" width="${width}" height="${$img.attr('height') || ''}" border="0" style="text-align: center; width: ${width}px; height: ${$img.attr('height') || 'auto'}; max-width: ${width}px; margin: 0 auto; padding: 0; display:block;" />
  //                 </a>
  //               </td>
  //             </tr>
  //           </table>
  //         </td>
  //       </tr>
  //     `;

  //     // Replace the parent <tr> with the new structure
  //     const $tr = $img.closest('tr');
  //     $tr.replaceWith(newHtml);
  //   });
  //
  $("img.logo").each((_, img) => {
    const $img = $(img);
    const $td = $img.closest("td");
    const $tdParent = $td.parent().closest("td");
    const $table = $td.closest("table");

    if (!$td.length || !$tdParent.length || !$table.length) return;

    // Get and remove padding from the td with the image
    const tdStyle = parseStyle($td.attr("style") || "");
    const padding = tdStyle["padding"];
    delete tdStyle["padding"];

    // Enforce required styles on the <td> with the <img>
    tdStyle["margin"] = "0 auto";
    tdStyle["line-height"] = "0px";
    tdStyle["text-align"] = "center";
    $td.attr("style", styleString(tdStyle));

    // Add padding to parent <td>
    if (padding) {
      const parentStyle = parseStyle($tdParent.attr("style") || "");
      parentStyle["padding"] = padding;
      $tdParent.attr("style", styleString(parentStyle));
    }

    // Add align="center" to parent td and the table
    $tdParent.attr("align", "center");
    $table.attr("align", "center");

    // Extract image width from attribute or inline style
    let imgWidth =
      $img.attr("width") || parseStyle($img.attr("style") || "")["width"];
    if (!imgWidth) imgWidth = "600px"; // fallback

    // Normalize to numeric px if necessary
    const widthNum = parseInt(imgWidth, 10);
    if (!isNaN(widthNum)) {
      $table.attr("width", widthNum);
      const tableStyle = parseStyle($table.attr("style") || "");
      tableStyle["width"] = `${widthNum}px`;
      tableStyle["max-width"] = `${widthNum}px`;
      $table.attr("style", styleString(tableStyle));
    }
  });

  function styleString(obj) {
    return Object.entries(obj)
      .map(([k, v]) => `${k}: ${v}`)
      .join("; ");
  }
}
module.exports = { temp };
