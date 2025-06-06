function convertAllDivs($, $root) {
  const divs = $root.find('div').addBack('div').get().reverse(); // Get all divs, innermost first
  divs.forEach(div => convertDiv($, $(div)));
}

function convertDiv($, $el) {
  const TD_STYLES = [
    'padding', 'color', 'font-size', 'line-height', 'text-align', 'vertical-align',
    'font-family', 'text-decoration', 'font-weight', 'height', 'width', 'border'
  ];
  const TABLE_STYLES = ['background-color', 'margin', 'display', 'border-collapse'];

  const classAttr = $el.attr('class') || '';
  const styleAttr = $el.attr('style') || '';
  const children = $el.contents();

  const tableStyles = extractStyles(styleAttr, TABLE_STYLES);
  const tdBaseStyles = extractStyles(styleAttr, TD_STYLES);

  const tableStyleAttr = tableStyles ? ` style="${tableStyles}"` : '';
  const tableClassAttr = classAttr ? ` class="${classAttr}"` : '';

  function extractStyles(styleStr, allowedProps) {
    return (styleStr || '')
      .split(';')
      .map(s => s.trim())
      .filter(Boolean)
      .filter(s => allowedProps.includes(s.split(':')[0].trim()))
      .join('; ');
  }

  function wrapInTd(child) {
    if (child.type === 'comment') return `<!--${child.data}-->`;

    const $child = $(child);
    const childStyle = $child.attr('style') || '';
    const tdStyles = [tdBaseStyles, extractStyles(childStyle, TD_STYLES)]
      .filter(Boolean)
      .join('; ');
    const styleAttr = tdStyles ? ` style="${tdStyles}"` : '';

    return `<td${styleAttr}>${$.html(child)}</td>`;
  }

  function wrapInTr(tdContent) {
    return `<tr>${tdContent}</tr>`;
  }

  let tableHtml = '';

  if ($el.hasClass('row')) {
    const tds = children.toArray().filter(n => n.type === 'tag').map(wrapInTd).join('');
    tableHtml = `<table${tableClassAttr}${tableStyleAttr}>${wrapInTr(tds)}</table>`;
  } else if ($el.hasClass('column')) {
    const rows = children.toArray()
      .filter(n => n.type === 'tag' || (n.type === 'text' && n.data.trim() !== '') || n.type === 'comment')
      .map(child => wrapInTr(wrapInTd(child)))
      .join('');
    tableHtml = `<table${tableClassAttr}${tableStyleAttr}>${rows}</table>`;
  } else {
    const content = wrapInTd(children);
    tableHtml = `<table${tableClassAttr}${tableStyleAttr}>${wrapInTr(content)}</table>`;
  }

  if (tableHtml) {
    $el.replaceWith(tableHtml);
  }
}

module.exports = { convertAllDivs };



