function renderBackgroundTab(id) {
  const inputElem = "background-colorInput";
  const fileInput = "background-imageFile";
  const radioSelector = "input[type=radio][name=backgroundRadios]";
  $(radioSelector).off();
  resetBackgroundTab(fileInput);
  // resetImageTab(radioSelector);
  resetBackgroundTab(inputElem);

  const defaultSRC = "";
  const element = document.querySelector(`#${id}`).parentElement.style["background"];
  const inputValSet = $(`#${id}`).parent().attr("backGValSet");

  if (element && (inputValSet == true || inputValSet == "true")) {
    console.log("inside");
    $(`#${inputElem}`).val(element);
    $(`#${"background-color"}`).attr("checked", true);
  }
  // Add event listeners
  $(`#${inputElem}`).on("change", function () {
    if (this.value !== "") {
      $(`#${"background-color"}`).attr("checked", true);
      $(`#${id}`).parent().css({ background: this.value });
      $(`#${id}`).parent().attr("backGValSet", true);
      $(`#${id}`).attr("background", this.value);
    } else {
      $(`#${id}`).parent().css({ background: "" });
      $(`#${id}`).attr("background", "");
      $(`#${id}`).parent().attr("backGValSet", false);
    }
    $(`#${"background-color"}`).attr("checked", true);
    converToTableFunc();
  });

  // check existing image

  // Image upload

  $(`#${fileInput}`).on("change", function () {
    $(`#${"background-imagefile"}`).attr("checked", true);
    importFileandPreview();
    converToTableFunc();
  });

  function importFileandPreview() {
    var preview = document.querySelector(`#${id}`).parentElement;
    var file = document.querySelector(`#${fileInput}`).files[0];
    console.log(file);

    // Add file name to image attr
    $(`#${id}`).parent().attr("filename", file.name);

    $(`#${inputElem}`).val("");

    var reader = new FileReader();

    reader.addEventListener(
      "load",
      function () {
        preview.style.background = `url(${reader.result})`;
        $(`#${id}`).parent().attr("backGValSet", false);
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  $(radioSelector).on("change", function () {
    if (this.value === "none") {
      $(`#${id}`).parent().css({ background: "" });
      $(`#${id}`).attr("background", "");
      $(`#${id}`).parent().attr("backGValSet", false);
      $(`#${id}`).attr("link", false);
      $(`#${inputElem}`).val("");
      $(`#${id}`).attr("src", defaultSRC);
    }
    converToTableFunc();
  });
}

function resetBackgroundTab(inputElem) {
  $(`#${inputElem}`).off();
  $("#background-form").trigger("reset");
}
