var personalData = {
  firstName: "Noaman",
  lastName: "Ilyas",
  email: "noaman.ilyas@gmail.com",
  address: "House No. 169-POF, WahCantt",
};

const itemIds = {
  btnText: `<span category="textField" style="font-size: 14px; white-space: nowrap;" 
  font-family: Calibri, Arial, sans-serif;>Your text here!&#8203;</span>`,
  // btnText: `<div category="textField"><span>Your text here!</span></div>`,
  btnImage: `<img
        alt="Image"
        title="Image"
        category="image"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAA7DAAAOwwHHb6hkAAADeElEQVR4Xu2Yi27iMBBFDX1BW+j//yQSlL4LVCfy1Y68Djixl7Kyj2SNA3nMXM/YTiar1ergKmbqbbU0AbytliaAt9XSBPC2WpoA3lZLE8DbamkCeFstTQBvq6UJ4O3Fs9vt3OfnZ9dKUvyL0H6/dx8fH246nXbt6uqqs6lwPY2AbbM8PDy4m5sbf5RHcQG22637/v72R3+wYtgWBno4nHbn7u7Ozedzf5RHcQHW63VSEKkgmtr7+3t37+vra/f4+OjPyKPoHIBzCp4Uvb+/d7PZzN3e3nYBTCaT7r+hcE/KQteHJZHD6AzAqTB9cVICkKKkaoiC0fm2r2tTUUlhedYYgUcJ8PX15V5eXvxRnDETlUQNhUkRp0/wU4wSgFqkWRgJwFlYLBbdyJRCQqghjgQCyo1SG8qoOUDBAjX+9PTklstlNzmJMHgcfX197TJnzFrOM7k/QfJMMgwrrE9DGHVVGJxqT6MRc4blkcApH4TA5kIGiLMLEJuR1Q+dsakqSuzodE98OasAoAcqaCYpTVRhhsSc63OYoFJXg2MZl8roKxWkHLYjHDrECNmdG9fa+hXchzmCrXQKfRk3hGwBAEfkDMQcYonSZMkKEVuzCZ77IMCpLLCChxk3hGICpDh0rFaZGPUOQfCnsuBYxg3hnwgw1CH2FOGkaLOA/8L/f10AO5q2BIY6Q2DhpgoInt+1bOr+wh7/igCgLGA0NCI2MxTE8/Nz95ZIo6/NkILrg3O05Q4F0PNylkAoIgCBKl3lDMdsfhAA53UOfQWu4PrQPaFPgJzgoYgAFjn09vb2l9M5IIate937YgVgneejhd7SeDPMdVZBx4QYS/YXofALEC8rvLQQrFoIAdBwPuwfA1FpLJeUl2B/EdtXpJAtQN83QKFJikbG2H7M6T5haGQRb4EskZSYyHn1zhYAR1K3riESxwpzShz+t8/kPHaXsfNTyBaApUpLGTWPg7HRoz+EmDjq8zxWktzgIVsAAmNth9hnKf5Xw2nEKAWCkP45ZAvABMhECEx+1KkNOgUCUYMwg/pgwuVTWA7ZAsBms0kaWVLVBmuDPoYVQ32EJ+PsZ7gxFBGAmgxfVhScalf9S6OIAIwKAtiJKmdiOidFBPifubycPDNNAG+rpQngbbU0AbytliaAt9XSBPC2WpoA3lZLE8DbaqlcAOd+ALQ27cXvtzg+AAAAAElFTkSuQmCC"
      />`,
  btnIcon: `<img
        alt="Fax"
        category="icons"
        class="icon-list drag"
        src=""
      />`,
  // change in tableprops also
  btnTable: `<table class="editor-table">

    <tr class="editor-tr">
      <td class="editor-td">
        <div class="ph-table wh100">
          <div align="left" class="ph-table-cell tableDrop editor-td-div cellWH" category="table">
            &nbsp;
          </div>
        </div>
      </td>
      <td class="editor-td">
        <div class="ph-table wh100">
          <div align="left" class="ph-table-cell tableDrop editor-td-div cellWH" category="table">
            &nbsp;
          </div>
        </div>
      </td>
    </tr>
     <tr class="editor-tr">
      <td class="editor-td">
        <div class="ph-table wh100">
          <div align="left" class="ph-table-cell tableDrop editor-td-div cellWH" category="table">
            &nbsp;
          </div>
        </div>
      </td>
      <td class="editor-td">
        <div class="ph-table wh100">
          <div align="left" class="ph-table-cell tableDrop editor-td-div cellWH" category="table">
            &nbsp;
          </div>
        </div>
      </td>
    </tr>

    </table>`,
};

