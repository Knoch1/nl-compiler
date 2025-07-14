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
  const PROPS_TO_MOVE = ["width", "margin", "max-width"];

  // $("td").each((_, td) => {
  //   const $td = $(td);
  //   const tdStyle = parseStyle($td.attr("style") || "");

  //   const descendants = $td.find(TEXT_TAGS.join(","));

  //   for (const el of descendants) {
  //     const $el = $(el);
  //     const elStyle = parseStyle($el.attr("style") || {});
  //     let modified = false;

  //     for (const prop of PROPS_TO_MOVE) {
  //       if (elStyle[prop]) {
  //         // Move property to td if not already defined
  //         if (!tdStyle[prop]) {
  //           tdStyle[prop] = elStyle[prop];
  //         }
  //         // Remove from child
  //         delete elStyle[prop];
  //         modified = true;
  //       }
  //     }

  //     if (modified) {
  //       // Apply updated style to the element
  //       const newElStyle = Object.entries(elStyle)
  //         .map(([k, v]) => `${k}: ${v}`)
  //         .join("; ");
  //       $el.attr("style", newElStyle);
  //     }
  //   }

  //   // Update td style if modified
  //   const newTdStyle = Object.entries(tdStyle)
  //     .map(([k, v]) => `${k}: ${v}`)
  //     .join("; ");
  //   $td.attr("style", newTdStyle);
  // });
$("a").each((_, a) => {
    const $a = $(a);
    let aStyle = parseStyle($a.attr("style") || "");
    let aModified = false;

    const $td = $a.parent("td");
    if (!$td.length) return;

    let tdStyle = parseStyle($td.attr("style") || "");
    let tdModified = false;

    for (const prop of PROPS_TO_MOVE) {
      if (aStyle[prop]) {
        if (!tdStyle[prop]) {
          tdStyle[prop] = aStyle[prop];
          tdModified = true;
        }
        delete aStyle[prop];
        aModified = true;
      }
    }

    if (aModified) {
      const newAStyle = Object.entries(aStyle)
        .map(([k, v]) => `${k}: ${v}`)
        .join("; ");
      $a.attr("style", newAStyle);
    }

    if (tdModified) {
      const newTdStyle = Object.entries(tdStyle)
        .map(([k, v]) => `${k}: ${v}`)
        .join("; ");
      $td.attr("style", newTdStyle);
    }
  });



  // $(TEXT_TAGS.join(",")).each((_, el) => {
  //   const $el = $(el);
  //   const style = $el.attr("style") || "";
  //   const styleMap = parseStyle(style);

  //   if (styleMap["font-size"] && styleMap["font-size"].endsWith("px")) {
  //     const sizeVal = styleMap["font-size"].replace("px", "").trim();

  //     // Only add if numeric and class doesn't already exist
  //     if (/^\d+$/.test(sizeVal)) {
  //       const className = `font-size-${sizeVal}`;
  //       const existingClasses = ($el.attr("class") || "").split(/\s+/);

  //       if (!existingClasses.includes(className)) {
  //         $el.attr("class", [...existingClasses, className].join(" ").trim());
  //       }
  //     }
  //   }
  // });













const createdClasses = new Set();

$(TEXT_TAGS.join(",")).each((_, el) => {
  const $el = $(el);
  const style = $el.attr("style") || "";
  const styleMap = parseStyle(style);

  if (styleMap["font-size"] && styleMap["font-size"].endsWith("px")) {
    const sizeVal = styleMap["font-size"].replace("px", "").trim();
    if (/^\d+$/.test(sizeVal)) {
      const className = `font-size-${sizeVal}`;
      createdClasses.add(Number(sizeVal));
      const existingClasses = ($el.attr("class") || "").split(/\s+/);
      if (!existingClasses.includes(className)) {
        $el.attr("class", [...existingClasses, className].join(" ").trim());
      }
    }
  }
});

if (createdClasses.size === 0) return;

let $styleTag = $("head style").first();
if (!$styleTag.length) {
  $styleTag = $("<style type='text/css'></style>");
  $("head").append($styleTag);
}

let styleContent = $styleTag.html() || "";
const newRules = [...createdClasses]
  .map(size => `.font-size-${size}{font-size:${Math.max(0, size - 2)}px;}`)
  .filter(rule => !styleContent.includes(rule))
  .join("");

if (!newRules) return;

const mediaRegex = /@media screen and \(max-width: 600px\)\s*\{([\s\S]*?)\}/;
if (mediaRegex.test(styleContent)) {
  styleContent = styleContent.replace(mediaRegex, (_, inner) =>
    `@media screen and (max-width: 600px){${newRules}${inner}}`
  );
} else {
  styleContent += `@media screen and (max-width: 600px){${newRules}}`;
}

$styleTag.html(styleContent.trim());




}

module.exports = { applyInheritedTextStyles };
