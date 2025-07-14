function convertAllDivs($, $root) {
  const divs = $root.find("div").addBack("div").get().reverse(); // Get all divs, innermost first
  divs.forEach((div) => convertDiv($, $(div)));
  moveTablePaddingStyles($, $root);
  moveTableTextStylesToTd($, $root);
}

function convertDiv($, $el) {
  const ALL_STYLES = [
    "padding",
    "padding-top",
    "padding-bottom",
    "padding-left",
    "padding-right",
    "color",
    "font-size",
    "line-height",
    "text-align",
    "vertical-align",
    "font-family",
    "text-decoration",
    "font-weight",
    "height",
    "width",
    "background-color",
    "margin",
    "display",
    "border-collapse",
    "border",
    "max-width",
    "border-radius",
    "border-color",
  ];

  const classAttr = $el.attr("class") || "";
  const styleAttr = $el.attr("style") || "";
  const children = $el.contents();
  const hrefAttr = $el.attr('href')? ` href="${$el.attr('href')}"` : '';
  const titleAttr = $el.attr('title')? ` title="${$el.attr('title')}"` : '';
  const combinedStyles = extractStyles(styleAttr, ALL_STYLES);
  const tableStyleAttr = combinedStyles ? ` style="${combinedStyles}"` : "";
  const tableClassAttr = classAttr ? ` class="${classAttr}"` : "";

  function extractStyles(styleStr, allowedProps) {
    return (styleStr || "")
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => allowedProps.includes(s.split(":")[0].trim()))
      .join("; ");
  }

  function wrapInTd(child) {
    if (child.type === "comment") return `<!--${child.data}-->`;
    if (!child) return "<td></td>";

    return `<td>${$.html(child)}</td>`;
  }

  function wrapInTr(tdContent) {
    return `<tr>${tdContent}</tr>`;
  }

  let tableHtml = "";

  if ($el.hasClass("row")) {
    const tds = children
      .toArray()
      .filter((n) => n.type === "tag")
      .map(wrapInTd)
      .join("");
    tableHtml = `<table${tableClassAttr}${tableStyleAttr}${hrefAttr}${titleAttr}>${wrapInTr(
      tds
    )}</table>`;
  } else if ($el.hasClass("column")) {
    const rows = children
      .toArray()
      .filter(
        (n) =>
          n.type === "tag" ||
          (n.type === "text" && n.data.trim() !== "") ||
          n.type === "comment"
      )
      .map((child) => wrapInTr(wrapInTd(child)))
      .join("");
    tableHtml = `<table${tableClassAttr}${tableStyleAttr}${hrefAttr}${titleAttr}>${rows}</table>`;
  } else {
    const content = wrapInTd(children);
    tableHtml = `<table${tableClassAttr}${tableStyleAttr}${hrefAttr}${titleAttr}>${wrapInTr(
      content
    )}</table>`;
  }

  if (tableHtml) {
    $el.replaceWith(tableHtml);
  }
}
function moveTablePaddingStyles($, $root) {
  const PADDING_PROPS = [
    "padding",
    "padding-top",
    "padding-bottom",
    "padding-left",
    "padding-right",
  ];

  function extractPaddingStyles(styleStr) {
    return (styleStr || "")
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => PADDING_PROPS.includes(s.split(":")[0].trim()));
  }

  function removePaddingStyles(styleStr) {
    return (styleStr || "")
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => !PADDING_PROPS.includes(s.split(":")[0].trim()))
      .join("; ");
  }

  $root.find("table").each((_, table) => {
    const $table = $(table);
    const classAttr = $table.attr("class") || "";
    const hasRowOrColumn =
      classAttr.includes("row") || classAttr.includes("column");
    const styleAttr = $table.attr("style") || "";

    const paddingStyles = extractPaddingStyles(styleAttr);
    if (paddingStyles.length === 0) return; // Nothing to move

    const cleanedStyle = removePaddingStyles(styleAttr);
    if (cleanedStyle) {
      $table.attr("style", cleanedStyle);
    } else {
      $table.removeAttr("style");
    }

    const paddingString = paddingStyles.join("; ");

    if (hasRowOrColumn) {
      // Move padding to parent <td>
      const $tdParent = $table.closest("td");
      if ($tdParent.length) {
        const parentStyle = $tdParent.attr("style") || "";
        $tdParent.attr(
          "style",
          [parentStyle, paddingString].filter(Boolean).join("; ")
        );
      } else {
        // Optionally wrap in <td> if parent doesn't exist — only if needed
        // (can be left out if you never want to auto-wrap)
      }
    } else {
      // Move padding to first <td> inside the table
      const $firstTd = $table.find("td").first();
      if ($firstTd.length) {
        const tdStyle = $firstTd.attr("style") || "";
        $firstTd.attr(
          "style",
          [tdStyle, paddingString].filter(Boolean).join("; ")
        );
      }
    }
  });
}
function moveTableTextStylesToTd($, $root) {
  const TEXT_STYLE_PROPS = [
    "color",
    "font-size",
    "line-height",
    "text-align",
    "vertical-align",
    "font-family",
    "text-decoration",
    "font-weight",
    "height",
  ];

  function extractStyles(styleStr, allowedProps) {
    return (styleStr || "")
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => allowedProps.includes(s.split(":")[0].trim()));
  }

  function removeStyles(styleStr, excludedProps) {
    return (styleStr || "")
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => !excludedProps.includes(s.split(":")[0].trim()))
      .join("; ");
  }

  $root.find("table").each((_, table) => {
    const $table = $(table);
    const styleAttr = $table.attr("style") || "";

    const textStyles = extractStyles(styleAttr, TEXT_STYLE_PROPS);
    if (textStyles.length === 0) return; // Nothing to move

    // Remove from table
    const newTableStyle = removeStyles(styleAttr, TEXT_STYLE_PROPS);
    if (newTableStyle) {
      $table.attr("style", newTableStyle);
    } else {
      $table.removeAttr("style");
    }

    // Add to first td
    const $firstTd = $table.find("td").first();
    if ($firstTd.length) {
      const tdStyle = $firstTd.attr("style") || "";
      const updatedStyle = [tdStyle, textStyles.join("; ")]
        .filter(Boolean)
        .join("; ");
      $firstTd.attr("style", updatedStyle);
    }
  });
}

