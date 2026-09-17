export function normalizeSignatureHtml(html: string) {
  // Item ids are minted as `item-${Date.now()}-${nextIdSuffix()}` (see
  // drop.js) - the trailing `-<counter>` disambiguates ids minted within
  // the same millisecond, so it must be stripped here too or these
  // timestamp-derived ids never match between runs.
  return html
    .replace(/id="item-\d+(-\d+)?"/g, 'id="item-normalized"')
    .replace(/id="container-item-\d+(-\d+)?"/g, 'id="container-item-normalized"')
    .replace(/id="container-group-item-\d+(-\d+)?"/g, 'id="container-group-item-normalized"')
    .replace(/id="editorTD-item-\d+(-\d+)?"/g, 'id="editorTD-item-normalized"')
    .replace(/id="editorTable-item-\d+(-\d+)?"/g, 'id="editorTable-item-normalized"');
}
