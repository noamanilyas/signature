function renderHyperLinkTab(id) {
  console.log("size");
  const inputElemArr = [
    {
      inputElem: "hyperlink_url",
      cssProperty: "width",
      valAppend: "px",
    },
    {
      inputElem: "hyperlink_alt_text",
      cssProperty: "height",
      valAppend: "px",
    },
  ];

  resetHyperLinkTab(inputElemArr);

  // inputElemArr.forEach(function (value, key, myArray) {
  fillAndAddEventHyperlink(id);
  // });
}

function fillAndAddEventHyperlink(id) {
  // Hyperlink
  const element = $(`#${id}`);
  // update url in text field
  if ($(`#${id}`).attr("hyperlink")) {
    $(`#hyperlink_url`).val($(`#${id}`).attr("hyperlink"));
  }

  // update text in alt text field
  $(`#hyperlink_alt_text`).val($(`#${id}`).attr("alt"));

  // Add event listeners on hyperlink
  $(`#hyperlink_url`).on("change", function () {
    const newValue = this.value.trim();
    if (newValue.length) {
      // add hyperlink url into data // hyper link will be added in convertToTable
      $(`#${id}`).attr("hyperlink", newValue);
    } else {
      // remove hyperlink if exists
      if ($(`#${id}`).attr("hyperlink")) {
        $(`#${id}`).removeAttr("hyperlink");
      }
    }
    converToTableFunc();
  });

  // Alt text
  $(`#hyperlink_alt_text`).on("change", function () {
    const newValue = this.value.trim();
    if (newValue.length) {
      // add hyperlink url into data // hyper link will be added in convertToTable
      $(`#${id}`).attr("alt", newValue);
      $(`#${id}`).attr("title", newValue);
    } else {
      // remove hyperlink if exists
      $(`#${id}`).attr("alt", "Image");
      $(`#${id}`).attr("title", "Image");
    }
    converToTableFunc();
  });

  // // Get existing value
  // const element = document.querySelector(`#${id}`).style[cssProperty];
  // if (element) {
  //   $(`#${inputElem}`).val(element);
  // }
  // // Add event listeners
  // $(`#${inputElem}`).on("change", function () {
  //   let obj = {};
  //   obj[cssProperty] = this.value.indexOf(valAppend) === -1 ? this.value + valAppend : this.value;
  //   console.log(obj);
  //   console.log(`#${id}`);
  //   $(`#${id}`).css(obj);
  converToTableFunc();
  // });
}

function resetHyperLinkTab(inputElemArr) {
  inputElemArr.forEach(function (value, key, myArray) {
    $(`#${value.inputElem}`).off();
  });

  $("#size-form").trigger("reset");
}
