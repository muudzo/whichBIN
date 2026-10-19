#!/bin/sh
# Prints a PDF's text page by page, using macOS's built-in PDFKit (nothing to install).
# Usage: extract-pdf-text.sh guide.pdf > guide.txt
set -eu

if [ "$#" -ne 1 ]; then
  echo "usage: $0 file.pdf" >&2
  exit 1
fi

PDF_PATH="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"

osascript -l JavaScript - "$PDF_PATH" <<'JS'
ObjC.import('PDFKit');
function run(argv) {
  var doc = $.PDFDocument.alloc.initWithURL($.NSURL.fileURLWithPath(argv[0]));
  if (doc.isNil()) throw new Error('Could not open ' + argv[0]);
  var pages = [];
  for (var i = 0; i < doc.pageCount; i++) {
    pages.push('=== PDF page ' + (i + 1) + ' ===\n' + (doc.pageAtIndex(i).string.js || ''));
  }
  return pages.join('\n\n');
}
JS
