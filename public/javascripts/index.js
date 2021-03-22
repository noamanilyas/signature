$(document).ready(function () {
  // Swal.showLoading();
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

    for (const signature of content.recordset) {
      let sigHTML = `
      <div>
      <div class="container bcontent">
        <div class="card">
          <div class="row no-gutters">
            <div class="col-sm-3">
              <img
                class="card-img card-img-main"
                src="/images/cbbb34a2-1833-eb11-9fb4-0003ff9252c7.png"
                alt="Microsoft Card"
              />
            </div>
            <div class="col-sm-9">
              <div class="card-body">
                <h5 class="card-title">${signature.Name}</h5>
                <!-- <p class="card-text">Suresh Dasari is a founder and technical lead developer in tutlane.</p> -->
                <a href="editor.html?id=${signature.Id}" class="btn btn-success">Edit Signature</a>
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
      Swal.close();
    }, 1500);
  })();
});
