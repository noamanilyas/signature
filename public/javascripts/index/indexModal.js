let groupsAll = [];
let usersAll = [];

let listTypeI = "includeTabList";
let listTypeRmBtnI = "removeItemIncludeTab";

let listTypeE = "excludeTabList";
let listTypeRmBtnE = "removeItemExcludeTab";

let addUsrBtnI = "addUserIncluded";
let addGrpBtnI = "addGroupIncluded";

let addUsrBtnE = "addUserExcluded";
let addGrpBtnE = "addGroupExcluded";

function appendLIToUL(ugname, email, rid, listType, listTypeRmBtn, uType, uGRP) {
  const itemhtml = `
    <li class="list-group-item" rid='${rid.replace(/ /g, "_")}' ucd= '${ugname}' uemail= '${
    email != null ? email : "No Email"
  }' ugrp='${uGRP}' utype='${uType}'}>
      ${ugname} &nbsp;&nbsp;&nbsp; (${email != null ? email : "No Email"})
      <button class="btn btn-danger ${listTypeRmBtn}" style="float: right">Remove</button>
    </li>`;
  $(`.${listType}`).append(itemhtml);
  $(`.${listTypeRmBtn}`).click(function () {
    $(this).parent().remove();
  });
}

function setAutoComplete(addBtn, allList, emailKey, nameKey, ridKey, listType, listTypeRmBtn, uType, uGRP) {
  $(`.${addBtn}`).click(function () {
    // get available items
    let availableItems = allList.map((item) => {
      return `${item[nameKey]} (${item[emailKey] != null ? item[emailKey] : "No Email"})`;
    });
    $("#namesusrgrp").val("");

    if (availableItems.length > 2000) {
      $("#namesusrgrp").autocomplete({
        minLength: 1,
        source: function (request, response) {
          var results = $.ui.autocomplete.filter(availableItems, request.term);

          response(results.slice(0, 2000));
        },
        scroll: true,
      });
    } else {
      $("#namesusrgrp")
        .autocomplete({
          minLength: 0,
          source: availableItems,
          scroll: true,
        })
        .focus(function () {
          $(this).autocomplete("search", "");
        });
    }

    $(".addUsrGrpToList").click(function () {
      const index = availableItems.indexOf($("#namesusrgrp").val());
      console.log(index);
      appendLIToUL(
        allList[index][nameKey],
        allList[index][emailKey],
        allList[index][ridKey],
        listType,
        listTypeRmBtn,
        uType,
        uGRP
      );
      $(".addUsrGrpToList").off();
      $("#namesusrgrp").off();
    });

    $("#usergroupslistmodel").modal("show");
  });
}

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

// function addImage(pk) {
//   alert("addImage: " + pk);
// }

// $("#myModal .save").click(function (e) {
//   e.preventDefault();
//   addImage(5);
//   $("#myModal").modal("hide");
//   //$(this).tab('show')
//   return false;
// });

function getCurrentItemsList() {
  const items = [];

  // Include
  $(`.${listTypeI}`)
    .children()
    .each(function () {
      let item = {
        ucd: $(this).attr("ucd"),
        uemail: $(this).attr("uemail"),
        utype: $(this).attr("utype"),
        ugrp: $(this).attr("ugrp"),
      };
      items.push(item);
    });

  // Exclude
  $(`.${listTypeE}`)
    .children()
    .each(function () {
      let item = {
        ucd: $(this).attr("ucd"),
        uemail: $(this).attr("uemail"),
        utype: $(this).attr("utype"),
        ugrp: $(this).attr("ugrp"),
      };
      items.push(item);
    });

  return items;
}

