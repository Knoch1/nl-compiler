const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function handleNlHtmlCreation(uri) {
  const filePath = uri.fsPath;
  const dirPath = path.dirname(filePath);
  const nlcompPath = path.join(dirPath, '.nlcomp');

  if (!fs.existsSync(nlcompPath)) {
    fs.mkdirSync(nlcompPath);
  }

  const cssPath = path.join(nlcompPath, 'style.css');
  const jsonPath = path.join(nlcompPath, 'nlconf.json');
  if (!fs.existsSync(cssPath)) {
    fs.writeFileSync(cssPath, '.justify-center {\ndisplay:flex;\njustify-content:center;\n}\n.justify-end {\ndisplay:flex;\njustify-content:end;\n}\n.justify-start {\ndisplay: flex;\njustify-content: start;\n}\n.space-between {\ndisplay:flex;\njustify-content:space-between;\n}\n.space-around {\ndisplay:flex;\njustify-content:space-around;\n}\n.align-center {\ndisplay:flex;\nalign-items:center;\n}\n.align-end {\ndisplay: flex;\nalign-items:end;\n}\n.align-start {\ndisplay:flex;\nalign-items:start;\n}\n.column {\ndisplay:flex;\nflex-direction:column;\n}\n.row {\ndisplay:flex;\nflex-direction:row;\n}\n');
  }
  if(!fs.existsSync(jsonPath)) {
    fs.writeFileSync(jsonPath,'')
  }
}

module.exports = {
  handleNlHtmlCreation
};
