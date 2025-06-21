// const {createheader} = require('./create-header');
const { convertAllDivs } = require('./convert-div');
const { convertImages } = require('./convert-img');
const { nlcomp } = require('./nl-comp');
const { replaceSrcHref } = require('./src-and-href');
const { temp } = require('./temp');
const { normalizeTables } = require('./normalizeTable');
const { applyBackgroundColor } = require('./background-color');
function transformHtml($) {
  // Example transformation: Modify <nl-comp> tags
  let compiletype = '';
  if($('nl-comp').length >= 1){
    compiletype = 'nl-comp';
  }
  if($('mf-comp').length >= 1){
    compiletype = 'mf-comp';
  }
  function nlcompData(attribute) {
    const value = $(compiletype).attr(attribute);
    return value !== undefined ? value : '';
  }
  const width = nlcompData('width');
  const hreftop = nlcompData('href-top');
  const hrefbottom = nlcompData('href-bottom');
  const src=nlcompData('src');
  const href=nlcompData('href');
  const impressum = nlcompData('impressum');
  const tracing = nlcompData('tracing');
  const lang = nlcompData('lang');
  
  convertAllDivs($,$('body'));
  temp($);
  convertImages($);
  normalizeTables($,$('body')); 
  console.log("Test2");
  
  if(compiletype==='nl-comp'){
    nlcomp($,width,lang,impressum,tracing,hrefbottom,hreftop);
    $(compiletype).remove();
  }
  replaceSrcHref($,src,href,tracing);


  applyBackgroundColor($,['br','tr','tbody','span','img'])
  return $.html();
}

module.exports = { transformHtml }; 