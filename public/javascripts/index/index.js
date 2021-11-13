$(document).ready(function () {
  // $(".test1").jqte();
  Swal.fire({
    onBeforeOpen: () => {
      Swal.showLoading();
    },
    iconHtml: `<img src="/images/favicon.png" height="45" alt="" />`,
    title: "Signatures are loading",
    showConfirmButton: false,
  });

  /**
   * Set reorder url
   */
  $("#reorderBtn").attr("href", `reorder.html?companyId=${companyId}`);
  $("#newSigBtn").attr("href", `editor.html?companyId=${companyId}`);

  /**
   * Get signature list
   */
  (async () => {
    // console.log(c);

    // let companyId = "000005";
    if (!companyId) {
      Swal.fire({
        // position: "top-end",
        icon: "info",
        title: "Company data not available.",
        showConfirmButton: true,
      });
      return;
    }
    const rawResponse = await fetch(`${SERVER_URL}/getSignatures?companyId=${companyId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const content = await rawResponse.json();
    console.log(content);
    const signatureData = content.recordsets[0];
    const imageData = content.recordsets[1];

    if (signatureData.length === 0) {
      Swal.fire({
        // position: "top-end",
        icon: "info",
        title: "Company data not available.",
        showConfirmButton: true,
      });
      return;
    }

    for (const signature of signatureData) {
      await createSig(signature, imageData);
    }

    setTimeout(function () {
      $("#ssDiv").html("");
      // console.log($(".addSenders").length);
      $(".addSenders").click(function (e) {
        processUsrGrpModel(e);
      });
      $(".addRules").click(function (e) {
        console.log("clicked addRules");
        processAddRules(e);
      });
      Swal.close();
    }, 3000);
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
