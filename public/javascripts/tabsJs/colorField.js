// Color field: a text input that accepts a hex code or any CSS color name
// ("Blue", "rebeccapurple", "rgb(1,2,3)"), plus a swatch button that opens an
// in-page picker (preset grid, saturation/value square, hue slider).
//
// The original <input type="color"> stays in the DOM as the hidden value
// carrier, so the tab wiring in background.js / text.js / border.js keeps
// reading .val() and listening for "change" unchanged. Its native picker is
// deliberately no longer reachable: that UI is drawn by the OS outside the
// page, so pasted values and typed color names could not be handled there.

var colorFields = {};

function isColorField(inputElemId) {
  const el = document.getElementById(inputElemId);
  return !!el && (el.type === "color" || el.classList.contains("cf-native"));
}

function setupColorField(colorInputId, currentValue) {
  const native = document.getElementById(colorInputId);
  if (!native) return;

  let field = colorFields[colorInputId];
  if (!field) {
    field = buildColorField(native);
    colorFields[colorInputId] = field;
  }
  field.sync(arguments.length > 1 ? currentValue : native.value);
}

// ---------------------------------------------------------------- color math

function cfClamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function cfRgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map(function (v) {
        return cfClamp(Math.round(v), 0, 255).toString(16).padStart(2, "0");
      })
      .join("")
  );
}

function cfHexToRgb(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex || "");
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function cfRgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: h, s: max === 0 ? 0 : d / max, v: max };
}

function cfHsvToRgb(h, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let t;
  if (h < 60) t = [c, x, 0];
  else if (h < 120) t = [x, c, 0];
  else if (h < 180) t = [0, c, x];
  else if (h < 240) t = [0, x, c];
  else if (h < 300) t = [x, 0, c];
  else t = [c, 0, x];
  return { r: (t[0] + m) * 255, g: (t[1] + m) * 255, b: (t[2] + m) * 255 };
}

let cfProbe = null;

// Resolves anything the browser itself recognises as a color - named colors
// included - by letting the CSS parser do the work and reading the result back.
function cfCssColorToHex(raw) {
  const v = (raw || "").trim();
  if (!v) return null;
  if (!cfProbe) {
    cfProbe = document.createElement("span");
    cfProbe.style.display = "none";
    document.body.appendChild(cfProbe);
  }
  cfProbe.style.color = "";
  cfProbe.style.color = v;
  if (!cfProbe.style.color) return null;
  const m = /rgba?\(([^)]+)\)/.exec(getComputedStyle(cfProbe).color);
  if (!m) return null;
  const parts = m[1].split(",").map(parseFloat);
  if (parts.length > 3 && parts[3] === 0) return null;
  return cfRgbToHex(parts[0], parts[1], parts[2]);
}

function cfParseColor(raw) {
  let v = (raw || "").trim();
  if (!v) return null;
  if (/^(inherit|initial|unset|revert|currentcolor|none|auto|transparent)$/i.test(v)) return null;
  if (/^[0-9a-f]{3}$|^[0-9a-f]{6}$|^[0-9a-f]{8}$/i.test(v)) v = "#" + v;
  const direct = cfCssColorToHex(v);
  if (direct) return direct;
  // Shorthand values arrive with extras attached, e.g. the computed
  // "background" of an element: "rgb(255, 153, 0) none repeat scroll 0% 0%".
  const token = /(#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\))/i.exec(v);
  return token ? cfCssColorToHex(token[1]) : null;
}

// Whether the text is finished enough to act on while still being typed. A
// half-typed "#971414" passes through "#971", a valid 3-digit hex, so short
// hex only counts once the field is left.
function cfIsCompleteEntry(raw) {
  const v = (raw || "").trim();
  return /^#?[0-9a-f]{6}$/i.test(v) || /^[a-z]{3,}$/i.test(v);
}

// ------------------------------------------------------------------- picker

const CF_PRESETS = [
  "#000000", "#434343", "#666666", "#999999", "#B7B7B7", "#D9D9D9", "#FFFFFF",
  "#980000", "#FF0000", "#FF9900", "#FFFF00", "#00FF00", "#00FFFF", "#4A86E8",
  "#0000FF", "#9900FF", "#FF00FF", "#E6B8AF", "#F4CCCC", "#FCE5CD", "#FFF2CC",
  "#971414", "#1A73E8", "#0F9D58", "#5F6368", "#3D85C6", "#674EA7", "#A64D79",
];

let cfPopup = null;
let cfActiveField = null;

function cfBuildPopup() {
  if (cfPopup) return cfPopup;

  const pop = document.createElement("div");
  pop.className = "cf-pop";
  pop.innerHTML =
    '<div class="cf-pop-presets"></div>' +
    '<div class="cf-pop-main">' +
    '<div class="cf-sv"><div class="cf-sv-thumb"></div></div>' +
    '<div class="cf-hue"><div class="cf-hue-thumb"></div></div>' +
    "</div>" +
    '<div class="cf-pop-foot"><span class="cf-pop-preview"></span><span class="cf-pop-value"></span>' +
    '<button type="button" class="cf-pop-clear">Clear</button></div>';
  document.body.appendChild(pop);

  const presets = pop.querySelector(".cf-pop-presets");
  CF_PRESETS.forEach(function (hex) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "cf-preset";
    b.style.background = hex;
    b.title = hex;
    b.addEventListener("click", function () {
      if (cfActiveField) cfActiveField.setHex(hex, true);
      cfSyncPopupToField();
    });
    presets.appendChild(b);
  });

  const sv = pop.querySelector(".cf-sv");
  const hue = pop.querySelector(".cf-hue");

  cfDragTrack(sv, function (x, y) {
    if (!cfActiveField) return;
    const hsv = cfActiveField.hsv();
    cfApplyHsv(hsv.h, x, 1 - y);
  });

  cfDragTrack(hue, function (x, y) {
    if (!cfActiveField) return;
    const hsv = cfActiveField.hsv();
    cfApplyHsv(y * 360, hsv.s, hsv.v);
  });

  pop.querySelector(".cf-pop-clear").addEventListener("click", function () {
    if (cfActiveField) cfActiveField.setHex("", true);
    cfClosePopup();
  });

  pop.addEventListener("mousedown", function (e) {
    e.stopPropagation();
  });

  document.addEventListener("mousedown", function (e) {
    if (cfPopup && cfPopup.style.display === "block" && !cfPopup.contains(e.target)) cfClosePopup();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") cfClosePopup();
  });
  $("#propertiesModel").on("hidden.bs.modal", cfClosePopup);

  cfPopup = pop;
  return pop;
}

