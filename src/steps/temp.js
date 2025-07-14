function temp($) {
  const head = $("head");
  if (!head.length) return;
  let msoexist =false;
  const originalChildren = head.contents().toArray();

  let hasViewport = false;
  let hasHttpEquiv = false;
  let hasMsoConditional = false;

  for (const node of originalChildren) {
    if (node.type === "tag") {
      const $node = $(node);
      const tagName = node.name.toLowerCase();

      if (tagName === "meta" && $node.attr("name")?.toLowerCase() === "viewport") {
        hasViewport = true;
      }
      if (tagName === "meta" && $node.attr("http-equiv")?.toLowerCase() === "content-type") {
        hasHttpEquiv = true;
      }
    } else if (node.type === "comment" && node.data.includes("[if mso]")) {
      hasMsoConditional = true;
    }
  }

  // Only prepend missing tags (order not handled here)
  if (!hasViewport) {
    head.prepend('<meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1.0"/>');
  }
  if (!hasMsoConditional && !msoexist) {
    head.prepend('<!--[if mso]><meta http-equiv="X-UA-Compatible" content="IE=edge" /><![endif]-->');
    console.log("Test");
    
    msoexist=true;
  }
  if (!hasHttpEquiv) {
    head.prepend('<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>');
  }

  // Now reorder as before:
  // reload contents after prepend:
  const updatedChildren = head.contents().toArray();

  let titleEl = null;
  let metaHttpEquiv = null;
  let msoConditional = null;
  let metaViewport = null;
  const styleEls = [];

  for (const node of updatedChildren) {
    if (node.type === "tag") {
      const $node = $(node);
      const tagName = node.name.toLowerCase();

      if (tagName === "title") {
        titleEl = node;
      } else if (tagName === "meta" && $node.attr("http-equiv")?.toLowerCase() === "content-type") {
        metaHttpEquiv = node;
      } else if (tagName === "meta" && $node.attr("name")?.toLowerCase() === "viewport") {
        metaViewport = node;
      } else if (tagName === "style") {
        styleEls.push(node);
      }
    } else if (node.type === "comment" && node.data.includes("[if mso]")) {
      msoConditional = node;
    }
  }

  head.empty();

  if (titleEl) head.append(titleEl);
  if (metaHttpEquiv) head.append(metaHttpEquiv);
  if (msoConditional) head.append(`<!--${msoConditional.data}-->`);
  if (metaViewport) head.append(metaViewport);
  for (const style of styleEls) head.append(style);

  // Append anything else not already appended
  for (const node of updatedChildren) {
    if (!head.contents().toArray().includes(node)) {
      head.append(node);
    }
  }



    $('table.line').each((_, table) => {
    const $table = $(table);
    const $outerTd = $table.closest('td');

    if ($outerTd.length) {
      const style = $outerTd.attr('style');
      if (style) {
        // Remove width from style string using regex
        const cleanedStyle = style
          .replace(/(?:\s*;)?\s*width\s*:\s*[^;]+;?/gi, '') // remove width
          .replace(/;;+/g, ';') // remove double semicolons
          .trim()
          .replace(/^;|;$/g, ''); // remove leading/trailing semicolon

        if (cleanedStyle) {
          $outerTd.attr('style', cleanedStyle);
        } else {
          $outerTd.removeAttr('style');
        }
      }
    }
  });
   const styleIndex = head.contents().toArray().findIndex(el => el.tagName === 'style');

  if (styleIndex === -1) return; // No <style> found

  head.contents().each((i, el) => {
    if (
      i > styleIndex &&
      el.type === 'comment' &&
      el.data.includes('[if mso]') &&
      el.data.includes('http-equiv="X-UA-Compatible"')
    ) {
      $(el).remove();
    }
  });
    $('[style]').each((_, el) => {
    const $el = $(el);
    let style = $el.attr('style') || '';

    style = style.trim();
    if (style && !style.endsWith(';')) {
      style += ';';
      $el.attr('style', style);
    }
  });

}
module.exports = { temp };
