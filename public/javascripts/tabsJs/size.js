function renderSizeTab(id) {
  console.log("size");
  const inputElemArr = [
    {
      inputElem: "size-width",
      cssProperty: "width",
      valAppend: "px",
      companions: ["min-width", "max-width"],
    },
    {
      inputElem: "size-height",
      cssProperty: "height",
      valAppend: "px",
      companions: ["min-height", "max-height"],
    },
  ];

  resetSizeTab(inputElemArr);

  inputElemArr.forEach(function (value, key, myArray) {
    fillAndAddSizeEvent(id, value.inputElem, value.cssProperty, value.valAppend, value.companions);
  });
}

function fillAndAddSizeEvent(id, inputElem, cssProperty, valAppend, companions) {
  companions = companions || [];
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
      const cssVal = val.indexOf(valAppend) === -1 ? val + valAppend : val;
      obj[cssProperty] = cssVal;
      companions.forEach(function (companionProperty) {
        obj[companionProperty] = cssVal;
      });
      // console.log(obj);
      $(`#${id}`).css(obj);
      if ($(`#${id}`).is("img")) {
        $(`#${id}`).attr(cssProperty, cssVal.split("px")[0]);
      }
    } else {
      obj[cssProperty] = "";
      companions.forEach(function (companionProperty) {
        obj[companionProperty] = "";
      });
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
