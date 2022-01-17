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
  let element = document.querySelector(`#${id}`).getAttribute(cssProperty);
  if (element) {
    element = parseInt(element);
    $(`#${inputElem}`).val(element);
  }
  // Add event listeners
  $(`#${inputElem}`).on("change", function () {
    // let obj = {};
    const val = this.value.trim();

    if (val) {
      let value = val.indexOf(valAppend) === -1 ? val + valAppend : val;
      // obj[cssProperty] = value;
      // $(`#${id}`).parent().css(obj);
      // $(`#${id}`).css(cssProperty, value);
      $(`#${id}`).parent().css(cssProperty, value);
      $(`#${id}`).attr(cssProperty, value);
    } else {
      // $(`#${id}`).css(cssProperty, "");
      $(`#${id}`).parent().css(cssProperty, "");
      $(`#${id}`).removeAttr(cssProperty);
    }

    converToTableFunc();
  });
}

// function fillAndAddEventPadding(id, inputElem, cssProperty, valAppend) {
//   // Get existing value

//   if ($(`#${id}`).is("img")) {
//     let element = document.querySelector(`#${id}`).parentElement.getAttribute(cssProperty);
//     if (element) {
//       element = parseInt(element);
//       $(`#${inputElem}`).val(element);
//     }
//   } else {
//     let element = document.querySelector(`#${id}`).getAttribute(cssProperty);
//     if (element) {
//       element = parseInt(element);
//       $(`#${inputElem}`).val(element);
//     }
//   }

//   // Add event listeners
//   $(`#${inputElem}`).on("change", function () {
//     let obj = {};
//     let value = this.value.indexOf(valAppend) === -1 ? this.value + valAppend : this.value;
//     obj[cssProperty] = value;
//     console.log(obj);
//     // $(`#${id}`).parent().css(obj);
//     if ($(`#${id}`).is("img")) {
//       $(`#${id}`).parent().css(cssProperty, value);
//     } else {
//       $(`#${id}`).css(cssProperty, value);
//     }
//     $(`#${id}`).attr(cssProperty, value);
//     converToTableFunc();
//   });
// }

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
