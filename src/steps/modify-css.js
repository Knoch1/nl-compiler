const postcss = require('postcss');
const he = require('he'); // HTML Entities decoder (npm install he)

function extractAndDecodeStyleTags($) {
	let decodedCss = '';
	$('style').each((_, el) => {
		const raw = $(el).html();
		const decoded = he.decode(raw); // Convert &apos; to actual apostrophe
		decodedCss += decoded + '\n';
	});
	return decodedCss;
}
function modifyCss($, color, family, fontweight, lineheight, fontsize) {
	const baseStyles = {
		".footer-fontsize a": "color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important;",
		'a[x-apple-data-detectors]': "color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important;",
		img: "line-height: 0px; display: block;",
		"#cred_sidebar_ul li": "font-size:12px; font-family: arial; line-height: 18px;",
		".cred_link": "line-height: 0px; height: auto;",
		".cred_image": "min-height:0px;",
		"td .cred_image": "display:inline;",
		"table, td, tr, p": "text-decoration: none;",
		li: `font-weight:${fontweight ?? "400"}; color:${color ?? "#FFFFFF"}; font-family: ${family ?? "Tahoma, Arial, Helvetica, Verdana, sans-serif"}; font-size:${fontsize ?? "16px"}; line-height:${lineheight ?? "31px"};`,
		ul: "margin-top:0px; margin-bottom:0px; margin-left:20px;",
		"a, td, p": "text-decoration: none;",
		"p a.booking": `display:inline-block; width:100%; height:35px; mso-line-height-rule:exactly; line-height:35px; color:${color ?? "#FFFFFF"}; font-family: ${family ?? "Tahoma, Arial, Helvetica, Verdana, sans-serif"}; font-weight:normal; text-decoration:none; letter-spacing: 0.07em; text-transform: none;`,
		"p a.more": `display:inline-block; width:100%; height:35px; mso-line-height-rule:exactly; line-height:35px; color:${color ?? "#FFFFFF"}; font-family: ${family ?? "Tahoma, Arial, Helvetica, Verdana, sans-serif"}; font-weight:normal; text-decoration:none; letter-spacing: 0.07em; text-transform: none;`,
		"p a": `color:${color ?? "#FFFFFF"};`,
		p: `text-align:center; font-weight:${fontweight ?? "400"}; margin: 0; padding: 0; color:${color ?? "#FFFFFF"}; font-family: ${family ?? "Tahoma, Arial, Helvetica, Verdana, sans-serif"}; font-size:${fontsize ?? "13px"}; line-height:${lineheight ?? "31px"};`,
		h3: `text-align:center; font-weight:${fontweight ?? "400"}; margin: 0; padding: 0; color:${color ?? "#FFFFFF"}; font-family: ${family ?? "Tahoma, Arial, Helvetica, Verdana, sans-serif"}; font-size:${fontsize ?? "13px"}; line-height:${lineheight ?? "31px"};`,
		h2: `text-align:center; font-weight:${fontweight ?? "400"}; margin: 0; padding: 0; color:${color ?? "#FFFFFF"}; font-family: ${family ?? "Tahoma, Arial, Helvetica, Verdana, sans-serif"}; font-size:${fontsize ?? "26px"}; line-height:${lineheight ?? "31px"};`,
		h1: `text-align:center; font-weight:${fontweight ?? "400"}; margin: 0; padding: 0; color:${color ?? "#FFFFFF"}; font-family: ${family ?? "Tahoma, Arial, Helvetica, Verdana, sans-serif"}; font-size:${fontsize ?? "32px"}; line-height:${lineheight ?? "31px"};`,
		'body table br[data-mce-bogus="1"]': "display: block !important;",
		"body, table, td": "font-family: Arial !important;"
	};

	const styleBlocks = $('head style');
	let allCss = extractAndDecodeStyleTags($);

	const root = postcss.parse(allCss);

	for (const [selector, styleText] of Object.entries(baseStyles)) {
		const baseDecls = parseDeclarations(styleText);

		let rule = null;
		root.walkRules(r => {
			if (r.selector === selector) rule = r;
		});

		if (!rule) {
			// Add new rule
			rule = postcss.rule({ selector });
			for (const decl of baseDecls) {
				rule.append(postcss.decl(decl));
			}
			root.prepend(rule);
		} else {
			// Append missing declarations
			const existingProps = new Set();
			rule.walkDecls(d => existingProps.add(d.prop));
			for (const decl of baseDecls) {
				if (!existingProps.has(decl.prop)) {
					rule.append(postcss.decl(decl));
				}
			}
		}
	}

	// Replace <style> blocks with updated CSS
	const newCss = root.toString();
	styleBlocks.remove();
	$('head').prepend(`<style type="text/css">\n${newCss.trim()}\n</style>`);
}

function parseDeclarations(styleText) {
	return styleText
		.split(';')
		.map(s => s.trim())
		.filter(Boolean)
		.map(line => {
			const [prop, ...valParts] = line.split(':');
			const rawVal = valParts.join(':').trim();
			const important = /\s*!important$/.test(rawVal);
			const value = rawVal.replace(/\s*!important$/, '').trim();
			return {
				prop: prop.trim(),
				value,
				important
			};
		});
}
module.exports = { modifyCss };