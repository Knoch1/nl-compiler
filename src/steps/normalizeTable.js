function normalizeTables($, $root) {
  $('table.row').each((_, rowTable) => {
    const $rowTable = $(rowTable);

    $rowTable.find('td').each((_, td) => {
      const $td = $(td);
      const $children = $td.children();
      let $innerTable = null;
      let movedStyles = [];

      // Find first <table> inside <td>
      $children.each((i, el) => {
        if (el.tagName === 'table') {
          $innerTable = $(el);
          return false; // break
        }
      });

      if (!$innerTable || !$innerTable.length) return;

      // ----------- 1. From <table> styles and width attr
      const tableStyle = $innerTable.attr('style') || '';
      const widthMatch = tableStyle.match(/(?:^|;)\s*width\s*:\s*[^;]+/i);
      const maxWidthMatch = tableStyle.match(/(?:^|;)\s*max-width\s*:\s*[^;]+/i);

      if (widthMatch) movedStyles.push(widthMatch[0].trim());
      if (maxWidthMatch) movedStyles.push(maxWidthMatch[0].trim());

      const widthAttr = $innerTable.attr('width');
      if (widthAttr && !movedStyles.some(s => s.startsWith('width'))) {
        movedStyles.push(`width: ${widthAttr}`);
      }

      // ----------- 2. If no styles found, try preceding <img>
      if (movedStyles.length === 0) {
        const index = $children.index($innerTable);
        if (index > 0) {
          const $prev = $children.eq(index - 1);
          if ($prev.is('img')) {
            const imgStyle = $prev.attr('style') || '';
            const imgWidth = imgStyle.match(/(?:^|;)\s*width\s*:\s*[^;]+/i);
            const imgMaxWidth = imgStyle.match(/(?:^|;)\s*max-width\s*:\s*[^;]+/i);

            if (imgWidth) movedStyles.push(imgWidth[0].trim());
            if (imgMaxWidth) movedStyles.push(imgMaxWidth[0].trim());

            const imgWidthAttr = $prev.attr('width');
            if (imgWidthAttr && !movedStyles.some(s => s.startsWith('width'))) {
              movedStyles.push(`width: ${imgWidthAttr}`);
            }

            // Clean up <img>
            let newImgStyle = imgStyle
              .split(';')
              .map(s => s.trim())
              .filter(s => s && !/^width\s*:/i.test(s) && !/^max-width\s*:/i.test(s))
              .join('; ');
            if (newImgStyle) {
              $prev.attr('style', newImgStyle);
            } else {
              $prev.removeAttr('style');
            }
            $prev.removeAttr('width');
          }
        }
      }

      // ----------- 3. Apply to parent <td>
      if (movedStyles.length > 0) {
        const tdStyle = $td.attr('style') || '';
        const combined = [...tdStyle.split(';'), ...movedStyles]
          .map(s => s.trim())
          .filter(Boolean)
          .join('; ');
        $td.attr('style', combined);

        // Clean inner table
        let newInnerStyle = tableStyle
          .split(';')
          .map(s => s.trim())
          .filter(s => s && !/^width\s*:/i.test(s) && !/^max-width\s*:/i.test(s))
          .join('; ');
        if (newInnerStyle) {
          $innerTable.attr('style', newInnerStyle);
        } else {
          $innerTable.removeAttr('style');
        }
        $innerTable.removeAttr('width');
      }
    });
  });



  $root.find("table:not(.button):not(.button table)").each((_, table) => {
    const $table = $(table);

    // Set missing attributes
    if (!$table.attr("width")) {
      const styleAttr = $table.attr("style") || "";
      const maxWidthMatch = styleAttr.match(/max-width\s*:\s*([^;]+)\s*;?/i);
      let maxWidth = maxWidthMatch ? maxWidthMatch[1].trim() : null;
      if (maxWidth) {
        // Extract numeric part only
        const numericMatch = maxWidth.match(/^(\d+(?:\.\d+)?)/);
        if (numericMatch) {
          maxWidth = numericMatch[1];
          $table.attr("width", maxWidth);
        }
      } else {
        $table.attr("width", "100%");
      }
    }
    if (!$table.attr("border")) $table.attr("border", "0");
    if (!$table.attr("cellpadding")) $table.attr("cellpadding", "0");
    if (!$table.attr("cellspacing")) $table.attr("cellspacing", "0");

    // Ensure required default inline styles are included
    const requiredStyles = {
      width: "100%",
      margin: "0",
      padding: "0",
      "border-collapse": "collapse",
    };

    const currentStyleStr = $table.attr("style") || "";
    const styleObj = {};

    // Convert current styles into key-value object
    currentStyleStr.split(";").forEach((rule) => {
      const [key, value] = rule.split(":").map((s) => s && s.trim());
      if (key && value) styleObj[key] = value;
    });

    // Add missing default styles
    for (const [key, value] of Object.entries(requiredStyles)) {
      if (!styleObj.hasOwnProperty(key)) {
        styleObj[key] = value;
      }
    }

    // If table.column has padding, move it to first <td>
    if ($table.hasClass("column") && styleObj["padding"]) {
      const paddingValue = styleObj["padding"];
      delete styleObj["padding"]; // remove from table

      const $firstTd = $table.find("td").first();
      if ($firstTd.length) {
        const tdStyleObj = parseStyle($firstTd.attr("style") || "");

        if (!tdStyleObj.hasOwnProperty("padding")) {
          tdStyleObj["padding"] = paddingValue;

          const newTdStyle = Object.entries(tdStyleObj)
            .map(([k, v]) => `${k}: ${v}`)
            .join("; ");
          $firstTd.attr("style", newTdStyle);
        }
      }
    }

    // Rebuild style string
    const newStyleStr = Object.entries(styleObj)
      .map(([k, v]) => `${k}: ${v}`)
      .join("; ");
    $table.attr("style", newStyleStr);
  });

  // Align center if margin: 0 auto
  $("table, td").each((_, el) => {
    const $el = $(el);
    const styleAttr = $el.attr("style") || "";
    const styleMap = parseStyle(styleAttr);

    if (styleMap["margin"] === "0 auto") {
      $el.attr("align", "center");
    }
  });

  function parseStyle(styleStr) {
    return styleStr.split(";").reduce((acc, part) => {
      const [key, value] = part.split(":").map((s) => s && s.trim());
      if (key && value) acc[key] = value;
      return acc;
    }, {});
  }


 function convertThBlockTables($) {
  $("table.th-block").each((_, table) => {
    const $table = $(table);
    const $td = $table.closest("td");

    if ($td.length) {
      // Get existing td attributes
      const oldAttrs = $td[0].attribs || {};
      const oldClassList = (oldAttrs.class || "").split(/\s+/).filter(Boolean);

      // Add 'th-block' if not present
      if (!oldClassList.includes("th-block")) {
        oldClassList.push("th-block");
      }

      // Create new <th> with copied attributes
      const $th = $("<th></th>");
      for (const [key, value] of Object.entries(oldAttrs)) {
        if (key === "class") {
          $th.attr("class", oldClassList.join(" "));
        } else {
          $th.attr(key, value);
        }
      }

      // If no class existed, assign th-block explicitly
      if (!oldAttrs.class) {
        $th.attr("class", "th-block");
      }

      // Move contents and replace
      $th.append($td.contents());
      $td.replaceWith($th);

      // Remove 'th-block' class from table
      const newTableClasses = ($table.attr("class") || "")
        .split(/\s+/)
        .filter(cls => cls !== "th-block");
      if (newTableClasses.length > 0) {
        $table.attr("class", newTableClasses.join(" "));
      } else {
        $table.removeAttr("class");
      }
    }
  });
}
  convertThBlockTables($);
}

module.exports = { normalizeTables };
