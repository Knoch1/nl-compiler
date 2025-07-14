function sortElementAttributes($, orderArray) {
  $('*').each((_, el) => {
    const $el = $(el);
    const originalAttrs = el.attribs;
    const sortedAttrs = {};

    // First add attributes based on the preferred order
    for (const attr of orderArray) {
      if (originalAttrs.hasOwnProperty(attr)) {
        sortedAttrs[attr] = originalAttrs[attr];
      }
    }

    // Then add all remaining attributes in original order
    for (const attr of Object.keys(originalAttrs)) {
      if (!sortedAttrs.hasOwnProperty(attr)) {
        sortedAttrs[attr] = originalAttrs[attr];
      }
    }

    // Reconstruct the element with sorted attributes
    for (const attr of Object.keys(originalAttrs)) {
      $el.removeAttr(attr);
    }

    for (const [key, value] of Object.entries(sortedAttrs)) {
      $el.attr(key, value);
    }
  });
}
function sortInlineStyles($, styleOrderArray) {
  $('[style]').each((_, el) => {
    const $el = $(el);
    const styleAttr = $el.attr('style');
    if (!styleAttr) return;

    // Parse style string into a key-value map
    const styleMap = {};
    styleAttr.split(';').forEach((rule) => {
      const [key, value] = rule.split(':').map(s => s && s.trim());
      if (key && value) {
        styleMap[key] = value;
      }
    });

    // Reorder styles based on preferred order
    const sortedStyleParts = [];

    for (const prop of styleOrderArray) {
      if (styleMap.hasOwnProperty(prop)) {
        sortedStyleParts.push(`${prop}: ${styleMap[prop]}`);
        delete styleMap[prop];
      }
    }

    // Add remaining styles in original order
    for (const [key, value] of Object.entries(styleMap)) {
      sortedStyleParts.push(`${key}: ${value}`);
    }

    // Rebuild and set sorted style string
    const sortedStyleString = sortedStyleParts.join('; ') + ';';
    $el.attr('style', sortedStyleString);
  });
}





module.exports = {
  sortElementAttributes,
  sortInlineStyles,
};