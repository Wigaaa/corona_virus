#!/usr/bin/env python3
"""Bundle the multi-file handbook into one self-contained ETO-Handbook.html"""
import re, pathlib, os, shutil, subprocess, datetime
outname = 'ETO-Handbook.html'
build = datetime.date.today().isoformat()
# optional code scrambling (minify + mangle) with terser: set TERSER=/path/to/terser or have it on PATH
terser = os.environ.get('TERSER') or shutil.which('terser')
def protect(js):
    if not terser:
        return js
    r = subprocess.run([terser, '--compress', '--mangle', '--comments', 'false'], input=js, capture_output=True, text=True)
    if r.returncode != 0:
        raise SystemExit('terser failed: ' + r.stderr[:500])
    return r.stdout

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
body = body.replace('href="index.html"', 'href="#"')
# every link to a page file must become an in-file route (#page.html) in the single-file build
body = re.sub(r'href="([a-z0-9]+\.html)"', r'href="#\1"', body)
about_body = re.sub(r'href="([a-z0-9]+\.html)"', r'href="#\1"', about_body)
body = body.replace('id="theme"', 'id="theme0"')
idx_script = idx_script.replace('href="${p.f}"', 'href="#${p.f}"').replace("getElementById('theme')", "getElementById('theme0')")
pages = [m for m in re.findall(r"\{ f: '([a-z]+\.html)'", rd('assets/common.js'))]
pages.append('tips.html')  # extra page reached from the top bar, not listed on the home grid
out = ['<!doctype html>\n<!-- ETO Handbook – Marine Electrical Engineering, Guides & Tools. © 2026 Wagdy Mohamed Abdel Aziz (eto.wagdy@gmail.com). All rights reserved. Personal use only; copying, editing, selling or redistributing without the author\'s written permission is prohibited. -->\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="author" content="Wagdy Mohamed Abdel Aziz">\n<meta name="copyright" content="© 2026 Wagdy Mohamed Abdel Aziz. All rights reserved.">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>ETO Handbook – Marine Electrical Engineering, Guides &amp; Tools</title>\n<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">\n<style>\n', css, '\n', extra_style, '\n</style>\n</head>\n<body>\n<div id="indexView">', body, '</div>\n<div id="aboutView" style="display:none">', about_body, '</div>\n<div id="app" style="display:none"></div>\n<script>window.ETO_BUNDLE=true;</script>\n<script>\n', protect(rd('assets/common.js').replace("const BUILD = 'dev';", "const BUILD = '%s';" % build)), '\n</script>\n<script>\n', protect(rd('assets/quiz.js')), '\n</script>\n']
for f in pages:
    js = rd('assets/pages/%s.js' % f[:-5])
    assert '</script' not in js
    out.append("<script>window.ETO_FILE='%s';</script>\n<script>\n%s\n</script>\n" % (f, protect(js)))
out.append('<script>\n' + protect(about_script) + '\n</script>\n<script>\n' + protect(idx_script) + '\n</script>\n<script>ETO.start();</script>\n</body>\n</html>\n')
(root / outname).write_text(''.join(out), encoding='utf-8')
print(outname, 'written', 'build ' + build, 'scrambled' if terser else 'NOT scrambled (terser not found)', len(''.join(out)) // 1024, 'KB')
