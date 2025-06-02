// main.js (or extension.js)

const vscode = require('vscode');
const { transformHtml } = require('./steps/main-step'); // Import the transformation function
const beautify = require('js-beautify').html;
const cheerio = require('cheerio');
/**
 * Called on save of a `.nl.html` file
 * @param {vscode.TextDocument} doc
 */
async function compile(doc) {
  
  const filePath = doc.fileName;
  const originalHtml = doc.getText();
  const newFilePath = filePath.replace(/\.nl\.html$/, '.html');
  const $ = cheerio.load(originalHtml,{ xmlMode: true });
  const transformedHtml = transformHtml($,originalHtml); // ✅ Returns a string

  const newUri = vscode.Uri.file(newFilePath);
  const formattedHtml = beautify(transformedHtml, { // ✅ Use transformedHtml here
    indent_size: 4,
    max_preserve_newlines: 1,
    preserve_newlines: true,
  });

  const newBuffer = Buffer.from(formattedHtml, 'utf8');
  await vscode.workspace.fs.writeFile(newUri, newBuffer);

  vscode.window.showInformationMessage(`File saved: ${newFilePath}`);
}

module.exports = {
  compile
};
