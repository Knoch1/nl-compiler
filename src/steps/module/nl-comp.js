function nlcomp(
  $,
  width,
  lang,
  impressum,
  tracking,
  hrefbottom,
  hreftop,
  color,
  linkcolor,
  backgroundColor,
  href
) {
  // Extract background color from <body style="..."> once
  const isValid = (val) => val !== undefined && val !== null && val !== '' && val !== 0;

  color= isValid(color) ? color : "#3a3a3a";
  lang= isValid(lang) ? lang : "de";
  hreftop= isValid(hreftop) ? hreftop : href;
  hrefbottom= isValid(hrefbottom) ? hrefbottom : href;
  linkcolor= isValid(linkcolor) ? linkcolor : "#000000";
  impressum= isValid(impressum) ? impressum : href;
  width= isValid(width) ? width : "600";


  if(!isValid(backgroundColor)){
    backgroundColor = "#ffffff";
    const bodyStyle = $("body").attr("style");
    if (bodyStyle) {
      const match = bodyStyle.match(/background-color\s*:\s*([^;]+)\s*;/i);
      if (match) {
        backgroundColor = match[1].trim();
      }
    }
  }


  $("nl-comp").each((_, el) => {
    const innerContent = $(el).html();

    const topText = {
      de: "Wird diese Nachricht nicht richtig dargestellt, klicken Sie bitte ",
      en: "If this message is not displayed properly, click ",
      it: "Se non riesci a visualizzare correttamente questa e-mail, clicca ",
    };

    const topLink = {
      de: "hier",
      en: "here",
      it: "qui",
    };

    const bottomText = {
      de: "Falls Sie keinen Newsletter mehr erhalten möchten, klicken Sie bitte auf ",
      en: "You can always unsubscribe yourself from our newsletter list. Please click on ",
      it: "Se non riesci a visualizzare correttamente questa e-mail, clicca ",
    };

    const bottomLink = {
      de: "diesen Link",
      en: "this link",
      it: "questo link",
    };

    const bottomFollow = {
      de: "und befolgen Sie die Anweisungen",
      en: "and follow the instructions",
      it: "e segui le istruzioni",
    };

    const newHtml = `
	<!--[if (gte mso 9)|(IE)]>
		<center>
		<table width="600" style="border-collapse: collapse; border-spacing: 0px; border: 0px; mso-table-tspace: 0px; mso-table-rspace: 0px; mso-table-bspace: 0px; mso-table-lspace: 0px;" border="0" cellpadding="0" cellspacing="0">
			<tr style="padding: 0px; margin: 0px; border-spacing: 0; font-size:0; mso-line-height-alt:0; mso-margin-top-alt:1px;">
				<td width="600" style="background-color: ${backgroundColor}; margin: 0 auto; padding: 0;">
	<![endif]-->
    <div align="center" style="width: 100%; margin: 0 auto; background-color: ${backgroundColor};">
		  <table align="center" width="100%" style="width: 100%; max-width:${width}px; margin:0 auto; border-collapse: collapse; border-spacing: 0px; border: 0px; background-color: ${backgroundColor}; background-position: initial; background-repeat: initial; mso-table-tspace: 0px; mso-table-rspace: 0px; mso-table-bspace: 0px; mso-table-lspace: 0px;" border="0" cellpadding="0" cellspacing="0">
          <tr style="padding: 0px; margin: 0px; border-spacing: 0; font-size:0; mso-line-height-alt:0; mso-margin-top-alt:1px;">
            <td style="background-color: ${backgroundColor}; margin: 0;" align="center">
					    <table width="100%" style="width: 100%; max-width:${width}px; margin:0 auto; border-collapse: collapse; border-spacing: 0px; border: 0px; background-position: initial; background-repeat: initial; mso-table-tspace: 0px; mso-table-rspace: 0px; mso-table-bspace: 0px; mso-table-lspace: 0px;" border="0" cellpadding="0" cellspacing="0">
                <tr style="padding: 0px; margin: 0px; border-spacing: 0; font-size:0; mso-line-height-alt:0; mso-margin-top-alt:1px;">
						      	<td style="background-color: ${backgroundColor}; margin: 0 auto; padding: 15px;" align="center">
      								<p style="text-align: center; font-size: 11px; mso-line-height-rule:exactly; line-height:18px; font-family: 'Arial'; color: ${color}; margin: 5px; padding: 0px;">  ${topText[lang] || ""}<a style="font-weight: bold; text-decoration: none; color: ${linkcolor};" href="${hreftop}">${topLink[lang] || ""}</a>${lang === "en" ? " please" : ""}.</p>
                    </td>
                  </tr>
              </table>
            </td>
          </tr>
          <tr style="padding: 0px; margin: 0px; border-spacing: 0; font-size:0; mso-line-height-alt:0; mso-margin-top-alt:1px;">
				    <td style="background-color: ${backgroundColor}; margin: 0 auto; padding: 0;">
					    <table align="center" class="element-100" width="100%" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width:${width}px; margin: 0 auto; border-collapse: collapse; border-spacing: 0px; border: 0px; background-position: initial; background-repeat: initial; mso-table-tspace: 0px; mso-table-rspace: 0px; mso-table-bspace: 0px; mso-table-lspace: 0px;">
    						<tr style="padding: 0px; margin: 0px; border-spacing: 0; font-size:0; mso-line-height-alt:0; mso-margin-top-alt:1px;">
    							<td style="background-color: ${backgroundColor}; margin: 0 auto; padding: 0;">
                   ${innerContent}
                  </td>
                <tr>
              </table>
            </td>
          </tr>
          <tr style="padding: 0px; margin: 0px; border-spacing: 0; font-size:0; mso-line-height-alt:0; mso-margin-top-alt:1px;">
            <td style="background-color: ${backgroundColor}; margin: 0 auto;">
					    <table width="100%" style="width: 100%; max-width:${width}px;; margin:0 auto; border-collapse: collapse; border-spacing: 0px; border: 0px; background-position: initial; background-repeat: initial; mso-table-tspace: 0px; mso-table-rspace: 0px; mso-table-bspace: 0px; mso-table-lspace: 0px;" border="0" cellpadding="0" cellspacing="0">
                <tr style="padding: 0px; margin: 0px; border-spacing: 0; font-size:0; mso-line-height-alt:0; mso-margin-top-alt:1px;">
                    <td style="background-color: ${backgroundColor}; margin: 0; padding: 15px;">
      								<p style="text-align: center; font-size: 11px; mso-line-height-rule:exactly; line-height:21px; font-family: 'Arial'; color: ${color}; margin: 5px; padding: 0;"><a style="font-weight: bold; text-decoration: none; color: ${linkcolor};" href="${impressum}">${lang === "de" ? "Impressum" : "Colophon"}</a></p>
								      <p style="text-align: center; font-size: 11px; mso-line-height-rule:exactly; line-height:18px; font-family: 'Arial'; color: ${color}; margin: 5px; padding: 0;">${bottomText[lang] || ""}<a style="font-weight: bold; text-decoration: none; color: ${linkcolor};" href="${hrefbottom}">${bottomLink[lang] || ""}</a> ${bottomFollow[lang] || ""}.</p>
                    </td>
                  </tr>
              </table>
            </td>
          </tr>
      </table>
    </div>
	<!--[if (gte mso 9)|(IE)]>
		</td></tr></table>
		</center>
	<![endif]-->
	<!-- Needs for Outlook -->
	<div><br /></div>

    `;

    $(el).replaceWith(newHtml);
  });
}

module.exports = { nlcomp };
