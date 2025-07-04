// const {createheader} = require('./create-header');
const { convertAllDivs } = require("./convert-div");
const { convertImages } = require("./convert-img");
const { nlcomp } = require("./module/nl-comp");
const { replaceSrcHref } = require("./src-and-href");
const { temp } = require("./temp");
const { normalizeTables } = require("./normalizeTable");
const { applyBackgroundColor } = require("./background-color");
const { applyInheritedTextStyles } = require("./fontstyling");
const { lineModule } = require("./module/line");
const { buttonModule } = require("./module/button");
const { modifyCss } = require("./modify-css");
const { wrapMainTables } = require("./wrapmain");
function transformHtml($) {
	// Example transformation: Modify <nl-comp> tags
	let compiletype = "";
	if ($("nl-comp").length >= 1) {
		compiletype = "nl-comp";
	}
	if ($("mf-comp").length >= 1) {
		compiletype = "mf-comp";
	}
	function nlcompData(attribute) {
		const value = $(compiletype).attr(attribute);
		return value !== undefined ? value : "";
	}
	function getStyleValue(propertyName) {
	return $(compiletype).attr("style")
		.split(';')
		.map(rule => rule.split(':').map(s => s.trim()))
		.filter(([key, value]) => key && value && key === propertyName)
		.map(([_, value]) => value)[0]; // return first match, if any
	}
	const width = nlcompData("width");
	const hreftop = nlcompData("href-top");
	const hrefbottom = nlcompData("href-bottom");
	const src = nlcompData("src");
	const href = nlcompData("href");
	const impressum = nlcompData("impressum");
	const tracing = nlcompData("tracing");
	const lang = nlcompData("lang");
	const nlcolor = nlcompData("nl-color");
	const linkcolor = nlcompData("link-color");
	const backgroundColor = nlcompData("background-color");

	const color = getStyleValue('color');
	const family = getStyleValue('font-family');
	const fontweight = getStyleValue('font-weight');
	const lineheight = getStyleValue('line-height');
	const fontsize = getStyleValue('font-size');

	convertAllDivs($, $("body"));
	applyInheritedTextStyles($);
	temp($);
	lineModule($);
	buttonModule($);
	convertImages($);
	normalizeTables($, $("body"));
	if (compiletype === "nl-comp") {
		nlcomp($, width, lang, impressum, tracing, hrefbottom, hreftop, nlcolor, linkcolor,backgroundColor,href);
		$(compiletype).remove();
	}
	wrapMainTables($,width);
	replaceSrcHref($, src, href, tracing);

	applyBackgroundColor($, ["br", "tr", "tbody", "span", "img"]);
	modifyCss($,color,family,fontweight,lineheight,fontsize);
	return $.html();
}

module.exports = { transformHtml };
