// function applyInheritedTextStyles($) {
// 	const TEXT_TAGS = ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'];
// 	const STYLE_PROPS = ['font-size', 'font-family', 'line-height', 'font-weight', 'color'];

// 	$('td').each((_, td) => {
// 		const $td = $(td);
// 		const tdStyleAttr = $td.attr('style') || '';

// 		// Extract styles from the td
// 		const tdStyles = tdStyleAttr
// 		.split(';')
// 		.map(s => s.trim())
// 		.filter(Boolean)
// 		.reduce((acc, rule) => {
// 			const [prop, value] = rule.split(':').map(p => p.trim());
// 			if (STYLE_PROPS.includes(prop)) {
// 			acc[prop] = value;
// 			}
// 			return acc;
// 		}, {});

// 		// Apply to each direct child if not already set
// 		$td.children(TEXT_TAGS.join(',')).each((_, child) => {
// 		const $child = $(child);
// 		const childStyleAttr = $child.attr('style') || '';

// 		// Convert child's style to a map
// 		const childStyles = childStyleAttr
// 			.split(';')
// 			.map(s => s.trim())
// 			.filter(Boolean)
// 			.reduce((acc, rule) => {
// 			const [prop, value] = rule.split(':').map(p => p.trim());
// 			acc[prop] = value;
// 			return acc;
// 			}, {});

// 		// Merge in td styles, but only if not already defined on child
// 		for (const prop of STYLE_PROPS) {
// 			if (!(prop in childStyles) && prop in tdStyles) {
// 			childStyles[prop] = tdStyles[prop];
// 			}
// 		}

// 		// Write new style back to child
// 		const newStyle = Object.entries(childStyles)
// 			.map(([k, v]) => `${k}: ${v}`)
// 			.join('; ');
// 		$child.attr('style', newStyle);
// 		});
// 	});

// 	$(TEXT_TAGS.join(',')).each((_, el) => {
// 		const $el = $(el);
// 		const styleAttr = $el.attr('style') || '';

// 		// Only add if not already present
// 		if (!/mso-line-height-rule\s*:\s*exactly/i.test(styleAttr)) {
// 		const newStyle = styleAttr.trim().replace(/;?$/, ';') + ' mso-line-height-rule:exactly;';
// 		$el.attr('style', newStyle.trim());
// 		}
// 	});
// 	$('td').each((_, td) => {
//     const $td = $(td);
//     const descendants = $td.find('p, span, h1, h2, h3, h4, h5, h6, a');

//     descendants.each((_, el) => {
//       const styleMap = parseStyle($(el).attr('style') || '');
//       if (styleMap['text-align']) {
//         $td.attr('align', styleMap['text-align']);
//         return false; // stop after first match
//       }
//     });
//   });
//   $('td').each((_, td) => {
//   const $td = $(td);
//   if ($td.attr('align')) return; // skip if already aligned

//   const descendants = $td.find('p, span, h1, h2, h3, h4, h5, h6, a');
//   descendants.each((_, el) => {
//     const styleMap = parseStyle($(el).attr('style') || '');
//     if (styleMap['text-align']) {
//       $td.attr('align', styleMap['text-align'].toLowerCase());
//       return false; // stop after first match
//     }
//   });

// });
//  function parseStyle(styleStr) {
//   return styleStr.split(';').reduce((acc, part) => {
//     const [key, value] = part.split(':').map(s => s && s.trim());
//     if (key && value) acc[key] = value;
//     return acc;
//   }, {});
// }
// }
// module.exports = {applyInheritedTextStyles};

function applyInheritedTextStyles($) {
  const TEXT_TAGS = ["p", "span", "h1", "h2", "h3", "h4", "h5", "h6", "a"];
  const STYLE_PROPS = [
    "font-size",
    "font-family",
    "line-height",
    "font-weight",
    "color",
  ];

  // Helper to parse inline styles into a key-value object
  function parseStyle(styleStr) {
    return styleStr
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .reduce((acc, part) => {
        const [key, value] = part.split(":").map((s) => s && s.trim());
        if (key && value) acc[key] = value;
        return acc;
      }, {});
  }

  // 1. Inherit style props from <td> to direct children
  $("td").each((_, td) => {
    const $td = $(td);
    const tdStyles = parseStyle($td.attr("style") || "");

    const inheritedStyles = {};
    for (const prop of STYLE_PROPS) {
      if (tdStyles[prop]) inheritedStyles[prop] = tdStyles[prop];
    }

    $td.children(TEXT_TAGS.join(",")).each((_, child) => {
      const $child = $(child);
      const childStyles = parseStyle($child.attr("style") || "");

      // Only inherit missing props
      for (const [prop, value] of Object.entries(inheritedStyles)) {
        if (!(prop in childStyles)) {
          childStyles[prop] = value;
        }
      }

      const newStyle = Object.entries(childStyles)
        .map(([k, v]) => `${k}: ${v}`)
        .join("; ");
      $child.attr("style", newStyle);
    });
  });

  // 2. Add mso-line-height-rule: exactly to each text element
  $(TEXT_TAGS.join(",")).each((_, el) => {
    const $el = $(el);
    const styleAttr = $el.attr("style") || "";

    if (!/mso-line-height-rule\s*:\s*exactly/i.test(styleAttr)) {
      const newStyle =
        styleAttr.trim().replace(/;?$/, ";") +
        " mso-line-height-rule: exactly;";
      $el.attr("style", newStyle.trim());
    }
  });

  // 3. Apply align="..." to <td> based on text-align of first matching descendant
  $("td").each((_, td) => {
    const $td = $(td);
    if ($td.attr("align")) return;

    const descendants = $td.find(TEXT_TAGS.join(","));
    for (const el of descendants) {
      const styleMap = parseStyle($(el).attr("style") || "");
      if (styleMap["text-align"]) {
        $td.attr("align", styleMap["text-align"].toLowerCase());
        break;
      }
    }
  });
  const PROPS_TO_MOVE = ["width", "margin"];

  $("td").each((_, td) => {
    const $td = $(td);
    const tdStyle = parseStyle($td.attr("style") || "");

    const descendants = $td.find(TEXT_TAGS.join(","));

    for (const el of descendants) {
      const $el = $(el);
      const elStyle = parseStyle($el.attr("style") || {});
      let modified = false;

      for (const prop of PROPS_TO_MOVE) {
        if (elStyle[prop]) {
          // Move property to td if not already defined
          if (!tdStyle[prop]) {
            tdStyle[prop] = elStyle[prop];
          }
          // Remove from child
          delete elStyle[prop];
          modified = true;
        }
      }

      if (modified) {
        // Apply updated style to the element
        const newElStyle = Object.entries(elStyle)
          .map(([k, v]) => `${k}: ${v}`)
          .join("; ");
        $el.attr("style", newElStyle);
      }
    }

    // Update td style if modified
    const newTdStyle = Object.entries(tdStyle)
      .map(([k, v]) => `${k}: ${v}`)
      .join("; ");
    $td.attr("style", newTdStyle);
  });
}

module.exports = { applyInheritedTextStyles };
