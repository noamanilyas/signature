function renderTextTab(id) {
  // $("#text-text").jqte();
  $("#text-text").jqte({
    change: function (item) {
      $(`#${id}`).html($(".jqte_editor").html());
      converToTableFunc();
    },
  });
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
  resetTextTab(inputElemArr, formatters);
  setTimeout(function () {
    textTextValue(id);

    inputElemArr.forEach(function (value, key, myArray) {
      fillAndAddEvent(id, value.inputElem, value.cssProperty, value.valAppend);
    });

    formatters.forEach(function (value, key, myArray) {
      fillAndFormat(id, value);
    });
  }, 100);

  // Clear format btn
  // clearFormatting(id);
}

// function clearFormatting(id) {
//   $(`#${"text-format-CL"}`).on("click", function () {
//     formatters.forEach(function (value, key, myArray) {
//       removeCSSClass(value.cssProperty, id, value.inputElem);
//     });
//   });
// }
function textTextValue(id) {
  $("#text-text").off();
  // console.log($(`#${id}`).text());
  // console.log($("#text-text").val());
  // $("#text-text").val("here");

  // const currentText = $(`#${id}`).text();
  // $("#text-text").val(currentText);
  // $("#text-text").on("change", function () {
  //   $(`#${id}`).text(this.value);
  //   converToTableFunc();
  // });

  const currentText = $(`#${id}`).html();
  $("#text-text").jqteVal(currentText);

  // $("#text-text").on("change", function () {
  //   $(`#${id}`).text(this.value);
  //   converToTableFunc();
  // });
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
    console.log(element);
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

function resetTextTab(inputElemArr, formatters) {
  inputElemArr?.forEach(function (value, key, myArray) {
    $(`#${value.inputElem}`).off();
  });
  formatters?.forEach(function (value, key, myArray) {
    $(`#${value.inputElem}`).off();
    $(`#${value.inputElem}`).removeClass("active");
  });
  // inputElemArr.each(function (index, item) {});
  // $(selector).off();
  $("#text-form").trigger("reset");
}
