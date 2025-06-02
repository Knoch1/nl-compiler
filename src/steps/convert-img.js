
function transformAllImgTags($) {
  $('img').each((_, el) => {
    const img = $(el);

    // border setzen
    img.attr('border', '0');

    // style erweitern statt ersetzen
    const existingStyle = img.attr('style') || '';
    const extraStyle = 'text-align: center; padding: 0; margin: 0 auto; display: block;';
    const mergedStyle = mergeStyles(existingStyle, extraStyle);
    img.attr('style', mergedStyle);
  });
  function mergeStyles(original, extra) {
  const styleMap = {};

  // Ursprüngliche Styles einlesen
  original.split(';').forEach(rule => {
    const [key, value] = rule.split(':').map(s => s?.trim());
    if (key) styleMap[key] = value;
  });

  // Zusätzliche Styles einfügen oder überschreiben
  extra.split(';').forEach(rule => {
    const [key, value] = rule.split(':').map(s => s?.trim());
    if (key) styleMap[key] = value;
  });

  // Zurück in einen Style-String wandeln
  return Object.entries(styleMap)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ') + ';';
}
}
module.exports = {transformAllImgTags};