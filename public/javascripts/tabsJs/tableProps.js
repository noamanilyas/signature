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

function createOneCol(index) {
  // change in build panel also
  let col = `
        <td class="editor-td">
          <div class="ph-table wh100">
            <div class="ph-table-cell tableDrop editor-td-div cellWH" category="table">
              &nbsp;
            </div>
          </div>
        </td>`;

  // col += `</tr>`;
  let oneCol = $(col);
  let tdDiv = oneCol.find("div.editor-td-div");
  let UUID2 = `item-${Date.now() + index + Date.now()}`;
  tdDiv.attr("id", "editorTD-" + UUID2);
  addDropEvent(tdDiv, true);
  addModalClick(tdDiv);
  addMouseOverEvents(tdDiv);
  return oneCol;
}

function createOneRow(maxTDs) {
  // return new Promise((resolve, reject) => {
  try {
    let row = $(`<tr class="editor-tr"></tr>`);

    for (i = 0; i < maxTDs; i++) {
      row.append(createOneCol(i));
    }

    // row += ``;
    // let oneRow = $(row);
    // let tds = oneRow.find("div.editor-td-div");
    // tds.each(function (index) {
    //   let UUID2 = `item-${Date.now() + index}`;
    //   $(this).attr("id", "editorTD-" + UUID2);
    //   addDropEvent($(this).children().children().eq(0), true);
    //   addModalClick($(this));
    //   addMouseOverEvents($(this));
    // });
    return row;
    // resolve(row);
  } catch (error) {
    console.error(error);
    // reject(error);
  }
  // });
}

const tableModify = (rows, cols, cellId) => {
  try {
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
    // console.log("trCount", trCount);
    // console.log("maxTDs", maxTDs);
    // console.log("rows", rows);
    // console.log("cols", cols);
    let newMaxTDs = maxTDs;
    if (newMaxTDs < cols) {
      newMaxTDs = cols;
    }

    // Addition of rows and cols
    if (rows == trCount && cols > maxTDs) {
      // adding cols to existing rows
      // console.log("cols - maxTDs", cols - maxTDs);
      TRs.each(function (index) {
        for (i = 0; i < cols - maxTDs; i++) {
          $(this).append(createOneCol(i));
        }
      });
    } else if (rows > trCount && cols > maxTDs) {
      // add new rows and add new cols to existing rows

      // adding cols to existing rows
      TRs.each(function (index) {
        for (i = 0; i < cols - maxTDs; i++) {
          $(this).append(createOneCol(i));
        }
      });

      // adding new rows
      $.each(Array(rows - trCount).fill(0), function (index, value) {
        tblBody.append(createOneRow(newMaxTDs));
      });
    } else if (rows > trCount && cols == maxTDs) {
      // console.log("only add TRs with maxTDs");

      // adding new rows
      $.each(Array(rows - trCount).fill(0), function (index, value) {
        tblBody.append(createOneRow(newMaxTDs));
      });
    }

    // Subtraction of rows and cols
    if (rows == trCount && cols < maxTDs) {
      // remove cols from existing rows
      // console.log("remCols cols - maxTDs", maxTDs - cols);
      TRs.each(function (index) {
        const existingCols = $(this).children().length;
        // console.log("existingCols", existingCols);

        if (existingCols > cols)
          for (i = existingCols - cols; i > 0; i--) {
            $(this).children().eq(i).remove();
          }
      });
    } else if (rows < trCount && cols < maxTDs) {
      // add new rows and add new cols to existing rows
      // remove cols from existing rows
      // console.log("cols - maxTDs", maxTDs - cols);
      TRs.each(function (index) {
        const existingCols = $(this).children().length;
        // console.log("existingCols", existingCols);

        if (existingCols > cols)
          for (i = existingCols - cols; i > 0; i--) {
            $(this).children().eq(i).remove();
          }
      });
      // removing rows
      for (i = trCount - rows; i > 0; i--) {
        tblBody.children().eq(i).remove();
      }
    } else if (rows < trCount && cols == maxTDs) {
      // console.log("only remove TRs with maxTDs");

      for (i = trCount - rows; i > 0; i--) {
        tblBody.children().eq(i).remove();
      }
    }

    // Mix adding and subtracting
    if (rows < trCount && cols > maxTDs) {
      // add new rows and add new cols to existing rows

      // removing rows
      for (i = trCount - rows; i > 0; i--) {
        tblBody.children().eq(i).remove();
      }

      // adding cols to existing rows
      TRs.each(function (index) {
        for (i = 0; i < cols - maxTDs; i++) {
          $(this).append(createOneCol(i));
        }
      });
    } else if (rows > trCount && cols < maxTDs) {
      // remove cols from existing rows
      TRs.each(function (index) {
        const existingCols = $(this).children().length;

        if (existingCols > cols)
          for (i = existingCols - cols; i > 0; i--) {
            $(this).children().eq(i).remove();
          }
      });

      // adding new rows
      $.each(Array(rows - trCount).fill(0), function (index, value) {
        tblBody.append(createOneRow(cols));
      });
    }

    return tbl;
  } catch (error) {
    console.error(error);
  }
};

