const vscode = require('vscode');
const path = require('path');

async function init(uri) {
  const filePath = uri.fsPath;
  const fileName = path.basename(filePath, '.nl.html');
  const htmlUri = vscode.Uri.file(filePath);
  const edit = new vscode.WorkspaceEdit();
  const stats = await vscode.workspace.fs.stat(htmlUri);
  if (stats.size === 0) {
    const htmlTemplate = Buffer.from(`
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
  <title>${fileName}</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<!--[if mso]>
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<![endif]-->
	<meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1.0"/>

</head>
<body>
  <nl-comp src="" href="" lang="" width="" href-top="" href-bottom="">
  </nl-comp>
</body>
</html>`, 'utf8');
    await vscode.workspace.fs.writeFile(htmlUri, htmlTemplate);
  }

  // Apply any pending edits (like folder creation)
  await vscode.workspace.applyEdit(edit);
}

module.exports = {
  init
};


