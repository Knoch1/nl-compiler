

  function applyBackgroundColor($, excludedElements = []) {
    
    function propagateBackgroundColor(element, parentBgColor) {
      const $element = $(element);
      let currentBgColor = $element.css('background-color');
  
      if (!excludedElements.includes($element[0].tagName)) {
        if (!currentBgColor || currentBgColor === 'transparent' || currentBgColor === 'rgba(0, 0, 0, 0)') {
          if (parentBgColor) {
            $element.css('background-color', parentBgColor);
          }
        } else {
          parentBgColor = currentBgColor;
        }
      }  
      $element.children().each((_, child) => propagateBackgroundColor(child, parentBgColor));
    }
    
    $('body').children().each((_, element) => propagateBackgroundColor(element, null));
  }
  module.exports = {applyBackgroundColor};