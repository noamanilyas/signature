$(document).ready(function () {
  // Swal.showLoading();
  Swal.fire({
    // position: "top-end",
    onBeforeOpen: () => {
      Swal.showLoading();
    },
    icon: "info",
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
      <li class="ui-state-default">
      <div class="container bcontent" data-id="${signature.Id}">
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
              </div>
            </div>
          </div>
        </div>
        </div>
      </li>`;

      let htmlData = $(sigHTML).html();
      $("#list_sig").append(htmlData);

      $(".sortable").sortable();
      $(".sortable").disableSelection();
    }

    // setTimeout(function () {
    Swal.close();
    // }, 1500);
  })();

  $("#saveorder").click(function (e) {
    let newArray = [...document.querySelectorAll("div.bcontent")].map(function (item) {
      return item.getAttribute("data-id");
    });
    console.log(newArray);
    if (newArray.length > 0) {
      console.log("Save signature");
      (async () => {
        const rawResponse = await fetch("http://localhost:8000/updateOrder", {
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
          window.location.href = "/index.html";
        }, 1600);
      })();
    }
  });
});