function cfApplyHsv(h, s, v) {
  cfActiveField.setHsv(cfClamp(h, 0, 359.99), cfClamp(s, 0, 1), cfClamp(v, 0, 1));
  cfSyncPopupToField();
}

// Tracks a pointer across the given surface, reporting 0..1 coordinates, and
// commits the colour to the document once the drag ends.
function cfDragTrack(surface, onMove) {
  function report(e) {
    const rect = surface.getBoundingClientRect();
    onMove(cfClamp((e.clientX - rect.left) / rect.width, 0, 1), cfClamp((e.clientY - rect.top) / rect.height, 0, 1));
  }
  surface.addEventListener("mousedown", function (e) {
    e.preventDefault();
    report(e);
    function move(ev) {
      report(ev);
    }
    function up() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      if (cfActiveField) cfActiveField.commit();
    }
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });
}

function cfSyncPopupToField() {
  if (!cfPopup || !cfActiveField) return;
  const hex = cfActiveField.hex();
  const hsv = cfActiveField.hsv();
  cfPopup.querySelector(".cf-sv").style.backgroundColor = "hsl(" + hsv.h + ", 100%, 50%)";
  const svThumb = cfPopup.querySelector(".cf-sv-thumb");
  svThumb.style.left = hsv.s * 100 + "%";
  svThumb.style.top = (1 - hsv.v) * 100 + "%";
  svThumb.style.background = hex || "#ffffff";
  cfPopup.querySelector(".cf-hue-thumb").style.top = (hsv.h / 360) * 100 + "%";
  const preview = cfPopup.querySelector(".cf-pop-preview");
  preview.style.backgroundColor = hex || "transparent";
  preview.classList.toggle("cf-empty", !hex);
  cfPopup.querySelector(".cf-pop-value").textContent = hex ? hex.toUpperCase() : "No color";
}

function cfOpenPopup(field, button) {
  const pop = cfBuildPopup();
  cfActiveField = field;
  pop.style.display = "block";
  pop.style.visibility = "hidden";
  const rect = button.getBoundingClientRect();
  let left = rect.right - pop.offsetWidth;
  let top = rect.bottom + 4;
  if (top + pop.offsetHeight > window.innerHeight - 8) top = Math.max(8, rect.top - pop.offsetHeight - 4);
  pop.style.left = cfClamp(left, 8, window.innerWidth - pop.offsetWidth - 8) + "px";
  pop.style.top = top + "px";
  pop.style.visibility = "";
  cfSyncPopupToField();
}

function cfClosePopup() {
  if (cfPopup) cfPopup.style.display = "none";
  cfActiveField = null;
}

// -------------------------------------------------------------------- field

