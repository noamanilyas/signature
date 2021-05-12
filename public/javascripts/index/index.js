$(document).ready(function () {
  Swal.fire({
    onBeforeOpen: () => {
      Swal.showLoading();
    },
    iconHtml: `<img src="/images/favicon.png" height="45" alt="" />`,
    title: "Signatures are loading",
    showConfirmButton: false,
  });

  /**
   * Get signature list
   */
  (async () => {
    let signatureData = [];
    const rawResponse = await fetch(`http://localhost:8000/getSignatures?companyId=${"000005"}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const content = await rawResponse.json();

    signatureData = content.recordset;

    for (const signature of content.recordset) {
      const gsData = await generateSignatureData(signature);
      await createSig(gsData.html, gsData.signature);
    }

    setTimeout(function () {
      $("#ssDiv").html("");
      $(".addSenders").click(function (e) {
        processUsrGrpModel(e);
      });
      Swal.close();
    }, 500);
    //   });
    // });
  })();
});

function exportFile() {
  var textFile = null,
    makeTextFile = function (text) {
      var data = new Blob([text], { type: "text/plain" });

      // If we are replacing a previously generated file we need to
      // manually revoke the object URL to avoid memory leaks.
      if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
      }

      textFile = window.URL.createObjectURL(data);

      return textFile;
    };

  var create = document.getElementById("create"),
    textbox = document.getElementById("textbox");

  create.addEventListener(
    "click",
    function () {
      var link = document.getElementById("downloadlink");
      link.href = makeTextFile(textbox.value);
      link.style.display = "block";
    },
    false
  );
}