const addRowColSpan = (rowSpan, colSpan, cellId) => {
  try {
    const currRowColSpanVal = getCurrRowColSpan(cellId);
    const cellTD = $(`#${cellId}`).parent().parent();
    const cellTDIndex = cellTD.index();
    const cellTR = $(`#${cellId}`).parent().parent().parent();
    const cellTRIndex = cellTD.parent().index();
    const trList = cellTR.parent().children();

    // Increase colSpan
    if (colSpan > currRowColSpanVal.colSpan) {
      // find current cell index
      const trTDs = cellTR.children();

      cellTD.attr("colspan", colSpan);
      let colSpanDiff = colSpan - currRowColSpanVal.colSpan;
      trTDs.each(function (index) {
        if (index > cellTDIndex && colSpanDiff > 0) {
          trTDs.eq(index).remove();
          colSpanDiff--;
        }
      });

      // Decrease colSpan
    } else if (colSpan < currRowColSpanVal.colSpan) {
      console.log("decrease col span", colSpan);

      // find current cell index
      const trTDs = cellTR.children();
      cellTD.attr("colspan", colSpan);

      if (currRowColSpanVal.rowSpan === 1) {
        let colSpanDiff = currRowColSpanVal.colSpan - colSpan;

        while (colSpanDiff > 0) {
          trTDs.eq(cellTDIndex).after(createOneCol(cellTDIndex));
          colSpanDiff--;
        }
      } else if (currRowColSpanVal.rowSpan > 1) {
        // let rowSpanDiff = currRowColSpanVal.rowSpan - rowSpan;
        // let newIndexToStart = Number(cellTRIndex + currRowColSpanVal.rowSpan) - 1;
        // trList.each(function (index) {
        //   index = trList.length - index;
        //   if (rowSpanDiff > 0 && index > cellTRIndex && index == newIndexToStart) {
        //     // Remove td from each tr
        //     // trList.eq(index).children().eq(cellTDIndex).remove();
        //     if (currRowColSpanVal.colSpan === 1) {
        //       trList.eq(index).children().eq(cellTDIndex).before(createOneCol(index));
        //     } else if (currRowColSpanVal.colSpan > 1) {
        //       let colSpanVal = Number(currRowColSpanVal.colSpan);
        //       // let tds = trList.eq(index).children();
        //       console.log(Array(colSpanVal));
        //       $.each(Array(colSpanVal).fill(0), function (i, value) {
        //         console.log(i);
        //         trList.eq(index).children().eq(cellTDIndex).before(createOneCol(i));
        //       });
        //     }
        //     rowSpanDiff--;
        //     newIndexToStart--;
        //   }
        // });
      }
    }

    // Increase rowspan
    if (rowSpan > currRowColSpanVal.rowSpan) {
      // find current cell index

      cellTD.attr("rowspan", rowSpan);
      let rowSpanDiff = rowSpan - currRowColSpanVal.rowSpan;

      let newIndexToStart = cellTRIndex + currRowColSpanVal.rowSpan;
      // console.log("cellTRIndex", cellTRIndex);
      // console.log("newIndexToStart", newIndexToStart);
      // console.log("rowSpanDiff", rowSpanDiff);
      trList.each(function (index) {
        if (rowSpanDiff > 0 && index > cellTRIndex && index >= newIndexToStart) {
          // Remove td from each tr

          // Colspan is one
          if (currRowColSpanVal.colSpan === 1) {
            trList.eq(index).children().eq(cellTDIndex).remove();
            // Colspan is greater than 1
          } else if (currRowColSpanVal.colSpan > 1) {
            let colSpanVal = currRowColSpanVal.colSpan;
            let tds = trList.eq(index).children();
            tds.each(function (tdIndex) {
              if (tdIndex >= cellTDIndex && colSpanVal > 0) {
                tds.eq(tdIndex).remove();
                colSpanVal--;
              }
            });
          }
          rowSpanDiff--;
        }
      });

      // Decrease rowSpan
    } else if (rowSpan < currRowColSpanVal.rowSpan) {
      // find current cell index
      const trList = cellTR.parent().children();

      cellTD.attr("rowspan", rowSpan);
      let rowSpanDiff = currRowColSpanVal.rowSpan - rowSpan;

      let newIndexToStart = Number(cellTRIndex + currRowColSpanVal.rowSpan) - 1;
      // console.log("cellTRIndex", cellTRIndex);
      // console.log("newIndexToStart", newIndexToStart);
      // console.log("rowSpanDiff", rowSpanDiff);
      trList.each(function (index) {
        index = trList.length - index;
        if (rowSpanDiff > 0 && index > cellTRIndex && index == newIndexToStart) {
          // Remove td from each tr
          // trList.eq(index).children().eq(cellTDIndex).remove();

          if (currRowColSpanVal.colSpan === 1) {
            trList.eq(index).children().eq(cellTDIndex).before(createOneCol(index));
          } else if (currRowColSpanVal.colSpan > 1) {
            let colSpanVal = Number(currRowColSpanVal.colSpan);
            // let tds = trList.eq(index).children();
            console.log(Array(colSpanVal));
            $.each(Array(colSpanVal).fill(0), function (i, value) {
              console.log(i);
              trList.eq(index).children().eq(cellTDIndex).before(createOneCol(i));
            });
          }

          rowSpanDiff--;
          newIndexToStart--;
        }
      });
    }
    return;
  } catch (error) {
    console.error(error);
  }
};

