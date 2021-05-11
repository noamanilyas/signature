$(document).ready(function () {
  // Swal.showLoading();
  $("body").on("click", ".list-group .list-group-item", function () {
    $(this).toggleClass("active");
  });
  $(".list-arrows button").click(function () {
    var $button = $(this),
      actives = "";
    if ($button.hasClass("move-left")) {
      actives = $(".list-right ul li.active");
      actives.clone().appendTo(".list-left ul");
      actives.remove();
    } else if ($button.hasClass("move-right")) {
      actives = $(".list-left ul li.active");
      actives.clone().appendTo(".list-right ul");
      actives.remove();
    }
  });
  $(".dual-list .selector").click(function () {
    var $checkBox = $(this);
    if (!$checkBox.hasClass("selected")) {
      $checkBox.addClass("selected").closest(".well").find("ul li:not(.active)").addClass("active");
      $checkBox.children("i").removeClass("glyphicon-unchecked").addClass("glyphicon-check");
    } else {
      $checkBox.removeClass("selected").closest(".well").find("ul li.active").removeClass("active");
      $checkBox.children("i").removeClass("glyphicon-check").addClass("glyphicon-unchecked");
    }
  });
  $('[name="SearchDualList"]').keyup(function (e) {
    var code = e.keyCode || e.which;
    if (code == "9") return;
    if (code == "27") $(this).val(null);
    var $rows = $(this).closest(".dual-list").find(".list-group li");
    var val = $.trim($(this).val()).replace(/ +/g, " ").toLowerCase();
    $rows
      .show()
      .filter(function () {
        var text = $(this).text().replace(/\s+/g, " ").toLowerCase();
        return !~text.indexOf(val);
      })
      .hide();
  });

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
      // console.log(signature.Name);
      $("#ssDiv").html("");
      const tempSSDiv = $("#ssDiv").html($(html));
      // let strHTML = $("<div>").append($(tempSSDiv).clone()).html();
      // console.log(`strHTML`, strHTML);
      setTimeout(async function () {
        const options = {
          // y: 0,
          // x: 0,
          // scrollY: 0,
          // scrollX: 0,
        };
        // console.log("beofre");
        // canvas = await html2canvas(tempSSDiv[0], options);

        html2canvas(tempSSDiv[0])
          .then(function (canvas) {
            // console.log("after", canvas);

            if (canvas) {
              imgData = canvas.toDataURL("image/jpeg");
              // console.log(imgData);
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
                        <button class="btn btn-success addSenders">Groups</button>
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
            // console.log(htmlData);
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

      // console.log("Image URL", `http://127.0.0.1:8887/${currSRC.split("ftproot/")[1]}`);

      getBase64FromUrl(`http://127.0.0.1:8887/${currSRC.split("ftproot/")[1]}`).then((result) => {
        let imageBase64 = result;
        // elem.attr("src", imageBase64);
        // console.log("imageBase64", elem.attr("src"));

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
    $(".addSenders").click(function (e) {
      $("#usergroupsmodel").modal("show");

      // action goes here!!
    });

    const getCompanyUsersGroups = await fetch(`http://localhost:8000/getCompanyUsersGroups?companyId=${"000005"}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const compUserJson = await getCompanyUsersGroups.json();

    const groups = compUserJson.recordsets[0];
    const users = compUserJson.recordsets[1];

    const groupsHtmlString = groups.map((group) => {
      return `<li class="list-group-item">${group.G_DSC}</li>`;
    });
    console.log($("ul.fromList"));
    console.log($(groupsHtmlString));
    $("ul.fromList").append(groupsHtmlString);

    setTimeout(function () {
      $("#ssDiv").html("");
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
