$(document).ready(function () {
  let url_string = window.location.href; //window.location.href
  let url = new URL(url_string);
  let companyId = url.searchParams.get("companyId");

  /**
   * Set back url
   */
  $("#backIndexBtn").attr("href", `index.html?companyId=${companyId}`);
  const replaceImagePaths = (signature, imageData) => {
    return new Promise((resolve, reject) => {
      signature.HTML = signature.HTML.replace(/src="[^"]*"/gm, function (match, i) {
        return match.toLowerCase();
      });

      imageData.forEach(function (item, index) {
        const imagePath = item.ImgPath.toLowerCase();
        // console.log("base64", `data:image/png;base64,${item.ImgBase64}`);
        signature.HTML = signature.HTML.replace(imagePath, `data:image/png;base64,${item.ImgBase64}`);
      });

      resolve({ html: signature.HTML });
    });
  };

  const createSig = async (sigData, imageData) => {
    try {
      // const gsData = await generateSignatureData(sigHTMLDB);
      const gsData = await replaceImagePaths(sigData, imageData);
      const html = gsData.html;
      const signature = sigData;

      let imgData = "";
      $("#ssDiv").html("");

      const tempSSDiv = $("#ssDiv").html($(html));
      // setTimeout(async function () {
      const options = {};

      html2canvas(tempSSDiv[0])
        .then(function (canvas) {
          if (canvas) {
            imgData = canvas.toDataURL("image/jpeg");
          }

          let sigHTML = `
                    <li class="ui-state-default">
              <div>
              
              <div class="container bcontent" data-id='${signature.Id.replace(" ", "_")}'>
              <div class="card orderdiv">
              <div class="row no-gutters ">
              <div class="numbs"><span class="spannumber"></span></div>
                  
                    <div class="col-sm-3 card-img-main-div">
                      <img
                        class="card-img-main"
                        src="${signature.ImageData2 ? signature.ImageData2 : imgData}"
                        alt="Microsoft Card"
                      />
                    </div>
                    <div class="col-sm-9">
                      <div class="card-body">
                        <h5 class="card-title">${signature.Name}</h5>
                        <!-- <p class="card-text">Suresh Dasari is a founder and technical lead developer in tutlane.</p> -->
                        <!-- <a href="editor.html?id=${signature.Id}" class="btn btn-success">Edit Signature</a> -->
                        <!-- <a href="data:text/plain;charset=UTF-8,${encodeURIComponent(signature.SigHTML)}" download="${
            signature.Name
          }.txt"  class="btn btn-warning export">Export</a> -->
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
              </li>`;

          let htmlData = $(sigHTML).html();
          // console.log(htmlData);
          $("#list_sig").append(htmlData);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

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
      // console.log(content);
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
        arrange();
        $("#ssDiv").html("");
        $(".sortable").sortable({
          update: arrange,
        });
        $(".sortable").disableSelection();
        // console.log($(".addSenders").length);
        // $(".addSenders").click(function (e) {
        //   processUsrGrpModel(e);
        // });

        Swal.close();
      }, 3000);
      //   });
      // });
    })();
  });

  $("#saveorder").click(function (e) {
    let newArray = [...document.querySelectorAll("div.bcontent")].map(function (item) {
      return item.getAttribute("data-id").replace("_", " ");
    });
    if (newArray.length > 0) {
      (async () => {
        const rawResponse = await fetch(`${SERVER_URL}/updateOrder`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newOrder: newArray }),
        });
        const content = await rawResponse.json();
        Swal.fire({
          // position: "top-end",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(function () {
          window.location.href = `/index.html?companyId=${companyId}`;
        }, 1600);
      })();
    }
  });
});

function arrange() {
  $(".spannumber").each(function (index, element) {
    $(element).html(index + 1);
  });
}
