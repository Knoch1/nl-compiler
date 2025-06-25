function nlcomp($, width, lang, impressum, tracing, hrefbottom, hreftop) {
  // Extract background color from <body style="..."> once
  let backgroundColor = "#ffffff";
  const bodyStyle = $('body').attr('style');
  if (bodyStyle) {
    const match = bodyStyle.match(/background-color\s*:\s*([^;]+)\s*;/i);
    if (match) {
      backgroundColor = match[1].trim();
    }
  }

  $('nl-comp').each((_, el) => {
    const innerContent = $(el).html();

    const topText = {
      de: 'Wird diese Nachricht nicht richtig dargestellt, klicken Sie bitte ',
      en: 'If this message is not displayed properly, click ',
      it: 'Se non riesci a visualizzare correttamente questa e-mail, clicca '
    };

    const topLink = {
      de: 'hier',
      en: 'here',
      it: 'qui'
    };

    const bottomText = {
      de: 'Falls Sie keinen Newsletter mehr erhalten möchten, klicken Sie bitte auf ',
      en: 'You can always unsubscribe yourself from our newsletter list. Please click on ',
      it: 'Se non riesci a visualizzare correttamente questa e-mail, clicca '
    };

    const bottomLink = {
      de: 'diesen Link',
      en: 'this link',
      it: 'questo link'
    };

    const bottomFollow = {
      de: 'und befolgen Sie die Anweisungen',
      en: 'and follow the instructions',
      it: 'e segui le istruzioni'
    };

    const newHtml = `
    <div align="center" style="width: 100%; margin: 0 auto; background-color: ${backgroundColor};">
      <table align="center" style="width: 100%; max-width: ${width}px; margin: 0 auto; border-collapse: collapse; border-spacing: 0px; border: 0px; background-color: ${backgroundColor};" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
          <tr>
            <td style="background-color: ${backgroundColor}; margin: 0;" align="center">
              <table width="100%" style="width: 100%; max-width: ${width}px; margin: 0 auto; border-collapse: collapse;" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                  <tr>
                    <td style="background-color: ${backgroundColor}; margin: 0; padding: 5px;" align="center">
                      <p style="text-align: center; font-size: 11px; font-family: Verdana, Arial; color: #000000; margin: 5px; padding: 15px;">
                        ${topText[lang] || ''}<a style="font-weight: bold; text-decoration: none; color: #000000;" href="${hreftop}">${topLink[lang] || ''}</a>${lang === 'en' ? ' please' : ''}.
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td width="100%" style="background-color: ${backgroundColor}; margin: 0; padding: 0;" align="center">
              ${innerContent}
            </td>
          </tr>
          <tr>
            <td style="background-color: ${backgroundColor}; margin: 0;">
              <table width="100%" style="width: 100%; max-width: ${width}px; margin: 0 auto; border-collapse: collapse;" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                  <tr>
                    <td style="background-color: ${backgroundColor}; margin: 0; padding: 15px;">
                      <p style="text-align: center; font-size: 11px; font-family: Verdana, Arial; color: #000000; margin: 5px; padding: 0;">
                        <a style="font-weight: bold; text-decoration: none; color: #000000;" href="${impressum}">
                          ${lang === 'de' ? 'Impressum' : 'Colophon'}
                        </a>
                      </p>
                      <p style="text-align: center; font-size: 11px; font-family: Verdana, Arial; color: #000000; margin: 5px; padding: 0;">
                        ${bottomText[lang] || ''}<a style="font-weight: bold; text-decoration: none; color: #000000;" href="${hrefbottom}">${bottomLink[lang] || ''}</a> ${bottomFollow[lang] || ''}.
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    `;

    $(el).replaceWith(newHtml);
  });
}

module.exports = { nlcomp };