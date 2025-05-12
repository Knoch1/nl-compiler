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
  // createheader($);
 
  

  
  // function convertDivs($el) {
  //   $el.children('div').each((_, child) => {
  //     convertDivs($(child)); // recurse first
  //   });
  
  //   const children = $el.children();
  //   const classAttr = $el.attr('class');
  //   const tableStyle = $el.attr('style') ? ` style="${$el.attr('style')}"` : '';
  
  //   function getStyledTd(child) {
  //     const $child = $(child);
  //     const tdStyle = $child.attr('style') ? ` style="${$child.attr('style')}"` : '';
  //     return `<td${tdStyle}>${$.html(child)}</td>`;
  //   }
  
  //   if ($el.hasClass('row')) {
  //     const cells = children.map((_, child) => getStyledTd(child)).get().join('');
  //     const table = `<table${tableStyle}><tr>${cells}</tr></table>`;
  //     $el.replaceWith(table);
  //   } else if ($el.hasClass('column')) {
  //     const rows = children.map((_, child) => `<tr>${getStyledTd(child)}</tr>`).get().join('');
  //     const table = `<table${tableStyle}>${rows}</table>`;
  //     $el.replaceWith(table);
  //   } else if (!classAttr) {
  //     if (children.length <= 1) {
  //       const content = children.length === 1 ? getStyledTd(children[0]) : '<td></td>';
  //       const table = `<table${tableStyle}><tr>${content}</tr></table>`;
  //       $el.replaceWith(table);
  //     } else {
  //       throw new Error(`Div without class has multiple children:\n${$.html($el)}`);
  //     }
  //   }
  // }
function convertDivs($el) {
  const TD_STYLE_PROPS = [
    'padding', 'color', 'font-size', 'line-height', 'text-align', 'vertical-align',
    'font-family', 'text-decoration', 'font-weight', 'height', 'width', 'border'
  ];
  const TABLE_STYLE_PROPS = ['background-color', 'margin', 'display', 'border-collapse'];

  // Recursively process inner divs
  $el.children('div').each((_, child) => {
    convertDivs($(child));
  });

  const children = $el.children();
  const classAttr = $el.attr('class') || '';

  // Helper to extract relevant styles from a style string
  function extractStyles(styleStr, allowedProps) {
    if (!styleStr) return '';
    return styleStr
      .split(';')
      .map(s => s.trim())
      .filter(Boolean)
      .filter(s => allowedProps.includes(s.split(':')[0].trim()))
      .join('; ');
  }

  // Extract table and td styles from the original div
  const originalStyle = $el.attr('style') || '';
  const tableStyleStr = extractStyles(originalStyle, TABLE_STYLE_PROPS);
  const tdStyleStr = extractStyles(originalStyle, TD_STYLE_PROPS);

  // Classes for <td> (row or column) are handled separately
  const tdClassAttr = classAttr.includes('row') || classAttr.includes('column') 
    ? ` class="${classAttr}"` 
    : '';

  // Extract other classes (non row/column) for <td>
  const otherClasses = classAttr.split(' ').filter(c => !['row', 'column'].includes(c)).join(' ');
  const extraClassForTd = otherClasses ? ` class="${otherClasses}"` : '';

  function getStyledTd(child) {
    const $child = $(child);
    const childStyle = $child.attr('style') || '';
    const childTdStyle = extractStyles(childStyle, TD_STYLE_PROPS);
    const combinedTdStyle = [tdStyleStr, childTdStyle].filter(Boolean).join('; ');
    return `<td${tdClassAttr}${extraClassForTd}${combinedTdStyle ? ` style="${combinedTdStyle}"` : ''}>${$.html(child)}</td>`;
  }

  let table = '';
  const tableStyleAttr = tableStyleStr ? ` style="${tableStyleStr}"` : '';

  if ($el.hasClass('row')) {
    const cells = children.map((_, child) => getStyledTd(child)).get().join('');
    table = `<table${tableStyleAttr}><tr>${cells}</tr></table>`;
  } else if ($el.hasClass('column')) {
    const rows = children.map((_, child) => `<tr>${getStyledTd(child)}</tr>`).get().join('');
    table = `<table${tableStyleAttr}>${rows}</table>`;
  } else if (!classAttr) {
    if (children.length <= 1) {
      const content = children.length === 1 ? getStyledTd(children[0]) : `<td${tdClassAttr}></td>`;
      table = `<table${tableStyleAttr}><tr>${content}</tr></table>`;
    } else {
      throw new Error(`Div without class has multiple children:\n${$.html($el)}`);
    }
  }

  if (table) {
    $el.replaceWith(table);
  }
}




  // function convertDivs($el) {
  //   const KEEP_IN_CHILD = [
  //     'padding',
  //     'text-align',
  //     'font-size',
  //     'margin',
  //     'line-height',
  //     'color',
  //     'text-decoration',
  //     'font-family'
  //   ];
  
  //   function parseStyle(styleStr) {
  //     return (styleStr || '')
  //       .split(';')
  //       .map(s => s.trim())
  //       .filter(Boolean)
  //       .reduce((acc, s) => {
  //         const [key, value] = s.split(':').map(x => x.trim());
  //         if (key) acc[key] = value;
  //         return acc;
  //       }, {});
  //   }
  
  //   function styleToString(styleObj) {
  //     return Object.entries(styleObj)
  //       .map(([key, value]) => `${key}: ${value}`)
  //       .join('; ');
  //   }
  
  //   $el.children('div').each((_, child) => {
  //     convertDivs($(child)); // recurse first
  //   });
  
  //   const children = $el.children();
  //   const classAttr = $el.attr('class');
  //   const tableStyle = $el.attr('style') ? ` style="${$el.attr('style')}"` : '';
  
  //   function getStyledTd(child) {
  //     const $child = $(child);
  //     const rawStyle = parseStyle($child.attr('style') || '');
  //     const keepInChild = {};
  //     const moveToTd = {};
  
  //     Object.entries(rawStyle).forEach(([key, value]) => {
  //       if (KEEP_IN_CHILD.includes(key)) {
  //         keepInChild[key] = value;
  //       } else {
  //         moveToTd[key] = value;
  //       }
  //     });
  
  //     // Apply cleaned styles
  //     $child.attr('style', styleToString(keepInChild));
  //     const tdStyleStr = styleToString(moveToTd);
  //     return `<td${tdStyleStr ? ` style="${tdStyleStr}"` : ''}>${$.html($child)}</td>`;
  //   }
  
  //   if ($el.hasClass('row')) {
  //     const cells = children.map((_, child) => getStyledTd(child)).get().join('');
  //     const table = `<table${tableStyle}><tr>${cells}</tr></table>`;
  //     $el.replaceWith(table);
  //   } else if ($el.hasClass('column')) {
  //     const rows = children.map((_, child) => `<tr>${getStyledTd(child)}</tr>`).get().join('');
  //     const table = `<table${tableStyle}>${rows}</table>`;
  //     $el.replaceWith(table);
  //   } else if (!classAttr) {
  //     if (children.length <= 1) {
  //       const content = children.length === 1 ? getStyledTd(children[0]) : '<td></td>';
  //       const table = `<table${tableStyle}><tr>${content}</tr></table>`;
  //       $el.replaceWith(table);
  //     } else {
  //       throw new Error(`Div without class has multiple children:\n${$.html($el)}`);
  //     }
  //   }
  // }
  



  // Run conversion
  $('body div').each((_, el) => convertDivs($(el)));
  
  
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


