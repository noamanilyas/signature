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
    // console.log(c);
    let url_string = window.location.href; //window.location.href
    let url = new URL(url_string);
    let companyId = url.searchParams.get("companyId");
    // let companyId = "000005";
    console.log(companyId);
    let signatureData = [];
    const rawResponse = await fetch(`http://localhost:8000/getSignatures?companyId=${companyId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const content = await rawResponse.json();

    signatureData = content.recordset;
    // console.log(signatureData.length);

    for (const signature of content.recordset) {
      // console.log("for loop");
      await createSig(signature);
    }

    setTimeout(function () {
      $("#ssDiv").html("");
      // console.log($(".addSenders").length);
      $(".addSenders").click(function (e) {
        processUsrGrpModel(e);
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
