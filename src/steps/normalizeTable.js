function normalizeTables($,$root) {
    $root.find('table').each((_, table) => {
      const $table = $(table);

      // Set missing attributes
      if (!$table.attr('width')) $table.attr('width', '100%');
      if (!$table.attr('border')) $table.attr('border', '0');
      if (!$table.attr('cellpadding')) $table.attr('cellpadding', '0');
      if (!$table.attr('cellspacing')) $table.attr('cellspacing', '0');

      // Ensure required default inline styles are included
      const requiredStyles = {
        width: '100%',
        margin: '0',
        padding: '0',
        'border-collapse': 'collapse'
      };

      const currentStyleStr = $table.attr('style') || '';
      const styleObj = {};

      // Convert current styles into a key-value object
      currentStyleStr.split(';').forEach(rule => {
        const [key, value] = rule.split(':').map(s => s && s.trim());
        if (key && value) styleObj[key] = value;
      });

      // Add missing default styles
      for (const [key, value] of Object.entries(requiredStyles)) {
        if (!styleObj.hasOwnProperty(key)) {
          styleObj[key] = value;
        }
      }

      // Rebuild style string
      const newStyleStr = Object.entries(styleObj)
        .map(([k, v]) => `${k}: ${v}`)
        .join('; ');

      $table.attr('style', newStyleStr);
    });
  }
  module.exports = {normalizeTables};