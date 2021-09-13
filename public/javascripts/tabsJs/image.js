function renderImageTab(id) {
  const inputElem = "image-imageURL";
  const fileInput = "image-imageFile";
  const radioSelector = "input[type=radio][name=imageRadios]";
  $(radioSelector).off();
  resetImageTab(fileInput);
  // resetImageTab(radioSelector);
  resetImageTab(inputElem);

  const defaultSRC =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAA7DAAAOwwHHb6hkAAADeElEQVR4Xu2Yi27iMBBFDX1BW+j//yQSlL4LVCfy1Y68Djixl7Kyj2SNA3nMXM/YTiar1ergKmbqbbU0AbytliaAt9XSBPC2WpoA3lZLE8DbamkCeFstTQBvq6UJ4O3Fs9vt3OfnZ9dKUvyL0H6/dx8fH246nXbt6uqqs6lwPY2AbbM8PDy4m5sbf5RHcQG22637/v72R3+wYtgWBno4nHbn7u7Ozedzf5RHcQHW63VSEKkgmtr7+3t37+vra/f4+OjPyKPoHIBzCp4Uvb+/d7PZzN3e3nYBTCaT7r+hcE/KQteHJZHD6AzAqTB9cVICkKKkaoiC0fm2r2tTUUlhedYYgUcJ8PX15V5eXvxRnDETlUQNhUkRp0/wU4wSgFqkWRgJwFlYLBbdyJRCQqghjgQCyo1SG8qoOUDBAjX+9PTklstlNzmJMHgcfX197TJnzFrOM7k/QfJMMgwrrE9DGHVVGJxqT6MRc4blkcApH4TA5kIGiLMLEJuR1Q+dsakqSuzodE98OasAoAcqaCYpTVRhhsSc63OYoFJXg2MZl8roKxWkHLYjHDrECNmdG9fa+hXchzmCrXQKfRk3hGwBAEfkDMQcYonSZMkKEVuzCZ77IMCpLLCChxk3hGICpDh0rFaZGPUOQfCnsuBYxg3hnwgw1CH2FOGkaLOA/8L/f10AO5q2BIY6Q2DhpgoInt+1bOr+wh7/igCgLGA0NCI2MxTE8/Nz95ZIo6/NkILrg3O05Q4F0PNylkAoIgCBKl3lDMdsfhAA53UOfQWu4PrQPaFPgJzgoYgAFjn09vb2l9M5IIate937YgVgneejhd7SeDPMdVZBx4QYS/YXofALEC8rvLQQrFoIAdBwPuwfA1FpLJeUl2B/EdtXpJAtQN83QKFJikbG2H7M6T5haGQRb4EskZSYyHn1zhYAR1K3riESxwpzShz+t8/kPHaXsfNTyBaApUpLGTWPg7HRoz+EmDjq8zxWktzgIVsAAmNth9hnKf5Xw2nEKAWCkP45ZAvABMhECEx+1KkNOgUCUYMwg/pgwuVTWA7ZAsBms0kaWVLVBmuDPoYVQ32EJ+PsZ7gxFBGAmgxfVhScalf9S6OIAIwKAtiJKmdiOidFBPifubycPDNNAG+rpQngbbU0AbytliaAt9XSBPC2WpoA3lZLE8DbaqlcAOd+ALQ27cXvtzg+AAAAAElFTkSuQmCC";
  const element = $(`#${id}`).attr("link");

  if (element == "true" || element == true) {
    $(`#${inputElem}`).val($(`#${id}`).attr("src"));
    $(`#${"image-url"}`).attr("checked", true);
  }
  // Add event listeners
  $(`#${inputElem}`).on("change", function () {
    if (this.value !== "") {
      $(`#${id}`).attr("src", this.value);
      $(`#${id}`).attr("link", true);
      $(`#${id}`).attr("base64", false);
    } else {
      $(`#${id}`).attr("link", false);
      $(`#${id}`).attr("src", defaultSRC);
    }
    $(`#${"image-url"}`).attr("checked", true);
    converToTableFunc();
  });

  // check existing image

  // Image upload

  $(`#${fileInput}`).on("change", function () {
    $(`#${"image-upload"}`).attr("checked", true);
    importFileandPreview();
    // converToTableFunc();
  });

  function importFileandPreview() {
    var preview = document.querySelector(`#${id}`);
    var file = document.querySelector(`#${fileInput}`).files[0];

    var fileSize = parseFloat(file.size / 1024).toFixed(2);

    if (fileSize > 150) {
      $("#uploadSizeError").show();
      setTimeout(function () {
        $("#uploadSizeError").hide();
      }, 5000);
      $(`#${fileInput}`).val("");
      return;
    }

    // Add file name to image attr
    $(`#${id}`).attr("filename", file.name);
    $(`#${id}`).attr("base64", true);
    $(`#${id}`).attr("link", false);
    $(`#${inputElem}`).val("");

    var reader = new FileReader();

    reader.addEventListener(
      "load",
      function () {
        preview.src = reader.result;
        converToTableFunc();
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }
  $(radioSelector).on("change", function () {
    if (this.value === "url" && $(`#${id}`).attr("base64")) {
      $(`#${id}`).attr("base64", true);
      $(`#${id}`).attr("link", false);
      $(`#${inputElem}`).val("");
      $(`#${id}`).attr("src", defaultSRC);
    }
    converToTableFunc();
  });
}

function resetImageTab(inputElem) {
  $(`#${inputElem}`).off();
  $("#image-form").trigger("reset");
}
