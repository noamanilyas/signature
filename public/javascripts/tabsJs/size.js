function renderSizeTab(id) {
  console.log("size");
  const inputElemArr = [
    {
      inputElem: "size-width",
      cssProperty: "width",
      valAppend: "px",
      companions: ["min-width", "max-width"],
      oppositeInputElem: "size-height",
      oppositeProperty: "height",
      oppositeCompanions: ["min-height", "max-height"],
    },
    {
      inputElem: "size-height",
      cssProperty: "height",
      valAppend: "px",
      companions: ["min-height", "max-height"],
      oppositeInputElem: "size-width",
      oppositeProperty: "width",
      oppositeCompanions: ["min-width", "max-width"],
    },
  ];

  resetSizeTab(inputElemArr);

  inputElemArr.forEach(function (value, key, myArray) {
    fillAndAddSizeEvent(id, value);
  });
}

function fillAndAddSizeEvent(id, config) {
  const {
    inputElem,
    cssProperty,
    valAppend,
    companions = [],
    oppositeInputElem,
    oppositeProperty,
    oppositeCompanions = [],
  } = config;

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
    const $el = $(`#${id}`);
    const isImg = $el.is("img");

    if (val) {
      const numericVal = parseFloat(val);
      const cssVal = val.indexOf(valAppend) === -1 ? val + valAppend : val;
      obj[cssProperty] = cssVal;
      companions.forEach(function (companionProperty) {
        obj[companionProperty] = cssVal;
      });

      // For images, keep the aspect ratio: derive the opposite dimension
      // (height when width is set, width when height is set) from the
      // image's natural size so it doesn't get squashed/stretched.
      let oppositeNumericVal = null;
      if (isImg && oppositeProperty && !isNaN(numericVal) && numericVal > 0) {
        const imgEl = $el.get(0);
        const naturalWidth = imgEl.naturalWidth;
        const naturalHeight = imgEl.naturalHeight;
        if (naturalWidth && naturalHeight) {
          const ratio = cssProperty === "width" ? naturalHeight / naturalWidth : naturalWidth / naturalHeight;
          oppositeNumericVal = Math.round(numericVal * ratio);
          const oppositeCssVal = `${oppositeNumericVal}px`;
          obj[oppositeProperty] = oppositeCssVal;
          oppositeCompanions.forEach(function (companionProperty) {
            obj[companionProperty] = oppositeCssVal;
          });
        }
      }

      // console.log(obj);
      $el.css(obj);
      if (isImg) {
        $el.attr(cssProperty, numericVal);
        if (oppositeNumericVal !== null) {
          $el.attr(oppositeProperty, oppositeNumericVal);
          $(`#${oppositeInputElem}`).val(oppositeNumericVal);
        }
      }
    } else {
      obj[cssProperty] = "";
      companions.forEach(function (companionProperty) {
        obj[companionProperty] = "";
      });
      $el.css(obj);
      if (isImg) {
        $el.removeAttr(cssProperty);
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