module.exports = { convertAllDivs };


















// function convertAllDivs($, $root) {
//   const divs = $root.find('div').addBack('div').get().reverse(); // Get all divs, innermost first
//   divs.forEach(div => convertDiv($, $(div)));
// }

// function convertDiv($, $el) {
//   const TD_STYLES = [
//     'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'color', 'font-size', 'line-height', 'text-align', 'vertical-align',
//     'font-family', 'text-decoration', 'font-weight', 'height', 'width'
//   ];
//   const TABLE_STYLES = ['background-color', 'margin', 'display', 'border-collapse', 'border', 'max-width'];

//   const classAttr = $el.attr('class') || '';
//   const styleAttr = $el.attr('style') || '';
//   const hrefAttr = $el.attr('href')? `href:${$el.attr('href')}` : '';
//   const titleAttr = $el.attr('title')? `title:${$el.attr('title')}` : '';
//   const children = $el.contents();

//   const tableStyles = extractStyles(styleAttr, TABLE_STYLES);
//   const tdBaseStyles = extractStyles(styleAttr, TD_STYLES);

//   const tableStyleAttr = tableStyles ? ` style="${tableStyles}"` : '';
//   const tableClassAttr = classAttr ? ` class="${classAttr}"` : '';

//   function extractStyles(styleStr, allowedProps) {
//     return (styleStr || '')
//       .split(';')
//       .map(s => s.trim())
//       .filter(Boolean)
//       .filter(s => allowedProps.includes(s.split(':')[0].trim()))
//       .join('; ');
//   }

//   function wrapInTd(child) {
//     if (child.type === 'comment') return `<!--${child.data}-->`;
//     if (!child) return '<td></td>';
//     console.log(child);

//     const $child = $(child);
//     const childStyle = $child.attr('style') || '';
//     const tdStyles = [tdBaseStyles, extractStyles(childStyle, TD_STYLES)]
//       .filter(Boolean)
//       .join('; ');
//     const styleAttr = tdStyles ? ` style="${tdStyles}"` : '';

//     return `<td${styleAttr}>${$.html(child)}</td>`;
//   }

//   function wrapInTr(tdContent) {
//     return `<tr>${tdContent}</tr>`;
//   }

//   let tableHtml = '';

//   if ($el.hasClass('row')) {
//     const tds = children.toArray().filter(n => n.type === 'tag').map(wrapInTd).join('');
//     tableHtml = `<table${tableClassAttr}${tableStyleAttr}${hrefAttr}>${wrapInTr(tds)}</table>`;
//   } else if ($el.hasClass('column')) {
//     const rows = children.toArray()
//       .filter(n => n.type === 'tag' || (n.type === 'text' && n.data.trim() !== '') || n.type === 'comment')
//       .map(child => wrapInTr(wrapInTd(child)))
//       .join('');
//     tableHtml = `<table${tableClassAttr}${tableStyleAttr}${hrefAttr}${titleAttr}>${rows}</table>`;
//   } else {
//     const content = wrapInTd(children);
//     tableHtml = `<table${tableClassAttr}${tableStyleAttr}${hrefAttr}${titleAttr}>${wrapInTr(content)}</table>`;
//   }

//   if (tableHtml) {
//     $el.replaceWith(tableHtml);
//   }
// }

// module.exports = { convertAllDivs };
