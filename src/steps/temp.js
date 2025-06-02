function temp($) {

      $('.row').removeClass('row');
  $('.column').removeClass('column');
  function removeEmptyClassAttr($el) {
    const classAttr = $el.attr('class');
    if (!classAttr || !classAttr.trim()) {
      $el.removeAttr('class');
    }
  }

  $('table, td').each((_, el) => {
    removeEmptyClassAttr($(el));
  });

  $("tr").attr(
    "style",
    "padding: 0px; margin: 0px; border-spacing: 0; font-size:0; mso-line-height-alt:0; mso-margin-top-alt:1px;"
  );
}
module.exports = {temp};