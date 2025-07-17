const vscode = require('vscode');
const { transformHtml } = require('./steps/main-step');
const { formatInlineCss } = require('./formatcss');
const beautify = require('js-beautify').html;
const cheerio = require('cheerio');
const he = require('he');
/**
 * Minify CSS inside <style type="text/css">...</style>
 */


/**
 * Called on save of a `.nl.html` file
 * @param {vscode.TextDocument} doc
 */
async function compile(doc) {
	const filePath = doc.fileName;
	const originalHtml = doc.getText();
	const newFilePath = filePath
	.replace(/-nl\.html$/, '.html')
	.replace(/config/, 'template');

	const $ = cheerio.load(originalHtml, { xmlMode: true });
	const transformedHtml = transformHtml($, originalHtml);
	const decodedhtml = he.decode(transformedHtml);

	const beautifiedHtml = beautify(decodedhtml, {
		indent_size: 4,
		indent_with_tabs: true,
		max_preserve_newlines: 1,
		preserve_newlines: false,
		selector_separator_newline: false
	});

	const finalHtml = formatInlineCss(beautifiedHtml); // 🧠 second pass: minify CSS

	const newBuffer = Buffer.from(finalHtml, 'utf8');
	await vscode.workspace.fs.writeFile(vscode.Uri.file(newFilePath), newBuffer);

	vscode.window.showInformationMessage(`File saved: ${newFilePath}`);
}

module.exports = {
	compile
};



// const vscode = require('vscode');
// const { transformHtmlBody, transformHtmlHead } = require('./steps/main-step'); // Adjust exports accordingly
// const beautify = require('js-beautify').html;
// const cheerio = require('cheerio');
// const he = require('he');

// /**
//  * Called on save of a `.nl.html` file
//  * @param {vscode.TextDocument} doc
//  */
// async function compile(doc) {
//   const filePath = doc.fileName;
//   const originalHtml = doc.getText();
//   const newFilePath = filePath.replace(/\.nl\.html$/, '.html');

//   // Split head and body content from original HTML
//   const headMatch = originalHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
//   const bodyMatch = originalHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

//   const headContent = headMatch ? headMatch[1] : '';
//   const bodyContent = bodyMatch ? bodyMatch[1] : '';

//   // Load and transform body WITH xmlMode
//   const $body = cheerio.load(bodyContent, { xmlMode: true });
//   // Pass $body and any other needed params to your custom transform function
//   // Assume transformHtmlBody returns any variables you want to pass to head processing and also mutates $body
//   const bodyVars = transformHtmlBody($body);

//   // Load and transform head WITHOUT xmlMode
//   const $head = cheerio.load(headContent, { xmlMode: false });
//   // Pass $head and bodyVars to your head transform function
//   transformHtmlHead($head, bodyVars);

//   // Serialize transformed parts back to strings
//   const newHeadContent = $head.html();
//   const newBodyContent = $body.html();

//   // Merge back into original HTML structure (replace only inner content of head and body)
//   let finalHtml = originalHtml;
//   if (headMatch) {
//     finalHtml = finalHtml.replace(/(<head[^>]*>)[\s\S]*?(<\/head>)/i, `$1${newHeadContent}$2`);
//   }
//   if (bodyMatch) {
//     finalHtml = finalHtml.replace(/(<body[^>]*>)[\s\S]*?(<\/body>)/i, `$1${newBodyContent}$2`);
//   }

//   // Decode HTML entities to avoid &apos; etc.
//   const decodedHtml = he.decode(finalHtml);

//   // Beautify final output
//   const formattedHtml = beautify(decodedHtml, {
//     indent_size: 4,
//     indent_with_tabs: true,
//     max_preserve_newlines: 1,
//     preserve_newlines: false,
//     selector_separator_newline: false
//   });

//   const newUri = vscode.Uri.file(newFilePath);
//   const newBuffer = Buffer.from(formattedHtml, 'utf8');
//   await vscode.workspace.fs.writeFile(newUri, newBuffer);

//   vscode.window.showInformationMessage(`File saved: ${newFilePath}`);
// }

// module.exports = {
//   compile
// };