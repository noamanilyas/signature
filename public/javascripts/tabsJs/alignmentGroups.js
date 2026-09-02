function getEditorTableOuter($table) {
  return $table.closest(".tableItem").children(".ph-table").first();
}

function applyEditorTableHorizontalAlign($table, textAlign) {
  if (!$table.hasClass("editor-table")) return;

  const $tableItem = $table.closest(".tableItem");
  const $outerPh = getEditorTableOuter($table);
  const $data = $table.closest(".data");
  const $drop = $("#drop");

  $table.removeAttr("width-stretch");
  $table.css({ width: "", display: "", "table-layout": "" });
  $tableItem.css({ display: "", width: "" });
  $data.css({ width: "", "text-align": "", display: "" });
  $outerPh.find(".ph-table, .ph-table-cell").css("width", "");

  // Reset so we can measure the natural (left) position and width
  $outerPh.css({
    display: "",
    width: "",
    "min-width": "",
    "max-width": "",
    "margin-left": "0px",
    "margin-right": "0px",
    position: "",
    left: "",
  });

  const dropOffset = $drop.offset();
  const dropWidth = $drop.outerWidth() || 0;
  const blockWidth = $outerPh.outerWidth() || 0;
  const naturalLeft = $outerPh.offset()?.left || 0;
  const dropLeft = dropOffset?.left || 0;

  let targetLeft = naturalLeft;
  if (textAlign === "center") {
    targetLeft = dropLeft + Math.max(0, (dropWidth - blockWidth) / 2);
  } else if (textAlign === "right") {
    targetLeft = dropLeft + Math.max(0, dropWidth - blockWidth);
  } else {
    targetLeft = dropLeft;
  }

  const offset = targetLeft - naturalLeft;

  // relative + left works even when the table-row parent shrink-wraps
  $outerPh.css({
    position: "relative",
    left: offset + "px",
    "margin-left": "0px",
    "margin-right": "0px",
  });
}

function applyEditorTableStretch($table) {
  if (!$table.hasClass("editor-table")) return;

  const $tableItem = $table.closest(".tableItem");
  const $outerPh = getEditorTableOuter($table);
  const $data = $table.closest(".data");
  const dropEl = document.getElementById("drop");
  const dropWidth = dropEl ? dropEl.getBoundingClientRect().width : $("#drop").outerWidth() || 0;

  $tableItem.css({
    display: "block",
    width: dropWidth ? `${dropWidth}px` : "100%",
  });
  $outerPh.css({
    display: "block",
    width: "100%",
    "min-width": dropWidth ? `${dropWidth}px` : "",
    "max-width": "none",
    "margin-left": "0px",
    "margin-right": "0px",
    position: "",
    left: "",
  });
  $data.css({ width: "100%", "text-align": "" });
  $table.css({ width: "100%", "margin-left": "", "margin-right": "" });
  $table.attr("width-stretch", "100%");
  $table.removeAttr("text-align");
}

function clearEditorTableHorizontalAlign($table) {
  if (!$table.hasClass("editor-table")) return;

  const $tableItem = $table.closest(".tableItem");
  const $outerPh = getEditorTableOuter($table);
  const $data = $table.closest(".data");

  $tableItem.css({ display: "", width: "" });
  $data.css({ width: "", "text-align": "", display: "" });
  $outerPh.css({
    display: "",
    width: "",
    "min-width": "",
    "max-width": "",
    "margin-left": "",
    "margin-right": "",
    position: "",
    left: "",
  });
  $outerPh.find(".ph-table, .ph-table-cell").css("width", "");
  $table.css({ display: "", width: "", "table-layout": "", "margin-left": "", "margin-right": "" });
}

