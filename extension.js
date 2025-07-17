const vscode = require('vscode');
const { init } = require('./src/init');
const { compile } = require('./src/main');

function activate(context) {
  vscode.window.showInformationMessage("NL-Compiler ready")
  const watcher = vscode.workspace.createFileSystemWatcher('**/config-*-nl.html');
  watcher.onDidCreate((uri) => {
    init(uri);
  });

  context.subscriptions.push(watcher);

  const saveListener = vscode.workspace.onDidSaveTextDocument((doc) => {
    if (doc.fileName.endsWith('-nl.html')) {
      compile(doc);
    }
  });
  context.subscriptions.push(saveListener);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
