$(document).ready(function () {
  // Swal.showLoading();

  let signatureData = [];
  Swal.fire({
    // position: "top-end",
    onBeforeOpen: () => {
      Swal.showLoading();
    },
    // icon: "info",
    iconHtml: `<img src="/images/favicon.png" height="45" alt="" />`,
    title: "Signatures are loading",
    showConfirmButton: false,
    // timer: 1500,
  });
  (async () => {
    const rawResponse = await fetch("http://localhost:8000/getSignatures", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const content = await rawResponse.json();

    signatureData = content.recordset;

    for (const signature of content.recordset) {
      let sigHTML = `
      <div>
      <div class="container bcontent">
        <div class="card">
          <div class="row no-gutters">
            <div class="col-sm-3 card-img-main-div">
              <img
                class="card-img-main"
                src="${signature.ImageData}"
                alt="Microsoft Card"
              />
            </div>
            <div class="col-sm-9">
              <div class="card-body">
                <h5 class="card-title">${signature.Name}</h5>
                <!-- <p class="card-text">Suresh Dasari is a founder and technical lead developer in tutlane.</p> -->
                <a href="editor.html?id=${signature.Id}" class="btn btn-success">Edit Signature</a>
                <a href="data:text/plain;charset=UTF-8,${encodeURIComponent(signature.SigHTML)}" download="${
        signature.Name
      }.txt"  class="btn btn-warning export">Export</a>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>`;

      let htmlData = $(sigHTML).html();
      $("#list_sig").append(htmlData);
    }

    setTimeout(function () {
      // $(".export").on("click", function () {
      //   console.log($(this).attr("id"));
      // });
      Swal.close();
    }, 500);
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
