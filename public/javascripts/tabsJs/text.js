var currentActiveId = "";

var customeFontsArray = [];

const customFontFileSelector = `#customFontFile`;

$("#propertiesModel").on("hidden.bs.modal", function () {
  console.log("===========Model Closed===========");
  currentActiveId = "";
  setEditorContent("");
});

function getCurrentActiveId() {
  return currentActiveId;
}

// ---- Rich text editor (TinyMCE) ----
// The text field is an inline <span>, so the editor runs without a root block
// (no <p>/<div> wrappers; Enter inserts <br>) to keep the span's content
// purely inline.
var textEditor = null;
var editorLoading = false;
var pendingEditorContent = null;

// Element-level toggles shown in the editor toolbar (they apply to the whole
// text element, unlike bold/italic/etc. which apply to the selection).
const elementToggles = [
  { name: "gsSmallCaps", text: "Tt", tip: "Small caps", prop: "font-variant", val: "small-caps", clears: ["text-transform"] },
  { name: "gsUpper", text: "AB", tip: "Uppercase", prop: "text-transform", val: "uppercase", clears: ["font-variant"] },
  { name: "gsLower", text: "ab", tip: "Lowercase", prop: "text-transform", val: "lowercase", clears: ["font-variant"] },
  { name: "gsLtr", text: "LTR", tip: "Left to right", prop: "direction", val: "ltr", attr: "dir" },
  { name: "gsRtl", text: "RTL", tip: "Right to left", prop: "direction", val: "rtl", attr: "dir" },
];

function currentTextEl() {
  return currentActiveId ? document.getElementById(currentActiveId) : null;
}

function toggleElementStyle(t) {
  const el = currentTextEl();
  if (!el) return;
  const on = el.style[t.prop] === t.val;
  $(el).css(t.prop, on ? "" : t.val);
  if (!on) (t.clears || []).forEach((c) => $(el).css(c, ""));
  if (t.attr) {
    if (on) $(el).removeAttr(t.attr);
    else $(el).attr(t.attr, t.val);
  }
  converToTableFunc();
}

function initTextEditor() {
  // Bootstrap's modal focus trap steals focus from TinyMCE's dialogs (e.g. the
  // link dialog), which live outside the modal's DOM.
  $(document).on("focusin", function (e) {
    if ($(e.target).closest(".tox-tinymce-aux, .tox-dialog, .tox-menu").length) e.stopImmediatePropagation();
  });

  tinymce.init({
    selector: "#text-text",
    base_url: "https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3",
    suffix: ".min",
    license_key: "gpl",
    height: 260,
    menubar: false,
    statusbar: false,
    branding: false,
    promotion: false,
    forced_root_block: false,
    newline_behavior: "linebreak",
    plugins: "link lists",
    toolbar_mode: "wrap",
    toolbar_sticky: false,
    toolbar:
      "bold italic underline strikethrough removeformat | " +
      "forecolor backcolor | link unlink | bullist numlist | " +
      "gsSmallCaps gsUpper gsLower gsLtr gsRtl",
    font_size_formats: "8px 9px 10px 11px 12px 13px 14px 16px 18px 20px 24px 28px 32px 36px",
    link_default_target: "_blank",
    link_title: false,
    target_list: false,
    convert_urls: false,
    setup: function (editor) {
      textEditor = editor;
      elementToggles.forEach(function (t) {
        editor.ui.registry.addToggleButton(t.name, {
          text: t.text,
          tooltip: t.tip,
          onAction: function () {
            toggleElementStyle(t);
            editor.dispatch("gsRefresh");
          },
          onSetup: function (api) {
            const refresh = function () {
              const el = currentTextEl();
              api.setActive(!!el && el.style[t.prop] === t.val);
            };
            refresh();
            editor.on("NodeChange gsRefresh", refresh);
            return function () {
              editor.off("NodeChange gsRefresh", refresh);
            };
          },
        });
      });
      editor.on("init", function () {
        if (pendingEditorContent !== null) setEditorContent(pendingEditorContent);
      });
      editor.on("input change keyup ExecCommand", syncEditorToElement);
    },
  });
}


