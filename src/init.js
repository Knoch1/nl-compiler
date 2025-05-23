// const fs = require('fs');
// const path = require('path');

// function init(uri) {
//   console.log("");
//   const filePath = uri.fsPath;
//   const dirPath = path.dirname(filePath);
//   const nlcompPath = path.join(dirPath, '.nlcomp');
//   const fileName = path.basename(filePath, '.nl.html');

//   // Delay to let VS Code properly create the file
//   setTimeout(() => {
//     try {
//       // Create .nlcomp folder
//       if (!fs.existsSync(nlcompPath)) {
//         fs.mkdirSync(nlcompPath);
//       }

//       // Create style.css
//       const cssPath = path.join(nlcompPath, 'style.css');
//       if (!fs.existsSync(cssPath)) {
//         fs.writeFileSync(cssPath,
// `.justify-center { display: flex; justify-content: center; }
// .justify-end { display: flex; justify-content: end; }
// .justify-start { display: flex; justify-content: start; }
// .space-between { display: flex; justify-content: space-between; }
// .space-around { display: flex; justify-content: space-around; }
// .align-center { display: flex; align-items: center; }
// .align-end { display: flex; align-items: end; }
// .align-start { display: flex; align-items: start; }
// .column { display: flex; flex-direction: column; }
// .row { display: flex; flex-direction: row; }
// `);
//       }

//       // Create nlconf.json
//       const jsonPath = path.join(nlcompPath, 'nlconf.json');
//       if (!fs.existsSync(jsonPath)) {
//         fs.writeFileSync(jsonPath, '');
//       }

//       // Insert HTML only if file is empty
//       if (fs.existsSync(filePath) && fs.statSync(filePath).size === 0) {
//         const htmlTemplate = `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>${fileName}</title>
//   <link rel="stylesheet" href="./.nlcomp/style.css">
// </head>
// <body>
//   <nl-comp src="" href="" lang="" width="">
//   </nl-comp>
// </body>
// </html>`;
//         fs.writeFileSync(filePath, htmlTemplate);
//       }

//     } catch (err) {
//       console.error('❌ Error during init:', err);
//     }
//   }, 100); // Delay to ensure file exists properly
// }

// module.exports = {
//   init
// };



const vscode = require('vscode');
const path = require('path');

async function init(uri) {
  const filePath = uri.fsPath;
  // const dirPath = path.dirname(filePath);
  const fileName = path.basename(filePath, '.nl.html');

  // const nlcompUri = vscode.Uri.file(path.join(dirPath, '.nlcomp'));
  // const cssUri = vscode.Uri.joinPath(nlcompUri, 'style.css');
  // const jsonUri = vscode.Uri.joinPath(nlcompUri, 'nlconf.json');
  const htmlUri = vscode.Uri.file(filePath);

  const edit = new vscode.WorkspaceEdit();

  // // 1. Create `.nlcomp` folder if it doesn't exist
  // try {
  //   await vscode.workspace.fs.stat(nlcompUri);
  // } catch {
  //   edit.createFile(nlcompUri, { folder: true });
  // }

//   // 2. Create `style.css` if it doesn't exist
//   try {
//     await vscode.workspace.fs.stat(cssUri);
//   } catch {
//     const cssContent = Buffer.from(`
// .justify-center { display: flex; justify-content: center; }
// .justify-end { display: flex; justify-content: end; }
// .justify-start { display: flex; justify-content: start; }
// .space-between { display: flex; justify-content: space-between; }
// .space-around { display: flex; justify-content: space-around; }
// .align-center { display: flex; align-items: center; }
// .align-end { display: flex; align-items: end; }
// .align-start { display: flex; align-items: start; }
// .column { display: flex; flex-direction: column; }
// .row { display: flex; flex-direction: row; }
// `, 'utf8');
//     await vscode.workspace.fs.writeFile(cssUri, cssContent);
//   }

  // 3. Create `nlconf.json` if not exists
  // try {
  //   await vscode.workspace.fs.stat(jsonUri);
  // } catch {
  //   const emptyContent = Buffer.from('', 'utf8');
  //   await vscode.workspace.fs.writeFile(jsonUri, emptyContent);
  // }

  // 4. Inject boilerplate into .nl.html if file is empty
  const stats = await vscode.workspace.fs.stat(htmlUri);
  if (stats.size === 0) {
    const htmlTemplate = Buffer.from(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName}</title>
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


