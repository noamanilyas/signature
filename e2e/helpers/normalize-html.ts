export function normalizeSignatureHtml(html: string) {
  return html
    .replace(/id="item-\d+"/g, 'id="item-normalized"')
    .replace(/id="container-item-\d+"/g, 'id="container-item-normalized"')
    .replace(/id="container-group-item-\d+"/g, 'id="container-group-item-normalized"')
    .replace(/id="editorTD-item-\d+"/g, 'id="editorTD-item-normalized"')
    .replace(/id="editorTable-item-\d+"/g, 'id="editorTable-item-normalized"');
}
