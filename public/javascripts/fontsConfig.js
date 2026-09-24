// Fonts virtually every email client renders as real text (no rasterization needed on export).
const EMAIL_SAFE_FONTS = [
  "Calibri",
  "Arial",
  "Arial Black",
  "Century Gothic",
  "Comic Sans MS",
  "Courier New",
  "Georgia",
  "Impact",
  "Tahoma",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana",
  "Cambria",
];

// Free, metric-compatible Google Fonts used as an in-editor stand-in when the
// real (often proprietary) Word font isn't installed on the visitor's system.
const FONT_SUBSTITUTES = {
  Calibri: "Carlito",
  Cambria: "Caladea",
  "Times New Roman": "Tinos",
  Arial: "Arimo",
  "Courier New": "Cousine",
  Georgia: "Gelasio",
};

// Larger Microsoft Word / Office font catalog. Not guaranteed present on any
// given system, and not email-safe, so text using these is rasterized to an
// image on export (see convertCustomFontToImage in convertToTable.js).
const WORD_FONTS = [
  "Arial Narrow",
  "Bahnschrift",
  "Bell MT",
  "Bodoni MT",
  "Book Antiqua",
  "Bookman Old Style",
  "Bradley Hand ITC",
  "Britannic Bold",
  "Broadway",
  "Brush Script MT",
  "Californian FB",
  "Calisto MT",
  "Candara",
  "Castellar",
  "Centaur",
  "Century",
  "Century Schoolbook",
  "Chiller",
  "Colonna MT",
  "Consolas",
  "Constantia",
  "Copperplate Gothic",
  "Corbel",
  "Curlz MT",
  "Ebrima",
  "Edwardian Script ITC",
  "Elephant",
  "Engravers MT",
  "Eras Bold ITC",
  "Felix Titling",
  "Footlight MT Light",
  "Forte",
  "Franklin Gothic Medium",
  "Freestyle Script",
  "French Script MT",
  "Garamond",
  "Gigi",
  "Gill Sans MT",
  "Gloucester MT Extra Condensed",
  "Goudy Old Style",
  "Goudy Stout",
  "Haettenschweiler",
  "Harlow Solid Italic",
  "Harrington",
  "High Tower Text",
  "Imprint MT Shadow",
  "Informal Roman",
  "Jokerman",
  "Juice ITC",
  "Kristen ITC",
  "Kunstler Script",
  "Wide Latin",
  "Leelawadee",
  "Lucida Bright",
  "Lucida Calligraphy",
  "Lucida Console",
  "Lucida Fax",
  "Lucida Handwriting",
  "Lucida Sans",
  "Lucida Sans Typewriter",
  "Lucida Sans Unicode",
  "Magneto",
  "Maiandra GD",
  "Matura MT Script Capitals",
  "Mistral",
  "Modern No. 20",
  "Monotype Corsiva",
  "Niagara Engraved",
  "Niagara Solid",
  "Old English Text MT",
  "Onyx",
  "Palace Script MT",
  "Palatino Linotype",
  "Papyrus",
  "Parchment",
  "Perpetua",
  "Playbill",
  "Poor Richard",
  "Pristina",
  "Rage Italic",
  "Ravie",
  "Rockwell",
  "Script MT Bold",
  "Segoe Print",
  "Segoe Script",
  "Segoe UI",
  "Showcard Gothic",
  "Snap ITC",
  "Stencil",
  "Sylfaen",
  "Tempus Sans ITC",
  "Tw Cen MT",
  "Viner Hand ITC",
  "Vivaldi",
  "Vladimir Script",
];

function fontFamilyOptionValue(fontName) {
  const substitute = FONT_SUBSTITUTES[fontName];
  return substitute ? `${fontName}, ${substitute}, sans-serif` : fontName;
}

// A font-family CSS value's first entry (unquoted, trimmed) checked against EMAIL_SAFE_FONTS.
function isEmailSafeFontFamily(fontFamilyStyleValue) {
  if (!fontFamilyStyleValue) return false;
  const firstFont = fontFamilyStyleValue
    .split(",")[0]
    .replace(/["']/g, "")
    .trim()
    .toLowerCase();
  return EMAIL_SAFE_FONTS.some((safeFont) => safeFont.toLowerCase() === firstFont);
}

// {label, value} pairs for the Font Family autocomplete: label is what's shown
// in the suggestion dropdown, value is what actually gets applied as CSS
// font-family (label-enhanced fonts carry a substitute fallback stack).
const FONT_AUTOCOMPLETE_SOURCE = EMAIL_SAFE_FONTS.map(function (fontName) {
  return { label: fontName, value: fontFamilyOptionValue(fontName) };
}).concat(
  WORD_FONTS.map(function (fontName) {
    return { label: fontName, value: fontName };
  })
);

function addFontToAutocomplete(fontName) {
  FONT_AUTOCOMPLETE_SOURCE.unshift({ label: fontName, value: fontName });
}

function renderFontSuggestions($list, filterText) {
  const term = (filterText || "").trim().toLowerCase();
  const matches = term
    ? FONT_AUTOCOMPLETE_SOURCE.filter((font) => font.label.toLowerCase().indexOf(term) !== -1)
    : FONT_AUTOCOMPLETE_SOURCE;

  $list.empty();
  matches.slice(0, 200).forEach(function (font) {
    $list.append($("<li></li>").text(font.label).attr("data-value", font.value));
  });
  $list.toggle(matches.length > 0);
}

// renderTextTab re-runs this on every open, after resetTextTab's blanket
// .off() has already stripped whatever was bound on #text-fontFamily last
// time - rebind fresh each time, namespaced so repeated calls don't stack.
function initFontFamilyAutocomplete() {
  const $input = $("#text-fontFamily");
  const $list = $("#text-fontFamily-suggestions");
  if (!$input.length || !$list.length) return;

  $input.off(".fontCombo");
  $list.off(".fontCombo");

  $input.on("focus.fontCombo input.fontCombo", function () {
    renderFontSuggestions($list, $input.val());
  });

  $input.on("blur.fontCombo", function () {
    setTimeout(function () {
      $list.hide();
    }, 150);
  });

  $list.on("mousedown.fontCombo", "li", function (event) {
    event.preventDefault(); // keep focus on the input so blur.fontCombo doesn't race this click
    const value = $(this).attr("data-value");
    $input.val(value).trigger("change");
    $list.hide();
  });
}
