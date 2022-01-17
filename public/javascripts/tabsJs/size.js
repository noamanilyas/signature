function renderSizeTab(id) {
  console.log("size");
  const inputElemArr = [
    {
      inputElem: "size-width",
      cssProperty: "width",
      valAppend: "px",
    },
    {
      inputElem: "size-height",
      cssProperty: "height",
      valAppend: "px",
    },
  ];

  resetSizeTab(inputElemArr);

  inputElemArr.forEach(function (value, key, myArray) {
    fillAndAddSizeEvent(id, value.inputElem, value.cssProperty, value.valAppend);
  });
}

function fillAndAddSizeEvent(id, inputElem, cssProperty, valAppend) {
  // Get existing value
  let element = document.querySelector(`#${id}`).style[cssProperty];
  if (element) {
    element = parseInt(element);
    $(`#${inputElem}`).val(element);
  }
  // Add event listeners
  $(`#${inputElem}`).on("change", function () {
    let obj = {};
    const val = this.value.trim();
    if (val) {
      obj[cssProperty] = val.indexOf(valAppend) === -1 ? val + valAppend : val;
      // console.log(obj);
      $(`#${id}`).css(obj);
      if ($(`#${id}`).is("img")) {
        $(`#${id}`).attr(cssProperty, obj[cssProperty]);
      }
    } else {
      obj[cssProperty] = "";
      $(`#${id}`).css(obj);
      if ($(`#${id}`).is("img")) {
        $(`#${id}`).removeAttr(cssProperty);
      }
    }

    converToTableFunc();
  });
}

function resetSizeTab(inputElemArr) {
  inputElemArr.forEach(function (value, key, myArray) {
    $(`#${value.inputElem}`).off();
  });

  $("#size-form").trigger("reset");
}
