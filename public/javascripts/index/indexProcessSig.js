// const getBase64FromUrl = async (url) => {
//   try {
//     const options = {
//       method: "GET",
//     };
//     const data = await fetch(url, options);
//     // console.log(data);

//     if (data.status === 200 || data.status === 304) {
//       const blob = await data.blob();
//       return new Promise((resolve) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(blob);
//         reader.onloadend = () => {
//           const base64data = reader.result;
//           resolve(base64data);
//         };
//       });
//     } else {
//       return placeholderBase64;
//     }
//   } catch (error) {
//     console.log(error);
//     return placeholderBase64;
//   }
// };

// const generateSignatureData = async (signature) => {
//   return new Promise((resolve, reject) => {
//     const html = $(signature.HTML);
//     const images = html.find("img");
//     const imagesLength = images.length;

//     if (imagesLength) {
//       images.each(async function (index) {
//         $(this).attr("src", await getSetImageDataSRC($(this)));
//         if (index === imagesLength - 1) {
//           resolve({ html, signature });
//         }
//       });
//     } else {
//       resolve({ html, signature });
//     }
//   });
// };

let url_string = window.location.href; //window.location.href
let url = new URL(url_string);
let companyId = url.searchParams.get("companyId");

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
                        <a href="editor.html?id=${signature.Id}&companyId=${companyId}" class="btn btn-success" ${
          signature.rstart === false ? 'style="display:none;"' : ""
        }>Edit Signature</a>
                        <button id=${signature.Id.replace(
                          / /g,
                          "_"
                        )} class="btn btn-success addSenders groupC" >Users/Groups</button>
                        <button id=rules-${signature.Id.replace(
                          / /g,
                          "_"
                        )} class="btn btn-success addRules groupD" >Rules/Conditions</button>
                        <button id="delete-${signature.Id.replace(/ /g, "_")}" class="n-item btn btn-danger">Delete</button>

                        <button  onClick="exportSignature('${signature.Id}')" class="btn btn-warning export" ${
          signature.rstart === false ? 'style="display:none;"' : ""
        }>Export</button>

                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>`;

        let htmlData = $(sigHTML).html();
        $("#list_sig").append(htmlData);
        document.getElementById(`delete-${signature.Id.replace(/ /g, "_")}`).onclick = function () {
          deleteSignature(signature.Id.replace(/ /g, "_"));
        };
      })
      .catch((e) => {
        console.log(e);
      });
    // }, 5);
  } catch (e) {
    console.log(e);
  }
};

// const getSetImageDataSRC = async (elem) => {
//   return new Promise(async (resolve2, reject2) => {
//     const currSRC = elem.attr("src");
//     const imgURL = `${IMG_SERVER_URL}/${currSRC.split("ftproot/")[1]}`;
//     // const imgURL = "http://127.0.0.1:8887/vitateckcom/branches11.png";
//     getBase64FromUrl(imgURL)
//       .then((result) => {
//         console.log("Reached getSetImageDataSRC");
//         let imageBase64 = result;
//         resolve2(imageBase64);
//       })
//       .catch((e) => {
//         console.log(e);
//         resolve2(placeholderBase64);
//       });
//   });
// };
function exportSignature(id) {
  const url = `${SERVER_URL}/exportsignature?id=${id}`;
  const today = new Date();
  const formattedDate = `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`;
  const timestamp = `${today.getHours()}${today.getMinutes()}${today.getSeconds()}`;
  const filename = `file-${formattedDate}-${timestamp}.GSign`;
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        const contentDisposition = response.headers.get("content-disposition");
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        const fileName = fileNameMatch ? fileNameMatch[1] : filename;

        // Create a Blob from the response data
        return response.blob().then((blob) => {
          const url = window.URL.createObjectURL(blob);
          // Create an anchor element to initiate the download
          const downloadLink = document.createElement("a");
          downloadLink.href = url;
          downloadLink.download = fileName;
          downloadLink.style.display = "none";
          // Append the link to the document and trigger a click event to initiate the download
          document.body.appendChild(downloadLink);
          downloadLink.click();
          // Clean up
          document.body.removeChild(downloadLink);
          window.URL.revokeObjectURL(url);
        });
      } else {
        console.error("Request failed with status code: " + response.status);
        throw new Error("Request failed");
      }
    })
    .catch((error) => {
      console.error("Request failed:", error);
    });
}
