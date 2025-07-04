function normalizeTables($, $root) {
  $root.find("table:not(.button):not(.button table)").each((_, table) => {
    const $table = $(table);

    // Set missing attributes
    if (!$table.attr("width")) $table.attr("width", "100%");
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
}

module.exports = { normalizeTables };
