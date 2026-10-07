# Tests
- `node tests/verify.js` – ~150 benchmark values computed independently (standards tables, textbook examples, NIST/IEC reference functions, AIVDM reference decodes) plus audit regression checks.
- `node tests/fuzz.js` – runs every calculator with default / min / max / random inputs and reports NaN, Infinity or exceptions.
- `node tests/browser.js` – opens every calculator in Chromium (needs Playwright; set CHROME=/path/to/chrome if required).
Run all three after any change, then `python3 build_single_file.py`.
