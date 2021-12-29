function renderHyperLinkTab(id) {
  console.log("hyperLink");
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

  fillAndAddEventHyperlink(id);
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

  converToTableFunc();
}

function resetHyperLinkTab(inputElemArr) {
  inputElemArr.forEach(function (value, key, myArray) {
    $(`#${value.inputElem}`).off();
  });

  $("#hyperLink-form").trigger("reset");
}