function appendNewTabs(tabs) {
  $.each(tabs, function (key, val) {
    const tabName = val.TabName;

    let newTab = $(`
      <button
        class="btn button-list mainmenu"
        type="button"
        data-toggle="collapse"
        data-target="#collapse${tabName.split(" ").join("_")}"
        aria-expanded="false"
        aria-controls="collapse${tabName.split(" ").join("_")}"
      >
        ${tabName}
      </button>
      <div class="collapse" id="collapse${tabName.split(" ").join("_")}">
        <table class="icon-tab">
          <tbody>

          </tbody>
        </table>
      </div>`);

    function getRowItem(item) {
      let rowItem = $(`
        <tr>
          <td>
            <button item="btn${item.Name.split(" ").join("_")}" class="btn button-list drag submenu">
              ${item.Name}
            </button>
          </td>
        </tr>`);

      if (item.Type === "text")
        itemIds[
          `btn${item.Name.split(" ").join("_")}`
        ] = `<span category="textField" style="font-size: 14px; white-space: nowrap;" 
        font-family: Calibri, Arial, sans-serif;>{${item.Name}}</span>`;

      return rowItem;
    }

    $.each(val.TabFields, function (i, item) {
      const rowItem = getRowItem(item);
      newTab.find("tbody").append(rowItem);
    });

    $("#panelContainer").append(newTab);
  });
}

var tabs = {
  GeneralTab: {
    TabName: "General Tab",
    TabFields: [
      {
        Name: "Friendly Name",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "First Name",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "Initials",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "Last Name",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "Display Name",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "Description",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "Office",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "Tel. Number",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "Tel. Number (Other)",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "E-mail",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "Web Page",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "Web Page (Other)",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "Common Name",
        Value: "Noaman",
        Type: "text",
      },
    ],
  },
  AddressTab: {
    TabName: "Address Tab",
    TabFields: [
      {
        Name: "Street",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "PO Box",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "City",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "State/Province",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "Zip/Postal",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "Country",
        Value: "Noaman",
        Type: "text",
      },
    ],
  },

  TelephonesTab: {
    TabName: "Telephones Tab",
    TabFields: [
      {
        Name: "Home",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Home (Other)",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "Pager",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "Pager (Other)",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "Mobile",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "Mobile (Other)",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "Fax",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "Fax (Other)",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "Telephone Number",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "IP Phone",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "IP Phone (Other)",
        Value: "Noaman",
        Type: "text",
      },
      {
        Name: "Notes",
        Value: "Noaman",
        Type: "text",
      },
    ],
  },
  OrganizationTab: {
    TabName: "OrganizationTab",
    TabFields: [
      {
        Name: "Title",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Department",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Company",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Manager",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Employee ID",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Employee Type",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Employee Number",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Car License",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Division",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Room Number",
        Value: "Street",
        Type: "text",
      },
    ],
  },
  ExchangeAttributesTab: {
    TabName: "Exc Attributes Tab",
    TabFields: [
      {
        Name: "extensionAttribute1",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Extension Attribute2",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Extension Attribute3",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Extension Attribute4",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Extension Attribute5",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Extension Attribute6",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Extension Attribute7",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Extension Attribute8",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Extension Attribute9",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Extension Attribute10",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Extension Attribute11",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "ExtensionAttribute12",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Extension Attribute13",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Extension Attribute14",
        Value: "Street",
        Type: "text",
      },
      {
        Name: "Extension Attribute15",
        Value: "Street",
        Type: "text",
      },
    ],
  },
};

let allFields = [];

Object.keys(tabs).forEach((key) => {
  tabs[key].TabFields.forEach((field) => {
    allFields.push(field.Name);
  });
});

setTimeout(function () {
  appendNewTabs(tabs);
}, 500);
