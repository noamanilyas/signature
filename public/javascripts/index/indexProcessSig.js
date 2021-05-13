const getBase64FromUrl = async (url) => {
  const options = {
    method: "GET",
  };
  const data = await fetch(url, options);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
};

const createSig = async (html, signature) => {
  try {
    let canvas,
      imgData = "";
    $("#ssDiv").html("");
    const tempSSDiv = $("#ssDiv").html($(html));
    setTimeout(async function () {
      const options = {};

      html2canvas(tempSSDiv[0])
        .then(function (canvas) {
          if (canvas) {
            imgData = canvas.toDataURL("image/jpeg");
          }

          let sigHTML = `
              <div>
              <div class="container bcontent">
                <div class="card">
                  <div class="row no-gutters">
                    <div class="col-sm-3 card-img-main-div">
                      <img
                        class="card-img-main"
                        src="${imgData}"
                        alt="Microsoft Card"
                      />
                    </div>
                    <div class="col-sm-9">
                      <div class="card-body">
                        <h5 class="card-title">${signature.Name}</h5>
                        <!-- <p class="card-text">Suresh Dasari is a founder and technical lead developer in tutlane.</p> -->
                        <!-- <a href="editor.html?id=${signature.Id}" class="btn btn-success">Edit Signature</a> -->
                        <button id=${signature.Id.replace(
                          / /g,
                          "_"
                        )} class="btn btn-success addSenders groupC" >Users/Groups</button>
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
        })
        .catch((e) => {
          console.log(e);
        });
    }, 5);
  } catch (e) {
    console.log(e);
  }
};

const getSetImageDataSRC = async (elem) => {
  return new Promise(async (resolve2, reject2) => {
    const currSRC = elem.attr("src");

    getBase64FromUrl(`http://127.0.0.1:8887/${currSRC.split("ftproot/")[1]}`).then((result) => {
      let imageBase64 = result;
      resolve2(imageBase64);
    });
  });
};

const generateSignatureData = async (signature) => {
  return new Promise((resolve, reject) => {
    // console.log(toObjectUrl(`http://127.0.0.1:8887/cbbb34a2-1833-eb11-9fb4-0003ff9252c7.png`));
    const html = $(signature.HTML);
    // const html = $(signature.HTML).find("table:first").eq(0);
    const images = html.find("img");
    const imagesLength = images.length;

    // let promiseArray3 = [];

    images.each(async function (index) {
      // promiseArray3.push(await getSetImageDataSRC($(this)));

      $(this).attr("src", await getSetImageDataSRC($(this)));
      // console.log($(this).attr("src"));
      // console.log(`${index}/${imagesLength}`);
      // console.log(imagesLength - 1);
      if (index === imagesLength - 1) {
        resolve({ html, signature });
        // await createSig(html, signature);
      }
    });
  });
};