function fillAndAddEventTable(id, inputElem, cssProperty, valAppend) {
  // Get existing value
  const rowCols = getTableRowsCols(id);
  $(`#table-rows`).val(rowCols.rows);
  $(`#table-cols`).val(rowCols.cols);

  const rowColSpanVal = getCurrRowColSpan(id);
  $(`#table-rowSpan`).val(rowColSpanVal.rowSpan);
  $(`#table-colSpan`).val(rowColSpanVal.colSpan);

  $("#table-colSpan").attr({
    max: getMaxNoOfColSpan(id),
    min: 1,
  });

  $("#table-rowSpan").attr({
    max: getMaxNoOfRowSpan(id),
    min: 1,
  });

  // $(`#table-cols`).on("change", function (e) {
  //   e.preventDefault();
  //   $("#table-colSpan").attr({
  //     max: $(`#table-cols`).val(),
  //     min: 1,
  //   });
  // });

  // $(`#table-rows`).on("change", function (e) {
  //   e.preventDefault();
  //   $("#table-rowSpan").attr({
  //     max: $(`#table-rows`).val(),
  //     min: 1,
  //   });
  // });

  $(`#table-rowSpan`).on("change", function (e) {
    e.preventDefault();
    const colSpan = $(`#table-colSpan`).val();
    const rowSpan = $(`#table-rowSpan`).val();

    if (colSpan > 0 || rowSpan > 0) {
      addRowColSpan(rowSpan, colSpan, id);
    }
    converToTableFunc();
  });

  $(`#table-colSpan`).on("change", function (e) {
    e.preventDefault();
    const colSpan = $(`#table-colSpan`).val();
    const rowSpan = $(`#table-rowSpan`).val();

    if (colSpan > 0 || rowSpan > 0) {
      addRowColSpan(rowSpan, colSpan, id);
    }
    converToTableFunc();
  });

  // Add event listeners
  $(`#btn-update-rows-cols`)
    .off()
    .on("click", function (e) {
      e.preventDefault();
      const rows = $(`#table-rows`).val();
      const cols = $(`#table-cols`).val();
      // const colSpan = $(`#table-colSpan`).val();
      // const rowSpan = $(`#table-rowSpan`).val();
      // console.log("colSpan", colSpan);
      // console.log("rowSpan", rowSpan);

      if (rows > 0 && cols > 0) {
        const tableHTML = tableModify(Number(rows), Number(cols), id);
        console.log(tableHTML);
      }

      // if (colSpan > 0 || rowSpan > 0) {
      //   addRowColSpan(rowSpan, colSpan, id);
      // }

      $("#table-colSpan").attr({
        max: getMaxNoOfColSpan(id),
        min: 1,
      });

      $("#table-rowSpan").attr({
        max: getMaxNoOfRowSpan(id),
        min: 1,
      });
      converToTableFunc();
    });

  // Add event listeners
  $(`#table-actions`)
    .off()
    .on("change", function () {
      const action = $(this).val();
      console.log(action);

      const cellTD = $(`#${id}`).parent().parent();
      const cellTDIndex = cellTD.index();
      const cellTR = $(`#${id}`).parent().parent().parent();
      const TRs = cellTR.parent().children();
      if (action === "delCurrRow") {
        cellTR.remove();
        // Close props modal
      } else if (action === "delCurrCol") {
        TRs.each(function (index) {
          TRs.eq(index).children().eq(cellTDIndex).remove();
        });
      } else if (action === "insertRowAbove") {
      } else if (action === "insertRowBelow") {
      } else if (action === "insertColLeft") {
      } else if (action === "insertColRight") {
      }

      $(this).val("");

      converToTableFunc();
    });
}

