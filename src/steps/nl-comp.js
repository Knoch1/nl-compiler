 
 
function nlcomp($,width,lang,impressum,tracing,hrefbottom,hreftop) { 
 $('nl-comp').each((_, el) => {
    const innerContent = $(el).html(); // Preserve what's inside <nl-comp>
    
    const newHtml=`	
	<div align="center" style="width: 100%; margin: 0 auto; background-color: #ffffff;">
		<table align="center" style="width: 100%; max-width: ${width}px; margin: 0 auto; border-collapse: collapse; border-spacing: 0px; border: 0px; background-color: #ffffff; background-position: initial; background-repeat: initial;" border="0" cellpadding="0" cellspacing="0" width="100%">
			<tbody>
				<tr style="padding: 0px; margin: 0px; border-spacing: 0; font-size: 0; mso-line-height-alt: 0; mso-margin-top-alt: 1px;">
					<td style="background-color: #ffffff; margin: 0;" align="center">
						<table width="100%" style="width: 100%; max-width: ${width}px; margin: 0 auto; border-collapse: collapse; border-spacing: 0px; border: 0px; background-position: initial; background-repeat: initial;" border="0" cellpadding="0" cellspacing="0">
							<tbody>
								<tr>
									<td style="background-color: #ffffff; margin: 0; padding: 5px;" align="center">
										<p style="text-align: center; font-size: 11px; font-family: Verdana,Arial; color: #000000; margin: 5px; padding: 15px;">${lang=="de"?"Wird diese Nachricht nicht richtig dargestellt, klicken Sie bitte ":""}${lang=="en"?"If this message is not displayed properly, click ":""}${lang=="it"?"Se non riesci a visualizzare correttamente questa e-mail, clicca ":""} <a style="font-weight: bold; text-decoration: none; color: #000000;" href="${hreftop}">${lang=="de"?"hier":""}${lang=="en"?"here":""}${lang=="it"?"qui":""}</a>${lang=="en"?" please":""}.</p>
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
				<tr style="padding: 0; margin: 0px; border-spacing: 0; font-size:0; mso-line-height-alt:0; mso-margin-top-alt:1px;">
					<td width="100%" style="background-color: #ffffff; margin: 0; padding: 0; width: 100%; max-width: ${width}px;" align="center">
						${innerContent}
					</td>
				</tr>
        		<tr style="padding: 0px; margin: 0px; border-spacing: 0; font-size: 0; mso-line-height-alt: 0; mso-margin-top-alt: 1px;">
					<td style="background-color: #ffffff; margin: 0;">
						<table width="100%" style="width: 100%; max-width: ${width}px; margin: 0 auto; border-collapse: collapse; border-spacing: 0px; border: 0px; background-position: initial; background-repeat: initial;" border="0" cellpadding="0" cellspacing="0">
							<tbody>
								<tr>
									<td style="background-color: white; margin: 0; padding: 15px;">
										<p style="text-align: center; font-size: 11px; line-height: 21px; font-family: Verdana, Arial; color: #000000; margin: 5px; padding: 0;"><a style="font-weight: bold; text-decoration: none; color: #000000;" href="${impressum}">${lang=="de"?"Impressum":"Colophon"}</a></p>
										<p style="text-align: center; font-size: 11px; font-family: Verdana, Arial; color: #000000; margin: 5px; padding: 0;">${lang=="de"?"Falls Sie keinen Newsletter mehr erhalten möchten, klicken Sie bitte auf ":""}${lang=="it"?"Se non riesci a visualizzare correttamente questa e-mail, clicca ":""}${lang=="en"?"You can always unsubscribe yourself from our newsletter list. Please click on ":""}<a style="font-weight: bold; text-decoration: none; color: #000000;" href="${hrefbottom}">${lang=="de"?"diesen Link":""}${lang=="en"?"this link":""}${lang=="it"?"questo link":""}</a> ${lang=="de"?"und befolgen Sie die Anweisungen":""}${lang=="en"?"and follow the instructions":""}${lang=="it"?"e segui le istruzioni":""}.</p>
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</tbody>
		</table>
	</div>`;
  $(el).replaceWith(newHtml);
});
}
module.exports = { nlcomp }; 