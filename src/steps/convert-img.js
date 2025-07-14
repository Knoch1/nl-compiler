function convertImages($) {
  $("img").each((_, el) => {
    const img = $(el);

    // border setzen
    img.attr("border", "0");

    // style erweitern statt ersetzen
    const existingStyle = img.attr("style") || "";
    const extraStyle =
      "text-align: center; padding: 0; margin: 0 auto; display: block;";
    const mergedStyle = mergeStyles(existingStyle, extraStyle);
    img.attr("style", mergedStyle);
  });
  function mergeStyles(original, extra) {
    const styleMap = {};

    // Ursprüngliche Styles einlesen
    original.split(";").forEach((rule) => {
      const [key, value] = rule.split(":").map((s) => s?.trim());
      if (key) styleMap[key] = value;
    });

    // Zusätzliche Styles einfügen oder überschreiben
    extra.split(";").forEach((rule) => {
      const [key, value] = rule.split(":").map((s) => s?.trim());
      if (key) styleMap[key] = value;
    });

    // Zurück in einen Style-String wandeln
    return (
      Object.entries(styleMap)
        .map(([k, v]) => `${k}: ${v}`)
        .join("; ") + ";"
    );
  }
  $("img").each((_, el) => {
    const $img = $(el);
    const style = $img.attr("style") || "";

    // Skip if already has width/height attributes
    const hasWidthAttr = $img.attr("width");
    const hasHeightAttr = $img.attr("height");

    const widthMatch = style.match(/max-width\s*:\s*(\d+)px/i);
    const heightMatch = style.match(/(?:height|max-height)\s*:\s*(\d+)px/i);

    if (widthMatch && !hasWidthAttr) {
      $img.attr("width", widthMatch[1]);
    }

    if (heightMatch && !hasHeightAttr) {
      $img.attr("height", heightMatch[1]);
    }
  });
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
  function parseStyle(styleStr) {
    const styles = {};
    styleStr.split(";").forEach((rule) => {
      const [prop, val] = rule.split(":").map((s) => s && s.trim());
      if (prop && val) styles[prop] = val;
    });
    return styles;
  }
    $("img.image-100").each((_, img) => {
    const $img = $(img);
    const $td = $img.closest("td");

    if ($td.length && !$td.hasClass("image-100")) {
      $td.addClass("image-100");
    }
  });
}
module.exports = { convertImages };
