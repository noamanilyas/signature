function renderTableTab(id) {
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

  resetTextTab(inputElemArr);

  inputElemArr.forEach(function (value, key, myArray) {
    fillAndAddEvent(id, value.inputElem, value.cssProperty, value.valAppend);
  });
}

function fillAndAddEventTable(id, inputElem, cssProperty, valAppend) {
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

function resetTableTab(inputElemArr) {
  inputElemArr.forEach(function (value, key, myArray) {
    $(`#${value.inputElem}`).off();
  });

  $("#size-form").trigger("reset");
}