function buildColorField(native) {
  const $native = $(native);
  const wrap = document.createElement("div");
  wrap.className = "cf input-group";
  native.parentNode.insertBefore(wrap, native);
  wrap.appendChild(native);
  native.classList.add("cf-native");
  // Now a hidden value carrier rather than a control: as type="color" it would
  // silently reject "" (the app's "no color" value) and any non-hex CSS color.
  native.type = "text";

  const text = document.createElement("input");
  text.type = "text";
  text.className = "form-control cf-text";
  text.autocomplete = "off";
  text.placeholder = native.getAttribute("placeholder") || "#RRGGBB or name";

  const append = document.createElement("div");
  append.className = "input-group-append";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn cf-swatch-btn";
  const swatch = document.createElement("span");
  swatch.className = "cf-swatch";
  button.appendChild(swatch);
  append.appendChild(button);

  wrap.appendChild(text);
  wrap.appendChild(append);

  let hex = "";
  let hsv = { h: 0, s: 1, v: 1 };
  let committed = null;

  // backgroundColor, not the background shorthand: the shorthand would reset
  // background-image and hide the "no color" checkerboard drawn by .cf-empty.
  function paint() {
    swatch.style.backgroundColor = hex || "transparent";
    swatch.classList.toggle("cf-empty", !hex);
  }

  const field = {
    hex: function () {
      return hex;
    },
    hsv: function () {
      return hsv;
    },
    // Drives the field straight from the picker's own coordinates. Going via a
    // hex round-trip instead would lose the hue on greys and blacks, where
    // every hue maps to the same colour, and strand the hue slider.
    setHsv: function (h, s, v) {
      hsv = { h: h, s: s, v: v };
      const rgb = cfHsvToRgb(h, s, v);
      hex = cfRgbToHex(rgb.r, rgb.g, rgb.b);
      text.value = hex.toUpperCase();
      text.classList.remove("is-invalid");
      paint();
    },
    // Sets the colour, optionally pushing it to the app. Hue is preserved on
    // greys and blacks so dragging the picker's value slider down to black and
    // back up doesn't reset the hue to red.
    setHex: function (next, commit) {
      hex = next || "";
      const rgb = cfHexToRgb(hex);
      if (rgb) {
        const nextHsv = cfRgbToHsv(rgb.r, rgb.g, rgb.b);
        hsv = { h: nextHsv.s === 0 ? hsv.h : nextHsv.h, s: nextHsv.s, v: nextHsv.v };
      }
      text.value = hex ? hex.toUpperCase() : "";
      text.classList.remove("is-invalid");
      paint();
      if (commit) field.commit();
    },
    // Typing a complete value applies it live, and leaving the field applies
    // it again - the guard keeps that from rebuilding the preview twice.
    commit: function () {
      if (hex === committed) return;
      committed = hex;
      $native.val(hex).trigger("change");
    },
    sync: function (rawValue) {
      const parsed = cfParseColor(rawValue);
      hex = parsed || "";
      committed = hex;
      if (parsed) {
        const rgb = cfHexToRgb(parsed);
        hsv = cfRgbToHsv(rgb.r, rgb.g, rgb.b);
      }
      text.value = hex ? hex.toUpperCase() : "";
      text.classList.remove("is-invalid");
      paint();
      $native.val(hex);
    },
  };

  // Live feedback while typing, but the text itself is only rewritten once the
  // entry is finished, so typing is never fought mid-word.
  text.addEventListener("input", function () {
    if (!text.value.trim()) return;
    if (!cfIsCompleteEntry(text.value)) return;
    const parsed = cfParseColor(text.value);
    if (!parsed) return;
    hex = parsed;
    const rgb = cfHexToRgb(parsed);
    hsv = cfRgbToHsv(rgb.r, rgb.g, rgb.b);
    paint();
    field.commit();
    if (cfActiveField === field) cfSyncPopupToField();
  });

  text.addEventListener("paste", function (e) {
    const clipboard = (e.clipboardData || window.clipboardData).getData("text");
    const parsed = cfParseColor(clipboard);
    if (!parsed) return;
    e.preventDefault();
    field.setHex(parsed, true);
    if (cfActiveField === field) cfSyncPopupToField();
  });

  text.addEventListener("change", function () {
    if (!text.value.trim()) {
      field.setHex("", true);
      return;
    }
    const parsed = cfParseColor(text.value);
    if (parsed) {
      field.setHex(parsed, true);
      if (cfActiveField === field) cfSyncPopupToField();
    } else {
      text.classList.add("is-invalid");
    }
  });

  text.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      text.blur();
    }
  });

  button.addEventListener("mousedown", function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (cfActiveField === field && cfPopup && cfPopup.style.display === "block") cfClosePopup();
    else cfOpenPopup(field, button);
  });

  paint();
  return field;
}