function setEditorContent(html) {
  if (!textEditor || !textEditor.initialized) {
    pendingEditorContent = html;
    return;
  }
  pendingEditorContent = null;
  editorLoading = true;
  try {
    textEditor.setContent(html || "");
    textEditor.undoManager.clear();
    textEditor.dispatch("gsRefresh");
  } finally {
    editorLoading = false;
  }
}

function syncEditorToElement() {
  if (editorLoading || !currentActiveId || !textEditor) return;
  $(`#${currentActiveId}`).html(textEditor.getContent());
  converToTableFunc();
}

function renderTextTab(id) {
  currentActiveId = id;
  console.log("Render Called");
  const inputElemArr = [
    {
      inputElem: "text-fontFamily",
      cssProperty: "font-family",
      valAppend: "",
    },
    {
      inputElem: "text-fontSize",
      cssProperty: "font-size",
      valAppend: "px",
    },
    {
      inputElem: "text-background-color",
      cssProperty: "background-color",
      valAppend: "",
    },
    {
      inputElem: "text-line-height",
      cssProperty: "line-height",
      valAppend: "px",
    },
  ];
  const wrappers = [
    {
      inputElem: "text-wrap",
      cssProperty: "white-space",
      cssPropertyVal: "normal",
      valAppend: "",
    },
    {
      inputElem: "text-no-wrap",
      cssProperty: "white-space",
      cssPropertyVal: "nowrap",
      valAppend: "",
    },
  ];

  resetTextTab(inputElemArr, wrappers);

  // Add current val JQTE
  const currentText = $(`#${getCurrentActiveId()}`).html();
  // Need Fix: Disables hover on all texts when click group
  setEditorContent(currentText);

  // textTextValue(id);
  // $("#text-text").jqte();
  // $("#text-text").jqte();
  setTimeout(function () {
    // textTextValue(id);

    inputElemArr.forEach(function (value, key, myArray) {
      fillAndAddEvent(id, value.inputElem, value.cssProperty, value.valAppend);
    });

    wrappers.forEach(function (value, key, myArray) {
      fillAndWrapping(id, value);
    });


    // Must (re)init after resetTextTab's blanket .off(), which strips the
    // autocomplete widget's internal event bindings along with everything else.
    initFontFamilyAutocomplete();
  }, 100);

  // Clear format btn
  // clearFormatting(id);

  // Add events on customFontInput
  customFontEvents();
}

function fillAndWrapping(id, item) {
  let { inputElem, cssProperty, cssPropertyVal } = item;
  // Get existing value
  const element = document.querySelector(`#${id}`).style[cssProperty];
  if (element && cssPropertyVal === element) {
    $(`#${inputElem}`).addClass("active");
  }
  // Add event listeners
  $(`#${inputElem}`).on("click", function () {
    // If already exists then remove
    // console.log(document.querySelector(`#${id}`));
    // console.log(document.querySelector(`#${id}`).style);
    const element = document.querySelector(`#${id}`).style[cssProperty];
    if (element && cssPropertyVal === element) {
      // removeCSSClass(cssProperty, id, inputElem);
      // To be removed
    } else {
      console.log("here");
      // disable others cannot have small caps, lowercase and uppercase at a time
      if (cssPropertyVal === "nowrap") {
        removeCSSClass("normal", id, "text-wrap");
        // removeCSSClass("text-transform", id, "text-format-LC");
      } else if (cssPropertyVal === "normal") {
        removeCSSClass("nowrap", id, "text-no-wrap");
      }
      // If not exists then add
      let obj = {};
      obj[cssProperty] = cssPropertyVal;
      // console.log($(`#${id}`));
      $(`#${id}`).css(obj);
      $(`#${id}`).find("span").css(obj);
      $(`#${inputElem}`).addClass("active");
    }
    converToTableFunc();
  });
}
// Remove css property & active class from elem
function removeCSSClass(cssProperty, id, inputElem) {
  let obj = {};
  obj[cssProperty] = "";
  $(`#${id}`).css(obj);
  // Remove white-space from all spans if nowrap or wrap is selected
  if (inputElem === "text-wrap" || inputElem === "text-no-wrap") {
    $(`#${id}`).find("span").css(obj);
    $(`#${id}`).parent().css({ 'max-width': '50vw' });
  }
  $(`#${inputElem}`).removeClass("active");
}

