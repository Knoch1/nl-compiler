// const {createheader} = require('./create-header');
function transformHtml($) {
  // Example transformation: Modify <nl-comp> tags
  function nlcompData(attribute) {
    const value = $('nl-comp').attr(attribute);
    return value !== undefined ? value : '';
  }
  const width = nlcompData('width');
  const hreftop = nlcompData('href-top');
  const hrefbottom = nlcompData('href-bottom');
  const src=nlcompData('src');
  const href=nlcompData('href');
  const impressum = nlcompData('impressum');
  const tracing = nlcompData('tracing');
  const lang = nlcompData('lang');
//   // createheader($);
 
  

//   function convertDivs($el) {
//     const TD_STYLE_PROPS = [
//       'padding', 'color', 'font-size', 'line-height', 'text-align', 'vertical-align',
//       'font-family', 'text-decoration', 'font-weight', 'height', 'width', 'border'
//     ];
//   const TABLE_STYLE_PROPS = ['background-color', 'margin', 'display', 'border-collapse'];

//   // Recursively process inner divs
//   $el.children('div').each((_, child) => {
//     convertDivs($(child));
//   });

// const children = $el.contents(); // includes comments, text, and elements
//   const classAttr = $el.attr('class') || '';

//   // Helper to extract relevant styles from a style string
//   function extractStyles(styleStr, allowedProps) {
//     if (!styleStr) return '';
//     return styleStr
//       .split(';')
//       .map(s => s.trim())
//       .filter(Boolean)
//       .filter(s => allowedProps.includes(s.split(':')[0].trim()))
//       .join('; ');
//   }

//   // Extract table and td styles from the original div
//   const originalStyle = $el.attr('style') || '';
//   const tableStyleStr = extractStyles(originalStyle, TABLE_STYLE_PROPS);
//   const tdStyleStr = extractStyles(originalStyle, TD_STYLE_PROPS);

//   // Classes for <td> (row or column) are handled separately
//   const tdClassAttr = classAttr.includes('row') || classAttr.includes('column') 
//     ? ` class="${classAttr}"` 
//     : '';

//   // Extract other classes (non row/column) for <td>
//   const otherClasses = classAttr.split(' ').filter(c => !['row', 'column'].includes(c)).join(' ');
//   const extraClassForTd = otherClasses ? ` class="${otherClasses}"` : '';

//   function getStyledTd(child) {
//     const $child = $(child);
//     const childStyle = $child.attr('style') || '';
//     const childTdStyle = extractStyles(childStyle, TD_STYLE_PROPS);
//     const combinedTdStyle = [tdStyleStr, childTdStyle].filter(Boolean).join('; ');
//     return `<td${tdClassAttr}${extraClassForTd}${combinedTdStyle ? ` style="${combinedTdStyle}"` : ''}>${$.html(child)}</td>`;
//   }

//   let table = '';
//   const tableStyleAttr = tableStyleStr ? ` style="${tableStyleStr}"` : '';

//   if ($el.hasClass('row')) {
//     const cells = children.map((_, child) => getStyledTd(child)).get().join('');
//     table = `<table${tableStyleAttr}><tr>${cells}</tr></table>`;
//   } else if ($el.hasClass('column')) {
//     const rows = children.map((_, child) => `<tr>${getStyledTd(child)}</tr>`).get().join('');
//     table = `<table${tableStyleAttr}>${rows}</table>`;
//   } else if (!classAttr) {
//     if (children.length <= 1) {
//       const content = children.length === 1 ? getStyledTd(children[0]) : `<td${tdClassAttr}></td>`;
//       table = `<table${tableStyleAttr}><tr>${content}</tr></table>`;
//     } else {
//       throw new Error(`Div without class has multiple children:\n${$.html($el)}`);
//     }
//   }

//   if (table) {
//     $el.replaceWith(table);
//   }
// }
function convertDivs($el) {
  const TD_STYLES = [
    'padding', 'color', 'font-size', 'line-height', 'text-align', 'vertical-align',
    'font-family', 'text-decoration', 'font-weight', 'height', 'width', 'border'
  ];
  const TABLE_STYLES = ['background-color', 'margin', 'display', 'border-collapse'];

  const classAttr = $el.attr('class') || '';
  const styleAttr = $el.attr('style') || '';
  const children = $el.contents(); // includes elements, text, comments
  const elementChildren = $el.children(); // just element nodes

  // Recursively convert nested divs
  $el.children('div').each((_, child) => convertDivs($(child)));

  const tableStyles = extractStyles(styleAttr, TABLE_STYLES);
  const tdBaseStyles = extractStyles(styleAttr, TD_STYLES);

  const tableStyleAttr = tableStyles ? ` style="${tableStyles}"` : '';
  const tdClassAttr = getTdClassAttr(classAttr);
  const extraTdClass = getExtraTdClass(classAttr);

  function extractStyles(styleStr, allowedProps) {
    return (styleStr || '')
      .split(';')
      .map(s => s.trim())
      .filter(Boolean)
      .filter(s => allowedProps.includes(s.split(':')[0].trim()))
      .join('; ');
  }

  function getTdClassAttr(classStr) {
    return classStr.includes('row') || classStr.includes('column')
      ? ` class="${classStr}"`
      : '';
  }

  function getExtraTdClass(classStr) {
    const extra = classStr
      .split(' ')
      .filter(c => !['row', 'column'].includes(c))
      .join(' ');
    return extra ? ` class="${extra}"` : '';
  }

  function wrapInTd(child) {
    if (child.type === 'comment') return `<!--${child.data}-->`;

    const $child = $(child);
    const childStyle = $child.attr('style') || '';
    const tdStyles = [tdBaseStyles, extractStyles(childStyle, TD_STYLES)]
      .filter(Boolean)
      .join('; ');
    const styleAttr = tdStyles ? ` style="${tdStyles}"` : '';

    return `<td${tdClassAttr}${extraTdClass}${styleAttr}>${$.html(child)}</td>`;
  }

  function wrapInTr(tdContent) {
    return `<tr>${tdContent}</tr>`;
  }

  let tableHtml = '';

  if ($el.hasClass('row')) {
    const tds = children.toArray().map(wrapInTd).join('');
    tableHtml = `<table${tableStyleAttr}>${wrapInTr(tds)}</table>`;
  } else if ($el.hasClass('column')) {
    const rows = children.toArray().map(child => wrapInTr(wrapInTd(child))).join('');
    tableHtml = `<table${tableStyleAttr}>${rows}</table>`;
  } else if (!classAttr) {
    if (elementChildren.length <= 1) {
      const content = elementChildren.length === 1
        ? wrapInTd(elementChildren[0])
        : `<td${tdClassAttr}></td>`;
      tableHtml = `<table${tableStyleAttr}>${wrapInTr(content)}</table>`;
    } else {
      throw new Error(`Div without class has multiple children:\n${$.html($el)}`);
    }
  }

  if (tableHtml) {
    $el.replaceWith(tableHtml);
  }
}






// Run conversion
  $('body div').each((_, el) => convertDivs($(el)));

$('.row').removeClass('row');
$('.column').removeClass('column');
function removeEmptyClassAttr($el) {
  const classAttr = $el.attr('class');
  if (!classAttr || !classAttr.trim()) {
    $el.removeAttr('class');
  }
}

$('table, td').each((_, el) => {
  removeEmptyClassAttr($(el));
});

  $("tr").attr(
    "style",
    "padding: 0px; margin: 0px; border-spacing: 0; font-size:0; mso-line-height-alt:0; mso-margin-top-alt:1px;"
  );
  // function tableattributes(){

  //   $('table').each((_, el) => {
  //     const $el = $(el);
  //     if (!$el.attr('width')) $el.attr('width', '100%');
  //     if (!$el.attr('border')) $el.attr('border', '0');
  //     if (!$el.attr('cellpadding')) $el.attr('cellpadding', '0');
  //     if (!$el.attr('cellspacing')) $el.attr('cellspacing', '0');
  //   });
  // }
  // tableattributes();


function normalizeTables($root) {
  $root.find('table').each((_, table) => {
    const $table = $(table);

    // Set missing attributes
    if (!$table.attr('width')) $table.attr('width', '100%');
    if (!$table.attr('border')) $table.attr('border', '0');
    if (!$table.attr('cellpadding')) $table.attr('cellpadding', '0');
    if (!$table.attr('cellspacing')) $table.attr('cellspacing', '0');

    // Ensure required default inline styles are included
    const requiredStyles = {
      width: '100%',
      margin: '0',
      padding: '0',
      'border-collapse': 'collapse'
    };

    const currentStyleStr = $table.attr('style') || '';
    const styleObj = {};

    // Convert current styles into a key-value object
    currentStyleStr.split(';').forEach(rule => {
      const [key, value] = rule.split(':').map(s => s && s.trim());
      if (key && value) styleObj[key] = value;
    });

    // Add missing default styles
    for (const [key, value] of Object.entries(requiredStyles)) {
      if (!styleObj.hasOwnProperty(key)) {
        styleObj[key] = value;
      }
    }

    // Rebuild style string
    const newStyleStr = Object.entries(styleObj)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');

    $table.attr('style', newStyleStr);
  });
}
normalizeTables($('body')); 


  $('nl-comp').each((_, el) => {
    const innerContent = $(el).html(); // Preserve what's inside <nl-comp>
    
    const newHtml=`	<div align="center" style="width: ${width}px; margin: 0 auto; background-color: #ffffff;">
		<table align="center" style="width: ${width}px; margin: 0 auto; border-collapse: collapse; border-spacing: 0px; border: 0px; background-color: #ffffff; background-position: initial; background-repeat: initial;" border="0" cellpadding="0" cellspacing="0" width="${width}">
			<tbody>
				<tr style="padding: 0px; margin: 0px; border-spacing: 0; font-size: 0; mso-line-height-alt: 0; mso-margin-top-alt: 1px;">
					<td style="background-color: #ffffff; margin: 0;" align="center">
						<table width="${width}" style="width: ${width}px; max-width: ${width}px; margin: 0 auto; border-collapse: collapse; border-spacing: 0px; border: 0px; background-position: initial; background-repeat: initial;" border="0" cellpadding="0" cellspacing="0">
							<tbody>
								<tr>
									<td style="background-color: #ffffff; margin: 0; padding: 5px;" align="center">
										<p style="text-align: center; font-size: 11px; font-family: Verdana,Arial; color: #000000; margin: 5px; padding: 15px;">${lang=="de"?"Wird diese Nachricht nicht richtig dargestellt, klicken Sie bitte ":""}${lang=="en"?"If this message is not displayed properly, click ":""}${lang=="it"?"Se non riesci a visualizzare correttamente questa e-mail, clicca ":""} <a style="font-weight: bold; text-decoration: none; color: #000000;" href="${hreftop}">${lang=="de"?"hier":""}${lang=="en"?"here":""}${lang=="it"?"qui":""}</a>${lang=="en"?"please":""}.</p>
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
        <tr style="padding: 0; margin: 0px; border-spacing: 0; font-size:0; mso-line-height-alt:0; mso-margin-top-alt:1px;">
          <td width="${width}" style="background-color: #ffffff; margin: 0; padding: 0; width: ${width}px; max-width: ${width}px;" align="center">
             ${innerContent}
          </td>
        </tr>
        <tr style="padding: 0px; margin: 0px; border-spacing: 0; font-size: 0; mso-line-height-alt: 0; mso-margin-top-alt: 1px;">
					<td style="background-color: #ffffff; margin: 0;">
						<table width="${width}" style="width: ${width}px; max-width: ${width}px; margin: 0 auto; border-collapse: collapse; border-spacing: 0px; border: 0px; background-position: initial; background-repeat: initial;" border="0" cellpadding="0" cellspacing="0">
							<tbody>
								<tr>
									<td style="background-color: white; margin: 0; padding: 15px;">
										<p style="text-align: center; font-size: 11px; line-height: 21px; font-family: Verdana, Arial; color: #000000; margin: 5px; padding: 0;"><a style="font-weight: bold; text-decoration: none; color: #000000;" href="${impressum}${tracing}">${lang=="de"?"Impressum":"Colophon"}</a></p>
										<p style="text-align: center; font-size: 11px; font-family: Verdana, Arial; color: #000000; margin: 5px; padding: 0;">${lang=="de"?"Falls Sie keinen Newsletter mehr erhalten möchten, klicken Sie bitte auf ":""}${lang=="it"?"Se non riesci a visualizzare correttamente questa e-mail, clicca ":""}${lang=="en"?"You can always unsubscribe yourself from our newsletter list. Please click on ":""}<a style="font-weight: bold; text-decoration: none; color: #000000;" href="${hrefbottom}">${lang=="de"?"diesen Link":""}${lang=="en"?"this link":""}${lang=="it"?"questo link":""}</a> ${lang=="de"?"und befolgen Sie die Anweisungen":""}${lang=="en"?"and follow the instructions":""}${lang=="it"?"e segui le istruzioni":""}.</p>
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</tbody>
		</table>
	</div>`;
  $(el).replaceWith(newHtml);
});
  $('nl-comp').remove();
  function applyBackgroundColor($, excludedElements = []) {
    
    function propagateBackgroundColor(element, parentBgColor) {
      const $element = $(element);
      let currentBgColor = $element.css('background-color');
  
      if (!excludedElements.includes($element[0].tagName)) {
        if (!currentBgColor || currentBgColor === 'transparent' || currentBgColor === 'rgba(0, 0, 0, 0)') {
          if (parentBgColor) {
            $element.css('background-color', parentBgColor);
          }
        } else {
          parentBgColor = currentBgColor;
        }
      }  
      $element.children().each((_, child) => propagateBackgroundColor(child, parentBgColor));
    }
    
    $('body').children().each((_, element) => propagateBackgroundColor(element, null));
  }
  applyBackgroundColor($,['br','tr','tbody','span'])
  return $.html();
}

module.exports = { transformHtml }; 