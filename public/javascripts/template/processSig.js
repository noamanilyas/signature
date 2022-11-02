const createSigForTemplate = async (sigData, imageData) => {
  try {
    // const gsData = await generateSignatureData(sigHTMLDB);
    const gsData = await replaceImagePaths(sigData, imageData);
    const html = gsData.html;
    const signature = sigData;
    console.log("Name", signature.Name);

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

        /**
           * image style 
           * 
           *  <div class="row no-gutters">
                <div class="col-sm-3 card-img-main-div" style="display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;">
                  <img
                    class="card-img-main"
                    src="${signature.ImageData2 ? signature.ImageData2 : imgData}"
                    alt="Microsoft Card"
                    style="
                    max-width: 100%;
                    max-height: 100%;
                    display: block;
                    margin: 0 auto;"
                  />
                </div>
           */
        let cid = url.searchParams.get("cid");

        let sigHTML = `
                <div>
                <div class="container bcontent">
                  <div class="card">
                    <div class="row no-gutters">
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
                          <a href="editor.html?id=${signature.Id}&companyId=${cid}&template=1" class="btn btn-success" ${
          signature.Id.startsWith("R") === true ? 'style="display:none;"' : ""
        }>Use Template</a>
  
                          <!-- <a href="data:text/plain;charset=UTF-8,${encodeURIComponent(signature.SigHTML)}" download="${
          signature.Name
        }.txt"  class="btn btn-warning export">Export</a> -->
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>`;

        let htmlData = $(sigHTML).html();
        $("#list_sig").append(htmlData);
        $(`#delete-${signature.Id.replace(/ /g, "_")}`).click(function () {
          deleteSignature(signature.Id.replace(/ /g, "_"));
        });
      })
      .catch((e) => {
        console.log(e);
      });
    // }, 5);
  } catch (e) {
    console.log(e);
  }
};
