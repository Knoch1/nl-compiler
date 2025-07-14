function manageclasses ($) {
  $("table").each((_, table) => {
    const $table = $(table);
    const classAttr = $table.attr("class") || "";
    const classList = classAttr.split(/\s+/);

    const tdUClasses = classList.filter((c) => /^td-o-/.test(c));
    const tdDClasses = classList.filter((c) => /^td-i-/.test(c));

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
}

module.exports = {manageclasses};