function renderAlignmentTab(id) {
  resetAlignTab(formattersAlign);
  setTimeout(function () {
    formattersAlign.forEach(function (value, key, myArray) {
      fillAndFormatAlign(id, value);
    });
  }, 100);
}

// Remove css property & active class from elem
// function removeCSSClass(cssProperty, id, inputElem) {
//   console.log("I am here");
//   let obj = {};
//   obj[cssProperty] = "";
//   $(`#${id}`).parent().css(obj);
//   console.log("remove", cssProperty);
//   $(`#${id}`).removeAttr(cssProperty);
//   $(`#${inputElem}`).removeClass("active");
// }

function fillAndFormatAlign(id, item) {
  let { inputElem, cssProperty, cssPropertyVal } = item;
  // Get existing value
  const element = document.querySelector(`#${id}`).parentElement.style[cssProperty];
  const elementAttrib = document.querySelector(`#${id}`).getAttribute(cssProperty);

  if ((element || elementAttrib) && (cssPropertyVal === element || cssPropertyVal === elementAttrib)) {
    $(`#${inputElem}`).addClass("active");
  }
  // Add event listeners
  $(`#${inputElem}`).on("click", function () {
    // If already exists then remove
    removeActiveClassAll(formattersAlign, inputElem.split("-")[1]);
    const element = document.querySelector(`#${id}`).parentElement.style[cssProperty];
    const elementAttrib = document.querySelector(`#${id}`).getAttribute(cssProperty);

    if ((element || elementAttrib) && (cssPropertyVal === element || cssPropertyVal === elementAttrib)) {
      // removeCSSClass(cssProperty, id, inputElem);
      // Function was not working so moved code here

      let obj = {};
      obj[cssProperty] = "";
      $(`#${id}`).parent().css(obj);
      $(`#${id}`).removeAttr(cssProperty);
      $(`#${inputElem}`).removeClass("active");
    } else {
      $(`#${id}`).parent().closest(".drag").css(cssProperty, cssPropertyVal);
      $(`#${id}`).attr(cssProperty, cssPropertyVal);
      $(`#${inputElem}`).addClass("active");
    }
    setTimeout(function () {
      console.log(document.querySelector(`#${id}`).getAttribute(cssProperty));
      converToTableFunc();
    }, 50);
  });
}

function resetAlignTab(formattersAlign) {
  formattersAlign?.forEach(function (value, key, myArray) {
    $(`#${value.inputElem}`).off();
    $(`#${value.inputElem}`).removeClass("active");
  });
  // inputElemArr.each(function (index, item) {});
  // $(selector).off();
  $("#alignment-form").trigger("reset");
}

function removeActiveClassAll(formattersAlign, category) {
  formattersAlign?.forEach(function (value, key, myArray) {
    if (value.inputElem.split("-")[1] === category) $(`#${value.inputElem}`).removeClass("active");
  });
}

const formattersAlign = [
  {
    inputElem: "align-horiz-stretch",
    cssProperty: "width-stretch",
    cssPropertyVal: "100%",
  },
  // {
  //   inputElem: "align-text-left",
  //   cssProperty: "text-align",
  //   cssPropertyVal: "left",
  // },
  // {
  //   inputElem: "align-text-right",
  //   cssProperty: "text-align",
  //   cssPropertyVal: "right",
  // },
  // {
  //   inputElem: "align-text-center",
  //   cssProperty: "text-align",
  //   cssPropertyVal: "center",
  // },
  // {
  //   inputElem: "align-text-justify",
  //   cssProperty: "text-align",
  //   cssPropertyVal: "justify",
  // },
  // {
  //   inputElem: "align-text-inherit",
  //   cssProperty: "text-align",
  //   cssPropertyVal: "inherit",
  // },
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
  {
    inputElem: "align-horiz-left",
    cssProperty: "text-align",
    cssPropertyVal: "left",
  },
  {
    inputElem: "align-horiz-right",
    cssProperty: "text-align",
    cssPropertyVal: "-webkit-right",
  },
  {
    inputElem: "align-horiz-center",
    cssProperty: "text-align",
    cssPropertyVal: "-webkit-center",
  },
];
