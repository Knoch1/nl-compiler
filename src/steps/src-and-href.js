

function replaceSrcHref($,src,href) {
   $('img').each((_, img) => {
    const oldSrc = $(img).attr('src');
    if (oldSrc && oldSrc.startsWith('$')) {
      const newSrc = src + oldSrc.slice(1);
      $(img).attr('src', newSrc);
    }
  });


  $('a').each((_, a) => {
    const oldhref = $(a).attr('href');
    if (oldhref && oldhref.startsWith('$')) {
      const newhref = href + oldhref.slice(1);
      $(a).attr('href', newhref);
    }
  });
}
module.exports = {replaceSrcHref};