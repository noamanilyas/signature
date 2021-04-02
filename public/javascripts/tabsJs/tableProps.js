function renderTableTab(id) {
  console.log("size");
  const inputElemArr = [
    {
      inputElem: "table-cols",
      cssProperty: "width",
      valAppend: "px",
    },
    {
      inputElem: "table-rows",
      cssProperty: "height",
      valAppend: "px",
    },
  ];

  resetTableTab(inputElemArr);

  inputElemArr.forEach(function (value, key, myArray) {
    fillAndAddEventTable(id, value.inputElem, value.cssProperty, value.valAppend);
  });
}

function tableCreate(rows, cols) {
  var body = document.getElementsByTagName("body")[0];
  var tbl = document.createElement("table");
  tbl.style.width = "100%";
  tbl.setAttribute("border", "1");
  var tbdy = document.createElement("tbody");
  for (var i = 0; i < rows; i++) {
    var tr = document.createElement("tr");
    for (var j = 0; j < cols; j++) {
      // if (i == 2 && j == 1) {
      //   break;
      // } else {
      var td = $(`
        <td category="table" width="30%" class="editor-td">
          <div class="ph-table" style="width:100%;">
            <div align="left" class="ph-table-cell tableDrop">
              &nbsp;
            </div>
          </div>
        </td>
      `);
      // td.appendChild(document.createTextNode("&nbsp;"));
      // i == 1 && j == 1 ? td.setAttribute("rowSpan", "2") : null;
      tr.appendChild(td);
    }
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  return tbl;
}

function createOneCol() {
  let col = `
        <td width="30%" class="editor-td">
          <div class="ph-table" style="width:100%;">
            <div align="left" class="ph-table-cell tableDrop editor-td-div" category="table">
              &nbsp;
            </div>
          </div>
        </td>`;

  col += `</tr>`;
  let oneCol = $(col);
  let tdDiv = oneCol.find("div.editor-td-div");
  let UUID2 = `item-${Date.now() + index}`;
  tdDiv.attr("id", "editorTD-" + UUID2);
  addDropEvent(tdDiv, true);
  addModalClick(tdDiv);
  addMouseOverEvents(tdDiv);
  return oneCol;
}

function createOneRow(maxTDs) {
  let row = `<tr class="editor-tr">`;

  for (i = 0; i < maxTDs; i++) {
    row += `
        <td category="table" width="30%" class="editor-td">
          <div class="ph-table" style="width:100%;">
            <div align="left" class="ph-table-cell tableDrop editor-td-div" category="table">
              &nbsp;
            </div>
          </div>
        </td>`;
  }

  row += `</tr>`;
  let oneRow = $(row);
  let tds = oneRow.find("div.editor-td-div");
  tds.each(function (index) {
    let UUID2 = `item-${Date.now() + index}`;
    $(this).attr("id", "editorTD-" + UUID2);
    addDropEvent($(this).children().children().eq(0), true);
    addModalClick($(this));
    addMouseOverEvents($(this));
  });
  return oneRow;
}

function tableModify(rows, cols, cellId) {
  const tbl = $(`#${cellId}`).closest("table");
  const TRs = $(tbl).children().children();
  const tblBody = $(tbl).children();
  const trCount = $(tbl).children().children().length;
  let maxTDs = 0;

  TRs.each(function (index) {
    let tdCount = $(this).children().length;
    if (maxTDs < tdCount) {
      maxTDs = tdCount;
    }
  });

  if (trCount == rows && maxTDs == cols) {
    return tbl;
  }
  console.log("trCount", trCount);
  console.log("maxTDs", maxTDs);
  console.log("rows", rows);
  console.log("cols", cols);

  if (maxTDs < cols) {
    maxTDs = cols;
  }

  if (rows > trCount && cols == maxTDs) {
    // only add TRs with maxTDs

    for (i = 0; i < rows - trCount; i++) {
      tblBody.append(createOneRow(maxTDs));
    }
  } else if (rows > trCount && cols > maxTDs) {
    // add new rows and add new cols to existing rows
    // adding cols to existing rows
    TRs.each(function (index) {
      for (i = 0; i < cols - maxTDs; i++) {
        $(this).append(createOneCol(maxTDs));
      }
    });
    // adding new rows
    for (i = 0; i < rows - trCount; i++) {
      tblBody.append(createOneRow(maxTDs));
    }
  } else if (cols > maxTDs && rows == trCount) {
  }

  return tbl;
}

function fillAndAddEventTable(id, inputElem, cssProperty, valAppend) {
  // Get existing value
  const element = document.querySelector(`#${id}`).style[cssProperty];
  if (element) {
    $(`#${inputElem}`).val(1);
  }

  // Add event listeners
  $(`#${inputElem}`).on("change", function () {
    const rows = $(`#table-rows`).val();
    const cols = $(`#table-cols`).val();

    if (rows > 0 && cols > 0) {
      const tableHTML = tableModify(rows, cols, id);
      console.log(tableHTML);
    }
    converToTableFunc();
  });
}

function resetTableTab(inputElemArr) {
  inputElemArr.forEach(function (value, key, myArray) {
    $(`#${value.inputElem}`).off();
  });

  $("#table-form").trigger("reset");
}
