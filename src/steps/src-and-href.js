function replaceSrcHref($, src, href, tracking, alt, title) {
  $("img").each((_, img) => {
    const oldSrc = $(img).attr("src");
    if (oldSrc && oldSrc.startsWith("$")) {
      const newSrc = src + oldSrc.slice(1);
      $(img).attr("src", newSrc);
    }
  });
  $("a").each((_, a) => {
    const oldhref = $(a).attr("href");
    if (oldhref && oldhref.startsWith("$")) {
      const newhref = href + oldhref.slice(1);
      $(a).attr("href", newhref);
    }
    const oldhref2 = $(a).attr("href");
    if (oldhref2 && oldhref2.endsWith("$")) {
      const newhref2 = oldhref2.slice(0, -1) + tracking;
      $(a).attr("href", newhref2);
    }
  });
    $("img").each((_, img) => {
    const $img = $(img);
    const currentAlt = $img.attr("alt");

    if (typeof currentAlt === "undefined" || currentAlt.trim() === "") {
      $img.attr("alt", alt);
    }
  });
   $("a").each((_, a) => {
    const $a = $(a);
    const currentTitle = $a.attr("title");

    if (typeof currentTitle === "undefined" || currentTitle.trim() === "") {
      $a.attr("title", title);
    }
  });
}
module.exports = { replaceSrcHref };
