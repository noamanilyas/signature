var currentActiveId = "";

var customeFontsArray = [];

const customFontFileSelector = `#customFontFile`;

$("#propertiesModel").on("hidden.bs.modal", function () {
  console.log("===========Model Closed===========");
  currentActiveId = "";
  $("#text-text").jqteVal("**Text Place Holder**");
  $("#text-text").jqteVal("**Text Place Holder**");
});

function getCurrentActiveId() {
  return currentActiveId;
}

// Init JQTE
//JQTE
setTimeout(function () {
  // console.log("Text", $("#text-text")[0]);
  $("#text-text").jqte({
    status: true,
    // css: "jqte",
    title: false,
    // titletext: n,
    button: "OK",
    format: true,
    // formats: r,
    fsize: false,
    // fsizes: i,
    funit: "px",
    color: false,
    // linktypes: o,
    b: true,
    i: true,
    u: true,
    ol: false,
    ul: false,
    sub: false,
    sup: false,
    outdent: false,
    indent: false,
    left: false,
    center: false,
    right: false,
    strike: false,
    link: false,
    unlink: false,
    remove: true,
    rule: false,
    source: false,
    placeholder: false,
    br: false,
    p: false,
    // change: "",
    // focus: "",
    // blur: "",
    change: function () {
      setTimeout(function () {
        if ($(".jqte_editor").text().indexOf("**Text Place Holder**") === -1) {
          // console.log("jqte changed", `#${getCurrentActiveId()}`);
          $(`#${getCurrentActiveId()}`).html($(".jqte_editor").html());
          converToTableFunc();
        }
      }, 200);
    },
  });
}, 1000);

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
      inputElem: "text-foreground-color",
      cssProperty: "color",
      valAppend: "",
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
  const formatters = [
    {
      inputElem: "text-format-B",
      cssProperty: "font-weight",
      cssPropertyVal: "bold",
      valAppend: "",
    },
    {
      inputElem: "text-format-I",
      cssProperty: "font-style",
      cssPropertyVal: "italic",
      valAppend: "",
    },
    {
      inputElem: "text-format-U",
      cssProperty: "text-decoration",
      cssPropertyVal: "underline",
      valAppend: "",
    },
    {
      inputElem: "text-format-SC",
      cssProperty: "font-variant",
      cssPropertyVal: "small-caps",
      valAppend: "",
    },
    {
      inputElem: "text-format-UC",
      cssProperty: "text-transform",
      cssPropertyVal: "uppercase",
      valAppend: "",
    },
    {
      inputElem: "text-format-LC",
      cssProperty: "text-transform",
      cssPropertyVal: "lowercase",
      valAppend: "",
    },
    // {
    //   inputElem: "text-format-CL",
    //   cssProperty: "",
    //   cssPropertyVal: "",
    //   valAppend: "",
    // },
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

  resetTextTab(inputElemArr, formatters, wrappers);

  // Add current val JQTE
  const currentText = $(`#${getCurrentActiveId()}`).html();
  // Need Fix: Disables hover on all texts when click group
  $("#text-text").jqteVal(currentText);

  // textTextValue(id);
  // $("#text-text").jqte();
  // $("#text-text").jqte();
  setTimeout(function () {
    // textTextValue(id);

    inputElemArr.forEach(function (value, key, myArray) {
      fillAndAddEvent(id, value.inputElem, value.cssProperty, value.valAppend);
    });

    formatters.forEach(function (value, key, myArray) {
      fillAndFormat(id, value);
    });

    wrappers.forEach(function (value, key, myArray) {
      fillAndWrapping(id, value);
    });
  }, 100);

  // Clear format btn
  // clearFormatting(id);

  // Add events on customFontInput
  customFontEvents();
}

// function clearFormatting(id) {
//   $(`#${"text-format-CL"}`).on("click", function () {
//     formatters.forEach(function (value, key, myArray) {
//       removeCSSClass(value.cssProperty, id, value.inputElem);
//     });
//   });
// }

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
function textTextValue(id) {
  // $("#text-text").off();
  // console.log($(`#${id}`).text());
  // console.log($("#text-text").val());
  // $("#text-text").val("here");
  // const currentText = $(`#${id}`).text();
  // $("#text-text").val(currentText);
  // $("#text-text").on("change", function () {
  //   $(`#${id}`).text(this.value);
  //   converToTableFunc();
  // });
  //JQTE
  if ($(".jqte_editor").text().indexOf("**Text Place Holder**") !== -1) {
    const currentText = $(`#${getCurrentActiveId()}`).html();
    // $("#text-text").jqteVal("");
    setTimeout(function () {
      // console.log("current", currentText);
      $("#text-text").jqteVal(currentText);
      $("#text-text").jqteVal(currentText);
      $("#text-text").jqteVal(currentText);
    }, 100);
  }
}
function fillAndFormat(id, item) {
  let { inputElem, cssProperty, cssPropertyVal } = item;
  // Get existing value
  const element = document.querySelector(`#${id}`).style[cssProperty];
  // console.log(element);
  if (element && cssPropertyVal === element) {
    $(`#${inputElem}`).addClass("active");
  }
  // Add event listeners
  $(`#${inputElem}`).on("click", function () {
    // If already exists then remove
    const element = document.querySelector(`#${id}`).style[cssProperty];
    // console.log(element);
    if (element && cssPropertyVal === element) {
      // let obj = {};
      // obj[cssProperty] = "";
      // $(`#${id}`).css(obj);
      // $(`#${inputElem}`).removeClass("active");
      removeCSSClass(cssProperty, id, inputElem);
    } else {
      // disable others cannot have small caps, lowercase and uppercase at a time
      if (cssPropertyVal === "small-caps") {
        removeCSSClass("text-transform", id, "text-format-UC");
        removeCSSClass("text-transform", id, "text-format-LC");
      } else if (cssPropertyVal === "uppercase") {
        removeCSSClass("font-variant", id, "text-format-SC");
        removeCSSClass("text-transform", id, "text-format-LC");
      } else if (cssPropertyVal === "lowercase") {
        removeCSSClass("font-variant", id, "text-format-SC");
        removeCSSClass("text-transform", id, "text-format-UC");
      }
      // If not exists then add
      let obj = {};
      obj[cssProperty] = cssPropertyVal;
      $(`#${id}`).css(obj);
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
  }
  $(`#${inputElem}`).removeClass("active");
}

function fillAndAddEvent(id, inputElem, cssProperty, valAppend) {
  // Get existing value
  const element = document.querySelector(`#${id}`).style[cssProperty];
  if (element) {
    $(`#${inputElem}`).val(element);
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

function resetTextTab(inputElemArr, formatters, wrappers) {
  inputElemArr?.forEach(function (value, key, myArray) {
    $(`#${value.inputElem}`).off();
  });
  formatters?.forEach(function (value, key, myArray) {
    $(`#${value.inputElem}`).off();
    $(`#${value.inputElem}`).removeClass("active");
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

            // Prepend font to the font list
            const fontList = document.querySelector("#text-fontFamily");
            fontList.prepend();
            fontList.insertBefore(
              $(`<option class="${fontId}" value="${fontName}">${fontName}</option>`)[0],
              document.querySelector("#text-fontFamily").children[1]
            );

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
