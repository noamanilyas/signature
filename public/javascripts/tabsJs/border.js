function renderBorderTab(id) {
  console.log("borderTab");

  resetBorderTab(inputElemArrBorder);
  setTimeout(function () {
    inputElemArrBorder.forEach(function (value, key, myArray) {
      fillAndAddEventBorder(id, value.inputElem, value.cssProperty, value.valAppend);
    });

    // initSameAsAllBorder();
  }, 100);
}

// Remove css property & active class from elem

// function initSameAsAllBorder() {
//   const checked = $(`#${id}`).attr("border-same-checked");
//   if (checked == true) {
//     $(`#${inputElem}`).prop("checked", true);
//   } else {
//     $(`#${inputElem}`).prop("checked", true);
//   }

//   $("#border-sameall-check").on("change", function () {
//     if ($("#border-sameall-check").is(":checked")) {
//       // Disable all others
//       alert("checked");
//     } else {
//       // Enable all others disable
//       alert("unchecked");
//     }
//   });
// }

function fillAndAddEventBorder(id, inputElem, cssProperty, valAppend) {
  // Get existing value
  const element = document.querySelector(`#${id}`).getAttribute(cssProperty);
  if (element) {
    $(`#${inputElem}`).val(element);
  }
  // Add event listeners
  $(`#${inputElem}`).on("change", function () {
    let obj = {};
    let value = this.value.indexOf(valAppend) === -1 ? this.value + valAppend : this.value;
    obj[cssProperty] = value;
    $(`#${id}`).css(obj);
    $(`#${id}`).attr(cssProperty, value);
    converToTableFunc();
  });
}

function resetBorderTab(inputElemArr) {
  inputElemArr?.forEach(function (value, key, myArray) {
    $(`#${value.inputElem}`).off();
  });
  $("#border-form").trigger("reset");
}
const inputElemArrBorder = [
  {
    inputElem: "border-type-all",
    cssProperty: "border-style",
    valAppend: "",
  },
  {
    inputElem: "border-size-all",
    cssProperty: "border-width",
    valAppend: "px",
  },
  {
    inputElem: "border-color-all",
    cssProperty: "border-color",
    valAppend: "",
  },
  {
    inputElem: "border-type-left",
    cssProperty: "border-left-style",
    valAppend: "",
  },
  {
    inputElem: "border-size-left",
    cssProperty: "border-left-width",
    valAppend: "px",
  },
  {
    inputElem: "border-color-left",
    cssProperty: "border-left-color",
    valAppend: "",
  },
  {
    inputElem: "border-type-right",
    cssProperty: "border-right-style",
    valAppend: "",
  },
  {
    inputElem: "border-size-right",
    cssProperty: "border-right-width",
    valAppend: "px",
  },
  {
    inputElem: "border-color-right",
    cssProperty: "border-right-color",
    valAppend: "",
  },
  {
    inputElem: "border-type-top",
    cssProperty: "border-top-style",
    valAppend: "",
  },
  {
    inputElem: "border-size-top",
    cssProperty: "border-top-width",
    valAppend: "px",
  },
  {
    inputElem: "border-color-top",
    cssProperty: "border-top-color",
    valAppend: "",
  },
  {
    inputElem: "border-type-bottom",
    cssProperty: "border-bottom-style",
    valAppend: "",
  },
  {
    inputElem: "border-size-bottom",
    cssProperty: "border-bottom-width",
    valAppend: "px",
  },
  {
    inputElem: "border-color-bottom",
    cssProperty: "border-bottom-color",
    valAppend: "",
  },
];
