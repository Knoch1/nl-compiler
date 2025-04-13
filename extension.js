const vscode = require('vscode');
const { init } = require('./src/init');

function activate(context) {
  const watcher = vscode.workspace.createFileSystemWatcher('**/*.nl.html');
  watcher.onDidCreate(init);

  context.subscriptions.push(watcher);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
