# NL-Compiler – VS Code Extension

**NL-Compiler** is a Visual Studio Code extension that lets you write simplified HTML markup, which it compiles into production-ready HTML for newsletters. Designed to save time and reduce boilerplate, it transforms basic syntax into table-based HTML that's compatible with email clients.

---

## 🚀 Features

- Compile simplified HTML into full, email-ready HTML templates
- Triggered on file save (`config-<lang>-nl.html`)
- Outputs a `template-<lang>.html` in the same folder
- Support for constants via `<nl-comp>` element (for links, image paths, tracking codes, etc.)

---

## 📦 Installation

1. Download the latest `.vsix` release from [GitHub Releases](https://github.com/Knoch1/nl-compiler/releases).
2. Install via command line:

   ```bash
   code --install-extension nl-compiler-<version>.vsix
   ```
3. If you’re updating and the installation fails, add the --force flag:

	```bash
	code --install-extension nl-compiler-<version>.vsix --force
	```

	Works on macOS, Linux and Windows

## ⚙️ Activation

1. Create a file named:  
   `config-<lang>-nl.html`  
   Example: `config-de-nl.html`  
   (You can replace `<lang>` with any language code, but the suffix `-nl.html` is required.)

2. On saving this file, the extension will:
   - Run the compiler
   - Generate `template-<lang>.html` in the same folder
   - Inject a basic `<nl-comp>` config block if it's missing

---

## 🛠 Extension Settings

This extension does not provide custom settings.  
You can enable, disable, or uninstall it via the **Extensions** panel in VS Code.

---

## 🧪 Known Issues

Most known issues have been resolved.  
If you encounter a bug or unexpected behavior, please open an issue on [GitHub](https://github.com/Knoch1/nl-compiler/issues).

---

## 📝 Release Notes

### 1.0.1
- Fixed formatting and attribute ordering in output HTML.

### 1.0.0
- Initial release.

---

## 📚 Manual

### 💡 Overview

This extension replaces repetitive `<table>`, `<tr>`, and `<td>` markup with a simpler syntax, making newsletter development up to **3× faster**.

---

### 📄 Getting Started

```html
<!-- File: config-de-nl.html -->
<nl-comp
	href="https://example.com"
	src="https://cdn.example.com/images"
	href-top="https://example.com" 
	href-bottom="https://example.com"
	lang="de it or en"
	impressum="https://example.com/impressum"
	tracing="?utm_source=newsletter"
	title="Weekly Update"
	alt="Default Alt Text"
	width="700px"
	style="color:#3A3A3A">

 	<a href="$/welcome">Visit Us</a>
	<img src="$/header.png">
</nl-comp>


```

### 🔧 `<nl-comp>` Attributes

| Attribute         | Description |
|------------------|-------------|
| `href`           | Replaces `$` in all `<a href>` attributes. Example: `$/page` → `https://your-link.com/page`. |
| `src`            | Same as `href`, but for `<img src>` or other `src` attributes. |
| `tracing`        | Appends tracking info to links ending with `$`. Example: `href="$/"` → `https://example.com/?utm_source=newsletter`. |
| `title`          | Adds a `title` to `<a>` tags if not already set. Falls back to the document `<title>`. |
| `alt`            | Adds `alt` text to `<img>` tags if not already set. Falls back to the document `<title>`. |
| `width`          | Sets the fixed width of the generated newsletter layout. Default is `600px`. |

#### Additional Attributes

| Attribute          | Description |
|-------------------|-------------|
| `lang`            | Changes the language used in the top and bottom sections of the newsletter. |
| `href-top`        | Sets the link for the "view in browser" message shown at the top of the email. |
| `href-bottom`     | Sets the unsubscribe link shown at the bottom of the email. |
| `impressum`       | Inserts legal footer (impressum) text into the bottom section. |
| `nl-color`        | Changes the text color of the top and bottom sections only. |
| `background-color`| Changes the background color of the top and bottom sections only. |
| `link-color`      | Changes the color of links in the top and bottom sections only. |
| `style`           | *(Experimental)* Inline override for global styles in the `<style>` block. Supports: `font-size`, `color`, `font-family`, `font-weight`, `line-height`. |


### 🧱 Structure of the Program

All content should be written **inside the `<nl-comp>` element**. You can use `<div>` elements for layout, or fall back to traditional `<table>`, `<tr>`, or `<td>` elements if needed — though using `<div>` is preferred.

#### Supported `<div>` Classes

| Class         | Description |
|---------------|-------------|
| `div.column`  | Arranges its children in a vertical layout using `<tr>`, placing elements one below the other. |
| `div.row`     | Arranges its children in a horizontal layout using `<td>`, placing elements side by side. |
| `div.button`  | Creates a styled button. It applies all inline or class-based styles from the `div` to the rendered button. |
| `div.line`    | Generates a horizontal divider (a straight line). |
| `div.main`    | Treats each direct child as a module and wraps it in a container. This allows modular layout and styling. |

---

## ⚠️ Warning

**Do not place `div.main` directly inside a `div.row` or `div.column`.**  
This will cause incorrect compilation or broken layout.

✅ Correct usage:
```html
<div class="column">
  <div>
	<div> header code </div>
    <div class="main"> ... </div>
	<div> footer code </div>
  </div>
</div>
```

## Happy Coding