function resetTableTab(inputElemArr) {
  inputElemArr.forEach(function (value, key, myArray) {
    $(`#${value.inputElem}`).off();
  });

  $("#table-form").trigger("reset");
}

const getMaxNoOfColSpan = (cellId) => {
  const maxRowCol = getTableRowsCols(cellId);
  // console.log("maxRowCol", maxRowCol);

  const cellTD = $(`#${cellId}`).parent().parent();
  const cellTDIndex = cellTD.index();
  // console.log("cellTDIndex", cellTDIndex);

  let maxNoOfCols = maxRowCol.cols - cellTDIndex;
  return maxNoOfCols;
};

const getMaxNoOfRowSpan = (cellId) => {
  const maxRowCol = getTableRowsCols(cellId);

  // console.log("maxRowCol", maxRowCol);

  const cellTD = $(`#${cellId}`).parent().parent();
  const cellTRIndex = cellTD.parent().index();
  // console.log("cellTRIndex", cellTRIndex);

  let maxNoOfCols = maxRowCol.rows - cellTRIndex;
  return maxNoOfCols;
};

const getTableRowsCols = (cellId) => {
  const tbl = $(`#${cellId}`).closest("table");
  const TRs = $(tbl).children().children();
  const trCount = $(tbl).children().children().length;
  let maxTDs = 0;

  TRs.each(function (index) {
    let tdCount = $(this).children().length;
    if (maxTDs < tdCount) {
      maxTDs = tdCount;
    }
  });

  return {
    rows: trCount,
    cols: maxTDs,
  };
};

const getCurrRowColSpan = (cellId) => {
  const cellTD = $(`#${cellId}`).parent().parent();
  const rowSpan = cellTD.attr("rowspan");
  const colSpan = cellTD.attr("colspan");

  return {
    rowSpan: rowSpan ? rowSpan : 1,
    colSpan: colSpan ? colSpan : 1,
  };
};
