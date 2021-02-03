function renderPaddingTab(id) {
  resetPaddingTab(inputElemArrPadding);
  setTimeout(function () {
    inputElemArrPadding.forEach(function (value, key, myArray) {
      fillAndAddEventPadding(id, value.inputElem, value.cssProperty, value.valAppend);
    });
  }, 100);
}

function fillAndAddEventPadding(id, inputElem, cssProperty, valAppend) {
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
    console.log(obj);
    // $(`#${id}`).parent().css(obj);
    $(`#${id}`).attr(cssProperty, value);
    converToTableFunc();
  });
}

function resetPaddingTab(inputElemArr) {
  inputElemArr?.forEach(function (value, key, myArray) {
    $(`#${value.inputElem}`).off();
  });
  $("#padding-form").trigger("reset");
}
const inputElemArrPadding = [
  {
    inputElem: "padding-all",
    cssProperty: "padding",
    valAppend: "px",
  },
  {
    inputElem: "padding-left",
    cssProperty: "padding-left",
    valAppend: "px",
  },
  {
    inputElem: "padding-right",
    cssProperty: "padding-right",
    valAppend: "px",
  },
  {
    inputElem: "padding-top",
    cssProperty: "padding-top",
    valAppend: "px",
  },
  {
    inputElem: "padding-bottom",
    cssProperty: "padding-bottom",
    valAppend: "px",
  },
];
