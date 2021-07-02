let rulesAll = [];

(async () => {
  let url_string = window.location.href; //window.location.href
  let url = new URL(url_string);
  let companyId = url.searchParams.get("companyId");
  // let companyId = "000005";
  console.log(companyId);
  getCompanyUsersGroups = await fetch(`${SERVER_URL}/getCompanyUsersGroups?companyId=${companyId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const compUserJson = await getCompanyUsersGroups.json();

  groupsAll = compUserJson.recordsets[0];
  usersAll = compUserJson.recordsets[1];

  // const groupsHtmlString = groups.map((group) => {
  //   return `<li class="list-group-item">${group.G_DSC}$nbps;${group.G_EMAIL}</li>`;
  // });

  // $("ul.fromList").append(groupsHtmlString);
})();

async function processAddRules(e) {
  Swal.fire({
    onBeforeOpen: () => {
      Swal.showLoading();
    },
    iconHtml: `<img src="/images/favicon.png" height="45" alt="" />`,
    title: "Loading rules and conditions",
    showConfirmButton: false,
  });
  // console.log(e.target.id);

  const PRID = e.target.id.split("-")[1];
  const data = await getCurrentSigRulesConditions(PRID);
  console.log("Data before", data);

  /**
   * Populdate api data in modal
   */
  for (const key of Object.keys(data)) {
    let input = $(`#${key}`);
    if (input.is(":radio")) {
      if (data[key]) {
        input.parent().addClass("active");
      } else {
        input.parent().removeClass("active");
      }
      input.prop("checked", data[key]);
    }
    if (input.is(":checkbox")) {
      input.prop("checked", data[key]);
    }
    if (input.is(":text")) {
      input.val(data[key]);
    }
    // console.log($(`#${key}`).is(":checkbox"));
    // console.log($(`#${key}`).is(":text"));
  }

  /**
   * Save to db
   */

  $(".saveRulesConditions").click(async function () {
    for (const key of Object.keys(data)) {
      let input = $(`#${key}`);

      if (input.is(":radio")) {
        if (input.parent().hasClass("active")) {
          data[key] = true;
        } else {
          data[key] = false;
        }
      }
      if (input.is(":checkbox")) {
        data[key] = input.prop("checked");
      }
      if (input.is(":text")) {
        data[key] = input.val();
      }
    }
    console.log("Data afterr", data);
    data.prid = PRID;
    await updateSigRulesConditions(data);
    $(".saveRulesConditions").off();
    // $(`.${addGrpBtnI}`).off();
    // $(`.${addUsrBtnI}`).off();
    // $(`.${addGrpBtnE}`).off();
    // $(`.${addUsrBtnE}`).off();
  });

  $("#rulesConditionsModal").modal("show");
  Swal.close();
}

$("#rulesConditionsModal").on("hidden.bs.modal", function () {
  $(".saveRulesConditions").off();
  // $(`.${addGrpBtnI}`).off();
  // $(`.${addUsrBtnI}`).off();
  // $(`.${addGrpBtnE}`).off();
  // $(`.${addUsrBtnE}`).off();
  // $(".addUsrGrpToList").off();
  // $("#namesusrgrp").off(); // Removed beacaue autocomplete not taking event again
});

// $("#usergroupslistmodel").on("hidden.bs.modal", function () {
//   $(".addUsrGrpToList").off();
//   // $("#namesusrgrp").off(); // Removed beacaue autocomplete not taking event again
// });

$(document).on("show.bs.modal", ".modal", function () {
  var zIndex = 1040 + 10 * $(".modal:visible").length;
  $(this).css("z-index", zIndex);
  setTimeout(function () {
    $(".modal-backdrop")
      .not(".modal-stack")
      .css("z-index", zIndex - 1)
      .addClass("modal-stack");
  }, 0);
});
