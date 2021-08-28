# djvu-info
`djvu-info` is a tool to help you know more about your `djvu` files.
It is (currently, at least), written in Javascript.
You can run it by running `node djvu-info.js yourfile.djvu`.

[DjVu](https://en.wikipedia.org/wiki/DjVu) is a file format developed by AT&T,
sold to LizardTech, that was since acquired by Celartem. As you can imagine of
a format that is sold, this is not a standard, much less an open standard. Of
course, not every file follows the specification (or one of its versions, what
a mess!). [DjVu v3's spec](https://www.cuminas.jp/docs/techinfo/DjVu3Spec.pdf)
is here, but it has gone up to v26.

A new version was planned to add support to DRM ("Secure DjVu"), but then they
decided to instead fork in into a similar but not the same 'Secure DjVu', and
those files have either `.sdjv`, `.djvu` or `.sdjvu` extensions. Of course, the
idea isn't a good one, and it didn't go very far: it seems there is no much
info about SDjVu anywhere at all, and Cuminas - who was pushing for SDjVu -
moved into forking PDF to add DRM on it instead, with their ACP... that is also
dead by now, what a surprise.

Anyway, this is meant to be a script that reads a `.djvu` file and tells you if
it really is a DjVu file, SDjVu, or not.

A second script, `sdjvu-info.js`, is meant to be used on SDjVu files, letting
you know what sort of DRM it contains.
