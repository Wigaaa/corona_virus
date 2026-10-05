#!/usr/bin/env python3
"""Bundle the multi-file toolkit into one self-contained ETO-Toolkit.html"""
import re, pathlib
root = pathlib.Path(__file__).parent
rd = lambda p: (root / p).read_text(encoding='utf-8')
idx = rd('index.html')
css = rd('assets/style.css')
extra_style = re.search(r'<style>(.*?)</style>', idx, re.S).group(1)
body = re.search(r'<body>(.*?)<script src="assets/common.js">', idx, re.S).group(1)
idx_script = re.search(r'<script>\n(.*?)</script>\s*</body>', idx, re.S).group(1)
about = rd('about.html')
about_body = re.search(r'<body>(.*?)<script>', about, re.S).group(1)
about_script = re.search(r'<script>\n(.*?)</script>\s*</body>', about, re.S).group(1)
about_body = about_body.replace('href="index.html"', 'href="#"')
body = body.replace('href="index.html"', 'href="#"').replace('href="about.html"', 'href="#about.html"').replace('id="theme"', 'id="theme0"')
idx_script = idx_script.replace('href="${p.f}"', 'href="#${p.f}"').replace("getElementById('theme')", "getElementById('theme0')")
pages = [m for m in re.findall(r"\{ f: '([a-z]+\.html)'", rd('assets/common.js'))]
out = ['<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>ETO Toolkit – Marine Electrical Engineering &amp; Troubleshooting</title>\n<style>\n', css, '\n', extra_style, '\n</style>\n</head>\n<body>\n<div id="indexView">', body, '</div>\n<div id="aboutView" style="display:none">', about_body, '</div>\n<div id="app" style="display:none"></div>\n<script>window.ETO_BUNDLE=true;</script>\n<script>\n', rd('assets/common.js'), '\n</script>\n']
for f in pages:
    js = rd('assets/pages/%s.js' % f[:-5])
    assert '</script' not in js
    out.append("<script>window.ETO_FILE='%s';</script>\n<script>\n%s\n</script>\n" % (f, js))
out.append('<script>\n' + about_script + '\n</script>\n<script>\n' + idx_script + '\n</script>\n<script>ETO.start();</script>\n</body>\n</html>\n')
(root / 'ETO-Toolkit.html').write_text(''.join(out), encoding='utf-8')
print('written', len(''.join(out)) // 1024, 'KB')