//   $('nl-comp').each((_, el) => {
//     const innerContent = $(el).html(); // Preserve what's inside <nl-comp>
//     console.log(innerContent);
    
//     const newHtml=`	<div align="center" style="width: ${width}px; margin: 0 auto; background-color: #ffffff;">
// 		<table align="center" style="width: ${width}px; margin: 0 auto; border-collapse: collapse; border-spacing: 0px; border: 0px; background-color: #ffffff; background-position: initial; background-repeat: initial;" border="0" cellpadding="0" cellspacing="0" width="${width}">
// 			<tbody>
// 				<tr style="padding: 0px; margin: 0px; border-spacing: 0; font-size: 0; mso-line-height-alt: 0; mso-margin-top-alt: 1px;">
// 					<td style="background-color: #ffffff; margin: 0;" align="center">
// 						<table width="${width}" style="width: ${width}px; max-width: ${width}px; margin: 0 auto; border-collapse: collapse; border-spacing: 0px; border: 0px; background-position: initial; background-repeat: initial;" border="0" cellpadding="0" cellspacing="0">
// 							<tbody>
// 								<tr>
// 									<td style="background-color: #ffffff; margin: 0; padding: 5px;" align="center">
// 										<p style="text-align: center; font-size: 11px; font-family: 'Verdana', 'Arial'; color: #000000; margin: 5px; padding: 15px;">Wird diese Nachricht nicht richtig dargestellt, klicken Sie bitte <a style="font-weight: bold; text-decoration: none; color: #000000;" href="${hreftop}">hier</a>.</p>
// 									</td>
// 								</tr>
// 							</tbody>
// 						</table>
// 					</td>
// 				</tr>
//         <tr style="padding: 0; margin: 0px; border-spacing: 0; font-size:0; mso-line-height-alt:0; mso-margin-top-alt:1px;">
//           <td>
//              ${innerContent}
//           </td>
//         </tr>
//         <tr style="padding: 0px; margin: 0px; border-spacing: 0; font-size: 0; mso-line-height-alt: 0; mso-margin-top-alt: 1px;">
// 					<td style="background-color: #ffffff; margin: 0;">
// 						<table width="${width}" style="width: ${width}px; max-width: ${width}px; margin: 0 auto; border-collapse: collapse; border-spacing: 0px; border: 0px; background-position: initial; background-repeat: initial;" border="0" cellpadding="0" cellspacing="0">
// 							<tbody>
// 								<tr>
// 									<td style="background-color: white; margin: 0; padding: 15px;">
// 										<p style="text-align: center; font-size: 11px; line-height: 21px; font-family: 'Verdana', 'Arial'; color: #000000; margin: 5px; padding: 0;"><a style="font-weight: bold; text-decoration: none; color: #000000;" href="${impressum}${tracing}">Impressum</a></p>
// 										<p style="text-align: center; font-size: 11px; font-family: 'Verdana', 'Arial'; color: #000000; margin: 5px; padding: 0;">Falls Sie keinen Newsletter mehr erhalten möchten, klicken Sie bitte auf <a style="font-weight: bold; text-decoration: none; color: #000000;" href="${hrefbottom}">diesen Link</a> und befolgen Sie die Anweisungen.</p>
// 									</td>
// 								</tr>
// 							</tbody>
// 						</table>
// 					</td>
// 				</tr>
// 			</tbody>
// 		</table>
// 	</div>`;
//   $(el).replaceWith(newHtml);
// });
  // $('nl-comp').remove();
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