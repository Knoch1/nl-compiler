const vscode = require('vscode');
const { handleNlHtmlCreation } = require('./src/nlcomp');

function activate(context) {
  const watcher = vscode.workspace.createFileSystemWatcher('**/*.nl.html');

  watcher.onDidCreate(handleNlHtmlCreation);

  context.subscriptions.push(watcher);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
