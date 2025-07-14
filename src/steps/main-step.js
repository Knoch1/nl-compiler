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
const { removeCode } = require('./remove-code');
const { manageclasses } = require('./manage-classes');
const { sortElementAttributes, sortInlineStyles } = require("./sortCode");
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
	const tracking = nlcompData("tracking");
	const lang = nlcompData("lang");
	const nlcolor = nlcompData("nl-color");
	const linkcolor = nlcompData("link-color");
	const backgroundColor = nlcompData("background-color");
	const name = $("head title").html();
	const title = nlcompData("title") || name;
	const alt = nlcompData("alt") || name;

	const color = getStyleValue('color');
	const family = getStyleValue('font-family');
	const fontweight = getStyleValue('font-weight');
	const lineheight = getStyleValue('line-height');
	const fontsize = getStyleValue('font-size');

	convertAllDivs($, $("body"));
	applyInheritedTextStyles($);
	lineModule($);
	manageclasses($);
	convertImages($);
	normalizeTables($, $("body"));
	buttonModule($, href);
	if (compiletype === "nl-comp") {
		nlcomp($, width, lang, impressum, tracking, hrefbottom, hreftop, nlcolor, linkcolor,backgroundColor,href);
		$(compiletype).remove();
	}
	wrapMainTables($,width);
	replaceSrcHref($, src, href, tracking, alt, title);

	applyBackgroundColor($, ["br", "tr", "tbody", "span", "img","div","p"]);
	removeCode($);
	modifyCss($,color,family,fontweight,lineheight,fontsize);
	temp($);
	sortElementAttributes($,['class','align','src','href','alt', 'width','height','border','cellpadding','cellspacing','style','valign','target','title' ]);


	const styleOrderArray = ['font-size','mso-line-height-rule','line-height','color','font-family','text-align','font-weight',
	/* Padding group */      'padding','padding-top','padding-right','padding-bottom','padding-left',
	/* Margin group */		 'margin','margin-top','margin-right','margin-bottom','margin-left',
	/* Border group */		 'border','border-top','border-right','border-bottom','border-left',
	/* Border-radius group */'border-radius','border-top-left-radius','border-top-right-radius','border-bottom-right-radius','border-bottom-left-radius','border-collapse',
	/* Width group */		 'width','min-width','max-width',
  	/* Height group */		 'height','min-height','max-height',
  							 'background-color'
];
	sortInlineStyles($,styleOrderArray)

	return $.html();
}

module.exports = { transformHtml };