function renderAlignmentTabGroup(id) {
  console.log("Alignment Group Called");
  resetAlignGpTab(formattersAlign);
  setTimeout(function () {
    formattersAlignGp.forEach(function (value, key, myArray) {
      fillAndFormatAlignGp(id, value);
    });
    const $table = $(`#${id}`);
    if ($table.hasClass("editor-table")) {
      if ($table.attr("width-stretch") === "100%") {
        applyEditorTableStretch($table);
      } else {
        const existingAlign = $table.attr("text-align");
        if (existingAlign) {
          applyEditorTableHorizontalAlign($table, existingAlign);
        }
      }
    }
  }, 100);
}

function fillAndFormatAlignGp(id, item) {
  let { inputElem, cssProperty, cssPropertyVal } = item;
  const element = document.querySelector(`#${id}`).parentElement.style[cssProperty];
  const elementAttrib = document.querySelector(`#${id}`).getAttribute(cssProperty);

  if ((element || elementAttrib) && (cssPropertyVal === element || cssPropertyVal === elementAttrib)) {
    $(`#${inputElem}`).addClass("active");
  }

  $(`#${inputElem}`).on("click", function () {
    removeActiveClassAll(formattersAlign, inputElem.split("-")[1]);
    const element = document.querySelector(`#${id}`).parentElement.style[cssProperty];
    const elementAttrib = document.querySelector(`#${id}`).getAttribute(cssProperty);

    if (cssProperty === "width-stretch") {
      $(`#${id}`).removeAttr("text-align");
      clearEditorTableHorizontalAlign($(`#${id}`));
    } else if (cssProperty === "text-align") {
      $(`#${id}`).removeAttr("width-stretch");
    }

    if ((element || elementAttrib) && (cssPropertyVal === element || cssPropertyVal === elementAttrib)) {
      let obj = {};
      obj[cssProperty] = "";
      $(`#${id}`).parent().css(obj);
      $(`#${id}`).removeAttr(cssProperty);
      if (cssProperty === "text-align" || cssProperty === "width-stretch") {
        clearEditorTableHorizontalAlign($(`#${id}`));
      }
      $(`#${inputElem}`).removeClass("active");
    } else {
      $(`#${id}`).parent().closest(".drag").css(cssProperty, cssPropertyVal);
      $(`#${id}`).attr(cssProperty, cssPropertyVal);
      if (cssProperty === "text-align") {
        applyEditorTableHorizontalAlign($(`#${id}`), cssPropertyVal);
      } else if (cssProperty === "width-stretch") {
        applyEditorTableStretch($(`#${id}`));
      }
      $(`#${inputElem}`).addClass("active");
    }
    setTimeout(function () {
      converToTableFunc();
    }, 50);
  });
}

function resetAlignGpTab(formattersAlign) {
  formattersAlign?.forEach(function (value, key, myArray) {
    $(`#${value.inputElem}`).off();
    $(`#${value.inputElem}`).removeClass("active");
  });
  $("#alignment-form").trigger("reset");
}

function removeActiveClassAllGp(formattersAlign, category) {
  formattersAlign?.forEach(function (value, key, myArray) {
    if (value.inputElem.split("-")[1] === category) $(`#${value.inputElem}`).removeClass("active");
  });
}

const formattersAlignGp = [
  {
    inputElem: "align-horiz-stretch",
    cssProperty: "width-stretch",
    cssPropertyVal: "100%",
  },
  {
    inputElem: "align-horiz-left",
    cssProperty: "text-align",
    cssPropertyVal: "left",
  },
  {
    inputElem: "align-horiz-right",
    cssProperty: "text-align",
    cssPropertyVal: "right",
  },
  {
    inputElem: "align-horiz-center",
    cssProperty: "text-align",
    cssPropertyVal: "center",
  },
  {
    inputElem: "align-vert-top",
    cssProperty: "vertical-align",
    cssPropertyVal: "top",
  },
  {
    inputElem: "align-vert-center",
    cssProperty: "vertical-align",
    cssPropertyVal: "middle",
  },
  {
    inputElem: "align-vert-bottom",
    cssProperty: "vertical-align",
    cssPropertyVal: "bottom",
  },
];