function fillAndAddEvent(id, inputElem, cssProperty, valAppend) {
  // Get existing value
  const element = document.querySelector(`#${id}`).style[cssProperty];
  if (element) {
    $(`#${inputElem}`).val(element);
  }
  if (isColorField(inputElem)) {
    setupColorField(inputElem, element);
  }
  // Add event listeners
  $(`#${inputElem}`).on("change", function () {
    let obj = {};
    obj[cssProperty] = this.value.indexOf(valAppend) === -1 ? this.value + valAppend : this.value;
    console.log(obj);
    console.log(`#${id}`);
    $(`#${id}`).css(obj);
    converToTableFunc();
  });
}

function resetTextTab(inputElemArr, wrappers) {
  inputElemArr?.forEach(function (value, key, myArray) {
    $(`#${value.inputElem}`).off();
  });
  wrappers?.forEach(function (value, key, myArray) {
    $(`#${value.inputElem}`).off();
    $(`#${value.inputElem}`).removeClass("active");
  });

  $(customFontFileSelector).off();
  // inputElemArr.each(function (index, item) {});
  // $(selector).off();
  $("#text-form").trigger("reset");
  // $("#text-text").off();
  // $("#text-text").jqte();
  // $("#text-text").jqteVal("");
}

function customFontEvents() {
  $(customFontFileSelector).on("change", function () {
    importFontFileandPreview();
  });

  function importFontFileandPreview() {
    // var preview = document.querySelector(`#${id}`);
    var file = document.querySelector(customFontFileSelector).files[0];

    var fileSize = parseFloat(file.size / 1024).toFixed(2);

    if (fileSize > 170) {
      $("#uploadSizeErrorFont").show();
      setTimeout(function () {
        $("#uploadSizeErrorFont").hide();
      }, 5000);
      $(customFontFileSelector).val("");
      return;
    }

    var reader = new FileReader();

    reader.addEventListener(
      "load",
      function () {
        const fontName = file.name.split(".")[0];
        let font = new FontFace(fontName, `url(${reader.result}) format("woff2")`);
        font
          .load()
          .then(function (loadedFont) {
            document.fonts.add(loadedFont);
            const fontId = `font-${Date.now()}`;

            // Add to array
            customeFontsArray.push(fontName);

            // Add font to the autocomplete suggestions
            addFontToAutocomplete(fontName);

            // Add font to html for future use
            const newDiv = document.createElement("div");
            newDiv.id = fontId;
            newDiv.className = `fontDiv ${fontId}`;
            newDiv.dataset.fontName = fontName;
            newDiv.dataset.fontUrl = reader.result;
            const customFontDiv = document.querySelector("#customeFontDiv");
            customFontDiv.append(newDiv);

            // Append font to font list for deleteing
            const fontDeleteList = document.querySelector("ul.customFontListShow");
            fontDeleteList.append(
              $(
                `<li class="list-group-item ${fontId}"> ${fontName} <button class="btn btn-danger removeFontButton" type="button" data-font-id="${fontId}" style="float: right">Remove</button> </li>`
              )[0]
            );
            $(".removeFontButton").off();
            $("button.removeFontButton").click(function (e) {
              const fontId = e.target.dataset.fontId;
              // $(`#drop #customeFontDiv #${fontId}`).remove();
              $(`.${fontId}`).remove();
            });

            document.getElementById(customFontFileSelector).value = "";
          })
          .catch(function (error) {
            // error occurred
          });
        // preview.src = reader.result;
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }
}
document.getElementById("propTabs").addEventListener("click", function () {
  edited = true; // Set the flag to true when there is an input change
});