async function processUsrGrpModel(e) {
  Swal.fire({
    onBeforeOpen: () => {
      Swal.showLoading();
    },
    iconHtml: `<img src="/images/favicon.png" height="45" alt="" />`,
    title: "Loading users and groups",
    showConfirmButton: false,
  });
  // console.log(e.target.id);
  const data = await getCurrentSignatureUsers(e.target.id);
  /**
   * Set include tab data
   */
  $(`.${listTypeI}`).html(""); // reset list
  for (let i = 0; i < data.Included.length; i++) {
    let item = data.Included[i];
    appendLIToUL(item.U_CD, item.U_EMAIL, item.PRID, listTypeI, listTypeRmBtnI, item.U_TYPE, item.U_GRP);
  }

  /**
   * Set exclude tab data
   */
  $(`.${listTypeE}`).html(""); // reset list
  for (let i = 0; i < data.Excluded.length; i++) {
    let item = data.Excluded[i];
    appendLIToUL(item.U_CD, item.U_EMAIL, item.PRID, listTypeE, listTypeRmBtnE, item.U_TYPE, item.U_GRP);
  }

  $(".saveUsrGrp").click(async function () {
    const body = { prid: e.target.id, items: getCurrentItemsList() };
    // console.log(body);
    await updateCurrentSignatureUsrGrp(body);
    $(".saveUsrGrp").off();
    $(`.${addGrpBtnI}`).off();
    $(`.${addUsrBtnI}`).off();
    $(`.${addGrpBtnE}`).off();
    $(`.${addUsrBtnE}`).off();
  });

  /**
      U_TYPE = 0  -> Condtion
      U_TYPE = 2  -> Exception
      U_GROUP = 0 -> User
      U_group = 1 -> Group
      U_Rtype = (U_TYPE + U_GRP)
   */

  /**
   * Add events on add user and add group for include
   */
  setAutoComplete(addUsrBtnI, usersAll, "U_EMAIL", "U_DSC", "RID", listTypeI, listTypeRmBtnI, "0", "0");
  setAutoComplete(addGrpBtnI, groupsAll, "G_EMAIL", "G_DSC", "RID", listTypeI, listTypeRmBtnI, "0", "1");

  /**
   * Add events on add user and add group for exclude
   */
  setAutoComplete(addUsrBtnE, usersAll, "U_EMAIL", "U_DSC", "RID", listTypeE, listTypeRmBtnE, "2", "0");
  setAutoComplete(addGrpBtnE, groupsAll, "G_EMAIL", "G_DSC", "RID", listTypeE, listTypeRmBtnE, "2", "1");

  $("#usergroupsmodel2").modal("show");
  Swal.close();
}

$("#usergroupsmodel2").on("hidden.bs.modal", function () {
  $(".saveUsrGrp").off();
  $(`.${addGrpBtnI}`).off();
  $(`.${addUsrBtnI}`).off();
  $(`.${addGrpBtnE}`).off();
  $(`.${addUsrBtnE}`).off();
  $(".addUsrGrpToList").off();
  $("#namesusrgrp").off();
});

$("#usergroupslistmodel").on("hidden.bs.modal", function () {
  $(".addUsrGrpToList").off();
  $("#namesusrgrp").off();
});

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

// $("body").on("click", ".list-group .list-group-item", function () {
//   $(this).toggleClass("active");
// });

// $(".list-arrows button").click(function () {
//   var $button = $(this),
//     actives = "";
//   if ($button.hasClass("move-left")) {
//     actives = $(".list-right ul li.active");
//     actives.clone().appendTo(".list-left ul");
//     actives.remove();
//   } else if ($button.hasClass("move-right")) {
//     actives = $(".list-left ul li.active");
//     actives.clone().appendTo(".list-right ul");
//     actives.remove();
//   }
// });

// $(".dual-list .selector").click(function () {
//   var $checkBox = $(this);
//   if (!$checkBox.hasClass("selected")) {
//     $checkBox.addClass("selected").closest(".well").find("ul li:not(.active)").addClass("active");
//     $checkBox.children("i").removeClass("glyphicon-unchecked").addClass("glyphicon-check");
//   } else {
//     $checkBox.removeClass("selected").closest(".well").find("ul li.active").removeClass("active");
//     $checkBox.children("i").removeClass("glyphicon-check").addClass("glyphicon-unchecked");
//   }
// });

// $('[name="SearchDualList"]').keyup(function (e) {
//   var code = e.keyCode || e.which;
//   if (code == "9") return;
//   if (code == "27") $(this).val(null);
//   var $rows = $(this).closest(".dual-list").find(".list-group li");
//   var val = $.trim($(this).val()).replace(/ +/g, " ").toLowerCase();
//   $rows
//     .show()
//     .filter(function () {
//       var text = $(this).text().replace(/\s+/g, " ").toLowerCase();
//       return !~text.indexOf(val);
//     })
//     .hide();
// });
