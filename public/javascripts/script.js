$(document).ready(function () {
  /**
   * Sample
   * ["labelIcon", "imageSource", "hyperlink", "text",
   * "background", "visibility", "alignment", "border",
   * "padding", "size", "render", "orientation", "socialMediaIcon"]
   */

  Swal.fire({
    // position: "top-end",
    onBeforeOpen: () => {
      Swal.showLoading();
    },
    // icon: "info",
    iconHtml: `<img src="/images/favicon.png" height="45" alt="" />`,
    title: "Loading Signature",
    showConfirmButton: false,
    // timer: 1500,
  });
  (async () => {
    let url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id");
    if (id > 0) {
      const rawResponse = await fetch("http://localhost:8000/getSignatureById?id=" + id, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const content = await rawResponse.json();

      // Set name
      $("#signatureName").val(content.recordset[0].Name);
      let HTMLString = content.recordset[0].HTML;
      let HTMLObj = $(HTMLString);
      setTimeout(function () {
        console.log(HTMLObj.find(".we"));
        addDropEvent(HTMLObj.find(".ns"), false);
        addDropEvent(HTMLObj.find(".we"), false);
        addModalClick(HTMLObj.find(".data"));
        addMouseOverEvents(HTMLObj.find(".data"));
        $("#drop").droppable("destroy");
        // $("#drop").droppable("option", "disabled", true);
      }, 500);
      $("#drop").append(HTMLObj);
      converToTableFunc();
    }
    setTimeout(function () {
      Swal.close();
    }, 500);
  })();

  function css2json(css) {
    var s = {};
    if (!css) return s;
    if (css instanceof CSSStyleDeclaration) {
      for (var i in css) {
        if (css[i].toLowerCase) {
          s[css[i].toLowerCase()] = css[css[i]];
        }
      }
    } else if (typeof css == "string") {
      css = css.split("; ");
      for (var i in css) {
        var l = css[i].split(": ");
        s[l[0].toLowerCase()] = l[1];
      }
    }
    return s;
  }

  function css(a) {
    var sheets = document.styleSheets,
      o = {};
    for (var i in sheets) {
      var rules = sheets[i].rules || sheets[i].cssRules;
      for (var r in rules) {
        if (a.is(rules[r].selectorText)) {
          o = $.extend(o, css2json(rules[r].style), css2json(a.attr("style")));
        }
      }
    }
    return o;
  }

  function processElementsToAppend(currItem, index, type = "none") {
    try {
      var style = css(currItem);

      // let elemChildren = currItem.children().eq(index).children();
      let elemChildren;
      // if (type === "group2") {
      elemChildren = currItem.children();
      // console.log("elemChildren: ", elemChildren);
      // }

      console.log("tagName: ", elemChildren.prop("tagName"));
      if (elemChildren.eq(0).prop("tagName") === "IMG") {
        let imageElem = elemChildren.eq(0);
        imageElem.attr("category", "image");
        let draggedItem = initDraggedItem(elemChildren.eq(0));
        if (draggedItem.hasClass("ph-table-row") && type === "group2") {
          draggedItem.removeClass("ph-table-row");
          draggedItem.addClass("ph-table-cell");
        }
        return draggedItem;
      } else if (
        elemChildren.eq(0).prop("tagName") === "SPAN" ||
        elemChildren.eq(0).prop("tagName") === "BR" ||
        elemChildren.length === 0 ||
        (elemChildren.eq(0).prop("tagName") === "BR" && currItem.text().trim().length > 0)
      ) {
        console.log(currItem.text().trim());
        let textSpan = $(`<span category="textField">${currItem.text().trim()}</span>`);
        textSpan.css(style);
        // console.log(textSpan);
        let draggedItem = initDraggedItem(textSpan);
        if (draggedItem.hasClass("ph-table-row") && type === "group2") {
          draggedItem.removeClass("ph-table-row");
          draggedItem.addClass("ph-table-cell");
        }
        return draggedItem;
      } else if (elemChildren.eq(0).prop("tagName") === "TABLE") {
        let tableElemTR = elemChildren.eq(0).find("tbody:first").children();
        let tdCountMax = 0;
        tableElemTR.each(function () {
          let tdCount = $(this).eq(0).children().length;
          if (tdCountMax < tdCount) {
            tdCountMax = tdCount;
          }
        });

        if (tableElemTR.length > 1 && tdCountMax > 1) {
          // Table
          console.log("table");
          return setTableSubItems(tableElemTR);
          // elemChildren.eq(0);
        } else if (tableElemTR.length === 1 && tableElemTR.eq(0).children().length > 1) {
          // Group 2
          let group2 = tableElemTR.eq(0).children();
          let group2HTML = setGroup2SubItems(group2);
          if (group2HTML.hasClass("ph-table-row") && type === "group2") {
            group2HTML.removeClass("ph-table-row");
            group2HTML.addClass("ph-table-cell");
          }
          return group2HTML;
        } else if (tableElemTR.length > 1) {
          // Group 3
          console.log("Group 3");
          let group3 = tableElemTR;
          let group3HTML = setGroup3SubItems(group3);
          return group3HTML;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  function setTableSubItems(tblTRs) {
    let container = getNewContainerWE();
    let data2 = container.find("div.data2:first");

    let newTbl = $(`<table class="editor-table"><tbody></tbody></table>`);

    tblTRs.each(function (index) {
      trTDs = $(this).children();

      let newTR = $('<tr class="editor-tr"></tr>');

      trTDs.each(function (index) {
        const newItem = processElementsToAppend(trTDs.eq(index), index, "none");
        const rowspan = trTDs.eq(index).attr("rowspan");
        let addRowSpanVal = ``;
        console.log("rowspan", rowspan);
        if (rowspan) {
          addRowSpanVal = `rowspan=${rowspan}`;
        }
        const newTD = $(`
          <td width="30%" class="editor-td" ${addRowSpanVal}>
            <div class="ph-table" style="width:100%;">
              <div align="left" class="ph-table-cell tableDrop editor-td-div" category="table">
              </div>
            </div>
          </td>`);

        let UUID2 = `item-${Date.now() + index}`;
        newTD.attr("id", "editorTD-" + UUID2);
        addDropEvent(newTD, true);
        addModalClick(newTD);
        addMouseOverEvents(newTD);

        newTD.find("div.editor-td-div").append(newItem);
        newTR.append(newTD);
      });
      newTbl.find("tbody:first").append(newTR);
    });

    data2.append(newTbl);

    return container;
  }

  function setGroup2SubItems(group2) {
    let container = getNewContainerWE();
    let data2 = container.find("div.data2:first");
    group2.each(function (index) {
      const newItem = processElementsToAppend($(this), index, "group2");
      data2.append(newItem);
    });

    return container;
  }

  function setGroup3SubItems(group3) {
    let container = getNewContainerNS();
    let data3 = container.find("div.data3:first");
    group3.each(function (index) {
      console.log("Group 3", $(this));
      const newItem = processElementsToAppend($(this).children(), index, "group3");
      data3.append(newItem);
    });

    return container;
  }

  function reverseParseTableHTML(htmlText) {
    // htmlText = `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;"><tbody><tr style="font-size:0;"><td align="left" style="vertical-align:top;"><table cellpadding="0" cellspacing="0" border="0" style="font-size:0;line-height:normal;"><tbody><tr style="font-size:0;"><td align="right" style="padding:0 10px 0 0;vertical-align:middle;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYcAAACCCAYAAACtpAR5AAAACXBIWXMAAAsTAAALEwEAmpwYAAAYWElEQVR42u1d7XHbuhI98dz/0a2AyLAAyxVErsByBZYriF2BpApsVyClAisVmK4gvAVwAlYQpYL3fnDhMIoki8QCBMg9M568D4kivvbsWSwWHyAIAmmixgBG9Dc+8Wua/rZFqXPpRYFAwIUPOwaqiWGKAXlR6m1gJGD6eALgnP6zYnq8BpAD+A9AVpQ6i4AUJ4yPMwRrNWcAbLueP2miFOO8CHI91ByiNgjeIbJsX+dt/mfP4nrpETlcAsgCmSQ3RAguydcYlCmAeZooUPtfAWwCXUwvgS9wQxia+jHz1I8zAHPmZz4CuA+oex9oTbRBRus71HmjAHxnfuwWwL9dkYOAnxBmzN5DU0zob54mSgP4CmBdlFrLKDVSJGMiXdT68TE0ZfoO7tJEPcnYe8HcwTNHaaKmRak3Phpw1ufR6SKskiZqlibqO3kNdx0Twz5lMQfwI03UirwbQft+/Jkm6oFChbFgJcPnRTXMHD3+ylc7zmQoWSbDKE3UIk3UT1p8MezbzIQkeLxx6sdpJO87iehdjyHk/Ya5w2d7GzshBwalAOAHTYhRhE0wJLGIzAMOCSMAz2miYvHKH3ow1r8GqBoACi0JOdhh63gSjCl8tIqUFPZ5O99pr0TQkmjTRD1HYHgVKR5BXKrB4KYLcuhVGqtDYlig2lPomyFVRBBiOOxk/0MMRizycGJwiQAeVMPbHPPhgJztkceCI4NPamHe86Y+RBQiCVVBLGIYZ3H+olMNdSfEKzkIDhPDuKdq4ZiB+y77EFae+SR0lRPBO0bjOHpSDQbOs5aEHE4b+BkRw9AM5RjAixBEFJ5kW6w6HF8lY21F7E7HTQ7BnUYMvkIsW/w+jVse+dxn/D4N7YsgLiM58KXp7xh8lYmZpImaBF7GRKHanF5ERg55QDbCt2p4U/eoTr1HQw7LAwaP22AdY81zVPWFYiCGDYBvqMoy6IbvZ4zcFaoYpCuyGFM/XAdm2LKi1JcMC1uhOkV+5YA0btCuhMtnn15vmqioTs0H5qjYqAZtsW5vXJLDbuG9ha08Kkr9oSeKYQJ3dX80keiGc5LTvsgXh17MY1Hqe+Z+/p+NI1KUeuFg3OdoX/PnLzVYlPrfFu/xwvgOXojW59iHYmfIufhhYQeuYVeD6ZMrUpc9h8MD/uyIFG6LUn8qSr3m9n6KUudFqW9RFedy4VHc9eR07bE+NEaSiwRHkWz6xnRyui+q4SsVcbQx7s7GTMhhP57Bv/m8BHBRlHrtQ3KTh38B/pDeaggb1EWpHwHcMj0ulgy3WE5OB7HfYLnXsK05cDaF9L4IOfgb8AXzYt4CuCxKvfAdJyUlcQGAk5BGYMqPD/0QFhH5mqnPYoCCp6ybnpzEt+mrp5o9+GozZq76kpscssiJgXtx5Khigp32C4WaOPcKZkyhEhXBtFgyPCOJaBnceTLco8htxZhJNYAhtOSknIYohz/BmZmUk2IIIj5KYRJOggghhz/z0G+a4XdUZOsg9JPTr5H30dMeu2ATWnKy77BLDp8xUJAnPGF6XFDEsEMQa6bHTQZ0uvY1onfdMo2t1NdyYyv+UA11wrBxPlyoPVEO/J7wNkRiqBHELfg29OYDmRuaYU40RdvFvmZ4X6A6+yAn4/nn/T7VYBSqzbpk35gWcsBb/JDLC76O4CQxVxbOZCAXBdka2zYHMtsa5l/gCR+OILfGuYgwHEsxt9mYZg8tCTnwsu4y8FIJxkvJwbPR6sRjCRBRESDdMcwxD10W5rN5bpdrzGav4b2zTTb7DuyXAA2eHEg6c3SqhsOj7A7wCJ74dJcHp3zlu9uSQxfGjEsdriS89GYrZrBLc1++Q+rack6zVmoV5VAZN47Jv4ykMJ2ZiFvYbYK9Gc6uctY99rdtoobPQ1u6Zmg41KGC3BpnYLPXcGrtKpvQ0oyTyLnJ4TXCAedgW+3j5LMDcL3zpK/WgBabTftyz06D3lGHmuGZ86FfH0uqwUZBnkrUG8tXZVPyg74JjjGk9BRj+xlkrK1nHQOp2HrNWYt5qZjGdwu+8FJIZx+6UOg+VAPHmmQ7ENfnO6R9Gqd1xH3wleEZvZw35DzYbri3cRwUVxsoQWLDsVaYzz58tGhT7nkeLDypBg5nky2DcOh7DhyH/jYx7TVweLb7jFkHm5Y+DMTKUk1ngdyRcM/kbXOefYjCoWBwENrck2FL5jMhhzCUw7eYO4C8sG2Ei33r2CjMYB9yXAYyxprpXYZ49uHO0kFYthivrSVBsISWhk4OHAZt04N+4PDCe7NfxXQD4KajMy/5AYPzyDTO06GUTelINXA4nSwZhNzXhH6m+JxvZE0XItMEzyMPKRm8MqiocexEScZgxaAYbDeCWxPtO/PxFna3jhms0kRddDT3tcff8q4adpxOGwfli+UcZCeHCbrLQGnqpakOfjNUaAwYRAp3tKA4FNCtpeF0EqIrSp2niXqEfQaWomcs+jpXaVO3K9WAotTbNFEbC0dlaksOQw4rcZDDfz3pi67I4ZzrndNENZLSaaLGaaLu0kQ9A/iJKlWRixhCVlBL8G1Ojztefy5hOx849nhsQksjCo/aK4fI44htYqkcF7AM2uNmMPQ2i6/co1pXaaLMuOja3PhF7zeqfdYFbkM/DEke6S147kh/AHDZN3KwvP7TWjXUYBtauoJFmn1flMO2o8mZ96T/OCZypxvSZJR1bWwn9HdHXuAU7sKe2xiIodZXXIX5+nrvg20p+iXTONlmLU1tUo+ltpL94PWhHX1RQF2kjpqLnUIghiYG/xbhnX3o3CELSDUY2B5Sbd2WfyAQdKfe2NVDmqi5p5CFRlVs0QUpnHvoK50m6onBSzYZXteehvmX4+fbpjDPbGP9zLhBy2rRohwEXPtNoWzOu1YPG1QhpE8O1YIXT7wo9QJy9mF3HUx6trzHbRMHhrznIOge7B7+zt4D19zaoArD/FuU+jrSCryH4P3eh4ArvPb12ttWJ6bPfHsrjjygHAIhBz71YG7KuyxK/UYIfdlj2rN2HpnG8tTN6eBsTU9Vw5uysyWHQddrHzg4FoVvgt46VA9ZUepFDFe+MpIph9qae7hT3NWYzHs8vqrNFaKy52DnbfSlntBHhmf49qrfIyMb9XDnwci58KxbETQponumd19FuI6nPVYNBo0vNePMVloDuPctvTveCBujHyU0OFRjUKE9yly6sVj0c/DF432Nxy+L/tpYlmt4U6FpomaR7cs8oP+YpYlqZJ85lUPZRUzWQvpzXGmqejJxbAl2G2g8fmm5mBSGBa6zDw+xqGqG6z9jQiPil7CSHc5jbwBXddoQFR85DjbKbj6kyUwEz3Xvw9yRM8LthAxpjBsVEqyTw0cMCxnDMyY96Icrhme8Btw+UQ/NCOKRaW3cuUhZ5cxMHJhqAKozDye3d8jZStp3Z/dBanIpB4/GTtRDc7CdfQhYMY8wjL2GvxyeUz842PIZVD5gC/uc6yl48sS7WCATDs8p8BLVRj20VXmzNFFffaW1WobbNOPaWDIQ4zhN1B2pkdBwx7D2N/BfGcB2TG5w4j0cQ6+tlDF4zq1rlwQAjrtm2xKDN8VVlDpLE5XBLnMpi2A8NWOfLdJEXTFEFOZpooI6QMhw/SfwuxKv7+zMz7ALZ6s0UZNTnJ2hb0hzxMrHMdaVYag+aduHtuTQ1BDa7D1MhnJv8g44zj5whm+4yI9DNTx1RHhfGZ5xklM4dHLg8gZjjEtzvXMnIaWmZZEZ9h5WQ1sc1Gccqni2Q66fuyIHRtXQVbRgA/uMrZOiJYMun0GZDxzeSFSeJWWRcKiGTWR3QdioBxVYKWaffcYxxqFs/nJcB9uVauC4AAg48QpRzsJ7sRa/2zBOuljA5QXb3HH7sYOFZasefBzuUoE5UFvwZC+Nu741jkKptu/QpWow4AgtvZvCzhlWirVi5RPTc6K4MjFN1AOTStSWJRK6Uqo26mHEYFxckoOTNcgYXpp3fHKaw4F76npzncbDVs1N30vDH/wJaQqLZEyPewg5vERSksu4LSMdb1v18CXUsy2OS9cvGcjHdnN6azH3FexDqSGoBgOOiMdUyMGvoXsO8TITeieucJKO/MIbW/UwuINxjOGlmYVqtDlTwDFmm4BScp1nLZ2R4ZhgwGDwJneNx0tIBEEliV8CI1MV8XjPhrhm6LDjhmmN+Jz/E/AkYCwDGosc9vu8R68QFeXwG/eMzzIEMeu6UbQP8sy4IDMm1aA67hrbvSZX6iEJfJ1wVW71CY6xWgeYmedUPQg5/MnEnPHEEap7dZ+72IRLEzVKE/UM3hRCrtCCLTTDeG8snzNxRP4q8HUSyhxooho4VF6Ie2wcKm4m5HD6BODe1JsC+OEzk4mM1g/wFNX7o38C8Z4043hbeaQ9ug2wKbFmoho6HwfNYK9Gh64QNeQg90f/6RVxy+YRqkymH2miFi4MCimFWZqoH6g2nrl/Y81VQC2UeD2Fx2zGWsF9amuoCD68RE4Sx1z7GnAznZ15OKsZLwHewkv3jh6vyJP5SeEmq/sCiBCmaaJWpBRWjsISLvuka9juPXCntqpI1olG+OnMHKoh81WRtyVYQkv7HNahV2U96FGmiQLc1tOZ0h/SRJnMg7Iu182kpIwCM3gTVJuWY0+KLwdwGeg1oCyKyNKImNRWrjh8W3LIOlgnj1S51ZcSPLmNjBf5BE2AVF49Z7AFU1oLf5FDAsE+gjj3FDaoG/p5bYJ33Q2uiGEc2OJawy7V0eudD4HhHsD3kF6I8SKfPJIxfWJwZL/sksMZo5TN+zbri1LfI6LMjIgUQ2hhTI647RBvjDNh2NC86zumOfYUyTBwhJb+utXyjHGSbHs6+dcDJIgN+h1K2h3jjMG5sU5tjfVgXVHqBRgvGmJQDV8YHhVNFQBapxzO+WwfOciG9PsEcRHKAnCMZVHqa8fEcB6oNLdWD0NMbSWE4kA9MNmz2GqHsR+Ik1TWZvL5Ah1dbuMBmtTCwsNvhVgenuMSFYWBpraS+urU02a83XAbYe0wDruk6upVDsE1lG9Fqa8BXPdMRSwBXES0ofrLkTTnMAg2qa2THsyjLkORXNmFT7F1PNOBuD/Uw1mo5YcDH4gNqYiuF4Mt1gA+FaVeeN5fCNUIchiFQVZtrRkol4Y1P6IaJkzzKqSy3E3BEVp6O/NwhkgO3QSqIhYAPkVIEoYUbiO75tOHceM6VNRmXX3sQR8uXKnqdxwYrhpim4gTMbiU/9SQg4CBJIpS/4tqUy7UPQlzyvnfLkkhAqXKVSqhjbHqy97fvec5NWPsu2WsnU77ohzr+oshB9mM5hucNe1JhEIUGS3UT0WpL4pSPwbgFanAx3DDtMCmQ70nxWdhPgqBcIXx1j1Q0lxnHsb/oAqHZLQgyhYPOoekwu6Tv2v6q8dDz4mMXRhIk+v8irDrwZj59triuwn1nesFvES1MZej/eb3OY151rBv1i3WYYLwwpr3pJ7a2pU6Ph5xYif0GxvLsRoh7AJ7p+Ib9VXbuWv6evxBTLl/kLdjSELtmfyjnf+e7yx+s+AMIeRDObAmEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEseKDdIGgj0gTpQAoAChKnTE8bwRg3PBreVHqLXO7JgAmAD7ueR8NoASQtfntlm08Bbootd7TDpaxOTL2f/3uzufGAEYu2tf0Xd6bw4fG02Ub/hEzIugpno2hSxN1W5R6bfm8MYCXFoZqC+AJwGNbokgTNQNwBWBa+5+3APKdj07JUMzpexsA3xq0vVUbT8ASwGLnf3tx6KDOqA/2/W4dD0S0LtrX9F32Gf0XGs/1ERJ11gYhB0EfVcOEDF1GC+cKwJrp8TmA+xMNbUIGew7gKk3UZROCSBM1pcWvSBU8AngFkB16Ts37N2QyTRM1B3B7gpeuyUiYdm6PtO3hhL4wnm8W+JS530O0p2LC3T4awzox3HbRBiEHQR8xJ0N3DeAnGcgRU4hne2IoxHzmPk3UijzIFwAXJxqHFRl3TYb9JHKjNmb0d0+q4wHAS5qox6LU90e+q0/xbtNENe2LrnDqu+UW7QiBGJy04UzsiKCHqmECYEmGcl0LuXDgtekXaIFvAIzJWJ9iHKb07hc2ITH67if6/TsiKi7Ykm02oKl5altNODRrQAxOIOQg6KVqqBnUr/TvlwBCF0AV7nmPGMakFm451E5R6m1R6msim1maqAfLRxrp8F+gcyCJ1LFZkWOTk+rtFEIOgj6phqlRDTXDmKEKzYwp+6MTUMhG4/jm4QMRwyPDBvohBZOTgrBRUirwqaAa9ksWwNx9QBV6zAFcNnUKXLRByEHQJzzsqAbsqIdpx++ncSDtkMJhMwon3Dt8h+taX/Ud2xhekkKNd22JQZSDQPD+AlN11VCDIQuO0FLuqAlz+tdpnJkUzCMA9d7+h8OxmnhSa3kk83ZFRBYMMQg5CPqE+QHVYAxiRgbR9pCXzeId7yOX2ib6uulBqZZ4YiRLwXF8fIckgyQGIQdB31TD1yMfM//fjYVht/WWR9iftXKzY7Rde9SaSGpMm+BtkQWqwkLCeF9byUl5rhFDcH0h5CDoi2rYogqXHDKIa/pM232HEcM74gCBTUn1+DQQ3+jfSYfj9svRc09t09hXQ+uqoHb6GQzE4KwNQg6CvqiGpxNk+QZVaGnawTtOUIWN9nmQI3o3n8gtjMt5T6bPqIP5Wi+LccvgEDhrg5CDoPeqoQYTtrmy8ACzFsSwwuFSE8bL9X1mQNO/bc4EjCKYF5r5cxzEYE6+G2LYeG6rkINAVMMBw56TkZ5axtpPebdpmqiXGjEc2nAc+TZStb4Awj+z0Aty2HPAcd1BWxtBaisJYlcNAJA3SI/MaYGa8hStDD+qTB+NqkS2gSmjbd5li6qMx+LI4z63USSBoG1IxISyPqeJWnTcBmXxDrqBkTdlMZYODjg6aYOQgyB21WAWXlM0rdR6XvO6N2miruj3Zzufy+i53xjDBkHCIvXSqKUJut0QN8pp3vK72QlzyGSo3ZNy+JImasOcfOCkDUIOgphVwxbtatDMUYWWVINzBaMdw3grQ2BNLux3OZCCbHInRVaU+tJhM00RvTxN1D2qMOMLlW/nIggnbRByEMSoGu7IW1q2CcdQ/HeCKrT02OCr2x71oVFducwob2S4pnLnKwCrpvd7+IZsSAtiM2ojNMtQ2rdIN/T9pgfiXBhSvWOsfcH8XpuzBpMIpsr2BIXRCUGgCjGNSUGMLNaC0zYIOQhiwx2qEM+Tpddl7lcYd9yecsdY+4Jpd9by+zrweRJqOXEUpX5EFee3JgghB4Hgt2r4YqMaajBnHm46blbekTdumyWlbX87ELx6+A29hyBuawTxEGIbhBwEQ1QNJs9f4+9so/c8bW4Y43zlqxOJZKfwfyp7aM7MeEcd7iOIHNUFTKvQ3l/IQTBE1WCwATA6sZyGE+lPJGdCXMpTd5r2fpOZ5RSnzJnLGkEEdceGkINgcKqhhq++vfYDMEZ67un35gC2Lm6bE7RyDgxB3HV1x4aQgyB21QBG1fBHaOnETcFXRwZiXXuPseO+fEsDthgLwD6t11UK7eTEz41Dmd9EELfUp6sGBOG0DUIOgphUw9pBXrjZmO76ClFTlG/lKnuFiGcOIKeMmTYwBskmG2iC7s+MjEL6DXJULmsEMem6DUIOgphUw9LBT5hN2Zt3jKpr73FDqogje+VQG8zJ4esBTB0dwDuMm6gkIggzNs9dp1kLOQhCx0NNNbAv+NqtaJMjG8Je8tCLUt+jSm+cpYn6zrVBTRvu9ctl9ADmzalt9KFgtg3mQIYqxDRCdQZi3FUbhBwEIasGhd+ppkuHP2U2pmddt5nSG5fkdX5PE7VoG2ZKE6UoRfKZjOVFiNdRdozg+oP2oJY1ghh10QaprSQIGSZ7Z+3Y292QQrkBsOhKOdSMwyJNVEbtn4MqeaLKasqP9QV5mhNUB82mOK1seBPY3qXtOlRy6gE7U2V3TPWOmkLRX3bkIGFiOQcSclheDtRhctoGIQfB0FUDilLrNFEaVV388R7v2nvslxZrRhuTN2ToZ9Q3wN9lL8xCr3uTtwA2zJv4o46/z90Ojv2d7IjxtYGpwTQ+QBBO2yDkIAgZl6jy8bWH37qmxbbPkK5p8WjfHWBIAsBtTRWM9njIGaqTuDl5gq5i6bZ9Uc/KcYF76p/8xM/ZQjO8y6Gx36aJuqw5J7vz02kb/g8YYbTPSkcWJAAAAABJRU5ErkJggg==" height="75" border="0" alt="" style="height:75px;min-height:75px;max-height:75px;font-size:0;"></td><td rowspan="2" align="left" style="padding:0 0 0 10px;border-top:none;border-right:none;border-bottom:none;border-left:solid 2px #000001;vertical-align:top;"><table cellpadding="0" cellspacing="0" border="0" style="width:100%;font-size:0;"><tbody><tr style="font-size:0;"><td align="left" style="vertical-align:top;"><table cellpadding="0" cellspacing="0" border="0" style="width:100%;font-size:0;color:#000001;font-style:normal;font-weight:700;white-space:nowrap;"><tbody><tr style="font-size:16px;"><td align="left" style="vertical-align:top;font-family:Arial;">SHOBHA&nbsp;NEWSLETTER<span style="font-family:remialcxesans;font-size:1px;color:#FFFFFF;line-height:1px;">​</span></td></tr><tr style="font-size:12px;"><td align="left" style="vertical-align:top;font-family:Arial;">SECRETARY</td></tr></tbody></table></td></tr><tr style="font-size:12px;color:#000001;font-style:normal;font-weight:400;white-space:nowrap;"><td align="left" style="vertical-align:top;font-family:Arial;"><br></td></tr><tr style="font-size:0;"><td align="left" style="vertical-align:top;"><table cellpadding="0" cellspacing="0" border="0" style="width:100%;font-size:0;color:#000001;font-style:normal;font-weight:400;white-space:nowrap;"><tbody><tr style="font-size:12px;"><td align="left" style="vertical-align:top;font-family:Arial;">Street1</td></tr><tr style="font-size:12px;"><td align="left" style="vertical-align:top;font-family:Arial;">City1</td></tr><tr style="font-size:12px;"><td align="left" style="vertical-align:top;font-family:Arial;">POBOX1</td></tr></tbody></table></td></tr><tr style="font-size:0;"><td align="left" style="vertical-align:top;"><table cellpadding="0" cellspacing="0" border="0" style="width:100%;font-size:0;color:#000001;font-style:normal;font-weight:400;white-space:nowrap;"><tbody><tr style="font-size:12px;"><td align="left" style="vertical-align:top;font-family:Arial;"><a href="http://www.example.com/" target="_blank" id="LPlnk689713" style="text-decoration:none;color:#000001;"><strong style="font-weight:400;">www.example.com</strong></a></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr style="font-size:0;"><td align="left" style="padding:5px 10px 0 0;vertical-align:middle;"><table cellpadding="0" cellspacing="0" border="0" style="white-space:nowrap;color:#A4BFDB;font-size:12px;font-family:Arial;font-weight:700;font-style:italic;text-align:right;width:100%;"><tbody><tr style="font-size:9px;"><td style="font-family:Arial;">MEETING&nbsp;CUSTOMER&nbsp;REQUIREMENTS&nbsp;IS&nbsp;A&nbsp;DAILY&nbsp;JOB<br>EXCEEDING&nbsp;THEM&nbsp;IS&nbsp;WHAT&nbsp;MAKES&nbsp;US&nbsp;DIFFERENT</td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>`;
    html = $(htmlText);
    htmlMainTRs = html.find("tbody:first").children();

    htmlMainTRs.each(function (index) {
      console.log($(this));

      const getTD = $(this).children();
      const newItem = processElementsToAppend(getTD, index, "none");
      $("#drop").append(newItem);
    });
    converToTableFunc();
  }

  //Import event listener
  $("#importSource").click(function (e) {
    let importedHTMLText = $("#htmlText").val();

    reverseParseTableHTML(importedHTMLText);
    $("#importModal").modal("hide");
    $("#importModal").trigger("reset");
  });

  // Save signature
  $("#saveSignature").click(function (e) {
    let url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id");
    if (id > 0) {
      console.log("Save signature");
      (async () => {
        let name = $("#signatureName").val();
        let html = $("#drop").html();
        let signatureHTML = $(".panelPreview").html();
        const rawResponse = await fetch("http://localhost:8000/updateHTML", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, html, signatureHTML, id }),
        });
        const content = await rawResponse.json();
        Swal.fire({
          // position: "top-end",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
      })();
    } else {
      console.log("Save signature");
      (async () => {
        let name = $("#signatureName").val();
        let html = $("#drop").html();
        let signatureHTML = $(".panelPreview").html();
        const rawResponse = await fetch("http://localhost:8000/saveHTML", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, html, signatureHTML }),
        });
        const content = await rawResponse.json();
        Swal.fire({
          // position: "top-end",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
      })();
    }
  });

  function droppableDrop() {
    $("#drop").droppable({
      // accept: function (item) {
      // 	return $(this).data('color') == item.data('color');
      // },
      classes: {
        "ui-droppable-hover": "ui-state-hover",
      },
      bubbles: false,
      greedy: true,
      tolerance: "pointer",
      drop: function (event, ui) {
        console.log("I am i #drop");
        var $canvas = $(this);
        if (!ui.draggable.hasClass("canvas-element")) {
          var $canvasElement = ui.draggable.clone();
          $canvasElement.addClass("canvas-element");

          let draggedItem = $canvasElement;
          draggedItem = initDraggedItem(draggedItem);

          // Mouse events
          // addMouseEvents($canvasElement.find(".ns"), $canvasElement.find(".we"));
          // // Dropaable

          // addDropEvent($canvasElement.find(".ns"), true);
          // addDropEvent($canvasElement.find(".we"), true);

          // Draggable
          // $canvasElement.draggable({
          // 	containment: '#container',
          // 	cursor: 'move',
          // 	start: function (event, ui) {
          // 		$(this).draggable('instance').offset.click = {
          // 			left: 0,
          // 			top: 0,
          // 		};
          // 	},
          // });

          $canvas.append(draggedItem);
          // $canvas.droppable("disable");
          $("#drop").droppable("destroy");
          // $canvas.droppable("option", "disabled", true);
          // $canvas.css({ "min-width": "0px" });
          $canvasElement.css({
            my: "center",
            at: "center",
            of: $canvas,
            using: function (pos) {
              $canvas.animate(pos, 200, "linear");
            },
          });
          converToTableFunc();
        }
      },
    });
  }

  setTimeout(function () {
    // addMouseEvents();

    // $("#convertToTable").on("click", function () {
    //   converToTableFunc();
    // });

    $(".drag").draggable({
      cancel: false,
      helper: function (e) {
        return $(this).clone();
      },
      cursor: "move",
      start: function (event, ui) {
        $(this).draggable("instance").offset.click = {
          left: 0,
          top: 0,
        };
      },
    });
    $(".delDrop").droppable({
      bubbles: false,
      classes: {
        "ui-droppable-hover": "delDropHover",
      },
      greedy: false,
      tolerance: "pointer",
      drop: function (event, ui) {
        let canvas = $(this);

        let itemId = ui.draggable.attr("id");

        let canvasParent = ui.draggable.parent();
        $("#" + itemId).remove();

        const canvasParentTable = canvasParent.parent().closest("div.drag.vertical").parent();
        console.log("canvasParentTable", canvasParentTable);
        console.log("canvasParentTable.hasClass", canvasParentTable.hasClass("editor-td-div"));
        console.log("canvasParent.children().length", canvasParent.children().length);

        if (canvasParent.children().length === 1 && canvasParent.hasClass("tableDrop")) {
          canvasParent.html("&nbsp;");
          addDropEvent(canvasParent);
        } else if (canvasParent.children().length === 1 && canvasParent.attr("id") !== "drop") {
          canvasParent.remove();
          if ($("#drop").children().length === 1) {
            droppableDrop();
            // $(".drop")
            //   .droppable({
            //     bubbles: false,
            //     greedy: true,
            //     tolerance: "pointer",
            //     drop: droppableDrop,
            //   })
            //   .droppable("enable");
          }
        } else if (canvasParent.children().length === 1 && canvasParentTable.hasClass("editor-td-div")) {
          console.log("jererer");
          canvasParent.parent().closest("div.drag.vertical").remove();
          canvasParentTable.html("&nbsp;");
          addDropEvent(canvasParent);
        }

        setTimeout(function () {
          converToTableFunc();
        }, 200);
      },
    });
    $("#drop").droppable({
      // accept: function (item) {
      // 	return $(this).data('color') == item.data('color');
      // },
      classes: {
        "ui-droppable-hover": "ui-state-hover",
      },
      bubbles: false,
      greedy: true,
      tolerance: "pointer",
      drop: function (event, ui) {
        console.log("I am i #drop");
        var $canvas = $(this);
        if (!ui.draggable.hasClass("canvas-element")) {
          var $canvasElement = ui.draggable.clone();
          $canvasElement.addClass("canvas-element");

          let draggedItem = $canvasElement;
          draggedItem = initDraggedItem(draggedItem);

          // Mouse events
          // addMouseEvents($canvasElement.find(".ns"), $canvasElement.find(".we"));
          // // Dropaable

          // addDropEvent($canvasElement.find(".ns"), true);
          // addDropEvent($canvasElement.find(".we"), true);

          // Draggable
          // $canvasElement.draggable({
          // 	containment: '#container',
          // 	cursor: 'move',
          // 	start: function (event, ui) {
          // 		$(this).draggable('instance').offset.click = {
          // 			left: 0,
          // 			top: 0,
          // 		};
          // 	},
          // });

          $canvas.append(draggedItem);
          // $canvas.droppable("disable");
          $("#drop").droppable("destroy");
          // $canvas.droppable("option", "disabled", true);
          // $canvas.css({ "min-width": "0px" });
          $canvasElement.css({
            my: "center",
            at: "center",
            of: $canvas,
            using: function (pos) {
              $canvas.animate(pos, 200, "linear");
            },
          });
          converToTableFunc();
        }
      },
    });
  }, 500);

  // function addDropEvent(el, greedy) {
  //   el.removeClass("ui-droppable");
  //   $(el).droppable({
  //     classes: {
  //       "ui-droppable-hover": "ui-mouse-enter",
  //     },
  //     bubbles: false,
  //     greedy: greedy,
  //     tolerance: "pointer",
  //     drop: function (event, ui) {
  //       console.log("I am in el");

  //       var $canvas = $(this);
  //       if (!ui.draggable.hasClass("canvas-element")) {
  //         var $canvasElement = ui.draggable.clone();

  //         let itemEdited = false;
  //         if ($canvasElement.attr("id")) {
  //           itemEdited = true;
  //         }
  //         // if (!$canvasElement.attr("id")) {
  //         $canvasElement.addClass("canvas-element");
  //         let draggedItem = $canvasElement;
  //         draggedItem = initDraggedItem(draggedItem);

  //         $canvasElement = draggedItem;
  //         // } else {
  //         //   // $canvasElement.addClass("canvas-element");
  //         //   let draggedItem = $canvasElement.find("");
  //         //   draggedItem = initDraggedItem(draggedItem);

  //         //   $canvasElement = draggedItem;
  //         //   console.log("$canvasElement", $canvasElement);
  //         // }
  //         // else {
  //         //   console.log($("#" + $canvasElement.attr("id")).parent());
  //         //   // Single child case only
  //         //   if (
  //         //     $("#" + $canvasElement.attr("id"))
  //         //       .parent()
  //         //       .children().length === 3
  //         //   ) {
  //         //     const childrenData = $("#" + $canvasElement.attr("id"))
  //         //       .parent()
  //         //       .children();
  //         //     // console.log("childrenData", childrenData);
  //         //     let childLeft;
  //         //     $.each(childrenData, function (key, value) {
  //         //       console.log("childrenData", $(this));
  //         //       if ($(this).attr("id") !== $canvasElement.attr("id")) {
  //         //         childLeft = $(this);
  //         //       }
  //         //     });

  //         //     // childLeft = addMissingNorthSouth(childLeft);
  //         //     // childLeft = addMissingEastWest(childLeft);

  //         //     if (childLeft.parent().hasClass("data2") || childLeft.parent().hasClass("data3")) {
  //         //       childLeft = compareAddRemNSEW(childLeft.parent(), childLeft);
  //         //       const parentId = childLeft.parent().closest("div.drag.vertical").replaceWith(childLeft);
  //         //     }
  //         //     // $("div.second").replaceWith("<h2>New heading</h2>");

  //         //     console.log("childLeft", childLeft);
  //         //   }
  //         //   // Mouse events
  //         //   addMouseEvents($canvasElement.find(".ns"), $canvasElement.find(".we"));

  //         //   //Drop events
  //         //   addDropEvent($canvasElement.find(".ns"), true);
  //         //   addDropEvent($canvasElement.find(".we"), true);
  //         //   addMouseOverEvents($canvasElement.find(".data"));
  //         //   addModalClick($canvasElement.find(".data"));
  //         //   $("#" + $canvasElement.attr("id")).remove();
  //         // }

  //         // Mouse events
  //         // addMouseEvents($canvasElement.find(".ns"), $canvasElement.find(".we"));

  //         // //Drop events
  //         // addDropEvent($canvasElement.find(".ns"), true);
  //         // addDropEvent($canvasElement.find(".we"), true);

  //         // Draggable
  //         // $canvasElement.draggable({
  //         // 	containment: '#container',
  //         // 	cursor: 'move',
  //         // 	start: function (event, ui) {
  //         // 		$(this).draggable('instance').offset.click = {
  //         // 			left: 0,
  //         // 			top: 0,
  //         // 		};
  //         // 	},
  //         // });

  //         // console.log("Canvas: ", $canvas);
  //         // console.log("Parent: ", $canvas.closest("div.drag.vertical"));
  //         // console.log("east: ", $canvas.hasClass("east"));
  //         // console.log("west: ", $canvas.hasClass("west"));
  //         // console.log("len: ", $canvas.closest("div.data2").length);

  //         if ($canvas.hasClass("east") || $canvas.hasClass("west")) {
  //           let data2Parent = $canvas.closest("div.data2");
  //           // console.log("data2Parent+++", data2Parent);
  //           let existingItemParent = $canvas.closest("div.drag.vertical").parent();

  //           console.log("existingItemParent", existingItemParent);
  //           if (existingItemParent.hasClass("data2")) {
  //             let existingItem = $canvas.closest("div.drag.vertical");
  //             // Change from table row to table cell
  //             if ($canvasElement.hasClass("ph-table-row")) {
  //               $canvasElement.removeClass("ph-table-row");
  //               $canvasElement.addClass("ph-table-cell");
  //             }
  //             if ($canvas.hasClass("east")) {
  //               existingItem.after($canvasElement);
  //               $canvas.remove();
  //             } else if ($canvas.hasClass("west")) {
  //               existingItem.before($canvasElement);
  //               $canvas.remove();
  //             }
  //           }

  //           // If new container
  //           else if (existingItemParent.hasClass("data3") || existingItemParent.attr("id") == "drop") {
  //             let existingItem = $canvas.closest("div.drag.vertical");
  //             let newItem = $canvasElement;

  //             // Change from table row to table cell
  //             if (existingItem.hasClass("ph-table-row")) {
  //               existingItem.removeClass("ph-table-row");
  //               existingItem.addClass("ph-table-cell");
  //             }
  //             if (newItem.hasClass("ph-table-row")) {
  //               newItem.removeClass("ph-table-row");
  //               newItem.addClass("ph-table-cell");
  //             }

  //             let container = getNewContainerWE();

  //             let existingItemNorth = existingItem.find("div.noso:first > div > div.north");
  //             let existingItemSouth = existingItem.find("div.noso:first > div > div.south");
  //             // console.log("existingItem", existingItem);

  //             console.log("Edited", itemEdited);
  //             console.log("Parent item count", existingItem.parent().children().length);

  //             if (!itemEdited) {
  //               if (existingItemNorth.length && !existingItemSouth.length) {
  //                 container.find("div.south").parent().remove();
  //               } else if (existingItemSouth.length && !existingItemNorth.length) {
  //                 container.find("div.north").parent().remove();
  //               }
  //             }

  //             existingItem = addMissingNorthSouth(existingItem);
  //             if ($canvas.hasClass("east")) {
  //               existingItem.after(container);
  //               container.find("div.data2").append(existingItem);
  //               container.find("div.data2:first").append(newItem);
  //               $canvas.remove();
  //             } else if ($canvas.hasClass("west")) {
  //               existingItem.before(container);
  //               container.find("div.data2").append(newItem);
  //               container.find("div.data2").append(existingItem);
  //               $canvas.remove();
  //             }
  //           }
  //         } else if ($canvas.hasClass("north") || $canvas.hasClass("south")) {
  //           // console.log("Canvas: ", $canvas);
  //           // console.log("Parent: ", $canvas.closest("div.drag.vertical"));
  //           // console.log("north: ", $canvas.hasClass("north"));
  //           // console.log("south: ", $canvas.hasClass("south"));

  //           let canvasParent = $canvas.closest("div.drag.vertical").parent();
  //           let existingItem = $canvas.closest("div.drag.vertical");
  //           // console.log("canvasParent: ", canvasParent);
  //           // console.log("existingItem: ", existingItem);
  //           // console.log(" $canvas: ", $canvas);

  //           if (canvasParent.hasClass("data2")) {
  //             let container = getNewContainerNS();

  //             // console.log("New Container NS", container);
  //             // console.log("canvasParent -> Parent", canvasParent);

  //             let existingItem = $canvas.closest("div.drag.vertical");
  //             let newItem = $canvasElement;

  //             // Change from table cell to table row
  //             if (existingItem.hasClass("ph-table-cell")) {
  //               existingItem.removeClass("ph-table-cell");
  //               existingItem.addClass("ph-table-row");
  //             }
  //             if (newItem.hasClass("ph-table-cell")) {
  //               newItem.removeClass("ph-table-cell");
  //               newItem.addClass("ph-table-row");
  //             }

  //             let existingItemEast = existingItem.find("div.eowo:first > div.east");
  //             let existingItemWest = existingItem.find("div.eowo:first > div.west");
  //             if (!itemEdited) {
  //               if (existingItemEast.length && !existingItemWest.length) {
  //                 container.find("div.west").remove();
  //               } else if (existingItemWest.length && !existingItemEast.length) {
  //                 container.find("div.east").remove();
  //               }
  //             }

  //             if ($canvas.hasClass("north")) {
  //               existingItem = addMissingEastWest(existingItem);
  //               existingItem.before(container);
  //               container.find("div.data3").append(newItem);
  //               container.find("div.data3").append(existingItem);
  //               $canvas.parent().remove();
  //             } else if ($canvas.hasClass("south")) {
  //               existingItem = addMissingEastWest(existingItem);
  //               existingItem.after(container);
  //               container.find("div.data3").append(existingItem);
  //               container.find("div.data3:first").append(newItem);
  //               $canvas.parent().remove();
  //             }
  //           } else if (canvasParent.hasClass("data3")) {
  //             if ($canvas.hasClass("north")) {
  //               $canvas.closest("div.drag.vertical").before($canvasElement);
  //               $canvas.parent().remove();
  //             } else if ($canvas.hasClass("south")) {
  //               $canvas.closest("div.drag.vertical").after($canvasElement);
  //               $canvas.parent().remove();
  //             }
  //           } else if (canvasParent.attr("id") == "drop") {
  //             if ($canvas.hasClass("north")) {
  //               $canvas.closest("div.drag.vertical").before($canvasElement);
  //               $canvas.parent().remove();
  //             } else if ($canvas.hasClass("south")) {
  //               $canvas.closest("div.drag.vertical").after($canvasElement);
  //               $canvas.parent().remove();
  //             }
  //           }
  //         } else if ($canvas.hasClass("tableDrop")) {
  //           console.log($canvas);
  //           $canvas.html("");
  //           $canvas.append(draggedItem);
  //           $canvas.droppable("destroy");
  //           // $canvas.droppable("disable");
  //         }

  //         // $canvas.remove();
  //         // $canvas.append($canvasElement);
  //         $canvasElement?.css({
  //           my: "center",
  //           at: "center",
  //           of: $canvas,
  //           using: function (pos) {
  //             $canvas.animate(pos, 200, "linear");
  //           },
  //         });
  //         setTimeout(function () {
  //           converToTableFunc();
  //         }, 1000);
  //         // converToTableFunc();
  //       }
  //     },
  //   });
  // }

  // function compareAddRemNSEW(elem1, elem2) {
  //   let existingItemNorth = elem1.find("div.noso:first > div > div.north");
  //   let existingItemSouth = elem1.find("div.noso:first > div > div.south");
  //   // console.log("existingItem", existingItem);

  //   // console.log("existingItemNorth", existingItemNorth);
  //   // console.log("existingItemSouth", existingItemSouth);
  //   if (existingItemNorth.length && !existingItemSouth.length) {
  //     elem2.find("div.south").parent().remove();
  //   } else if (existingItemSouth.length && !existingItemNorth.length) {
  //     elem2.find("div.north").parent().remove();
  //   }

  //   return elem2;
  // }

  function removeItemWithParent(itemId) {
    let childLeft = $("#" + itemId);
    let siblings = childLeft.parent().children();

    console.log("siblings", siblings.length);
    // If siblings are 3 then it means there will be only 1 item left in group 2 or group 3.
    if (siblings.length === 3 && (childLeft.parent().hasClass("data2") || childLeft.parent().hasClass("data3"))) {
      // If first item is the one which is left out
      // then replace the data of left out item with data of the group2 or group3
      // Remove group2 or group3 class
      // Add dataItem class so it show ups in preview

      console.log("itemId", itemId);
      let index = 0;
      $.each(siblings, function (i, item) {
        if (siblings.eq(0).attr("id") !== itemId) {
          index = i;
        }
      });

      // if (siblings.eq(0).attr("id") !== itemId) {
      // console.log("hrer1");
      childLeft.parent().closest("div.drag.vertical").removeClass("group2");
      childLeft.parent().closest("div.drag.vertical").removeClass("group3");
      childLeft.parent().closest("div.drag.vertical").addClass("dataItem");
      childLeft.parent().replaceWith(siblings.eq(index).find(".data:first"));
      // } else if (siblings.eq(2).attr("id") !== itemId) {
      //   console.log("hrer2");
      //   childLeft.parent().closest("div.drag.vertical").removeClass("group2");
      //   childLeft.parent().closest("div.drag.vertical").removeClass("group3");
      //   childLeft.parent().closest("div.drag.vertical").addClass("dataItem");
      //   childLeft.parent().replaceWith(siblings.eq(2).find(".data:first"));
      // }
    } else if (siblings.length === 2 && (childLeft.parent().hasClass("data2") || childLeft.parent().hasClass("data3"))) {
      childLeft.parent().closest("div.drag.vertical").remove();
    } else {
      childLeft.remove();
    }
  }

  // function removeExitingItem(itemId) {
  //   // console.log();

  //   let oldItem = $(`#${itemId}`);
  //   let siblings = oldItem.parent().children();

  //   if (siblings.length === 2 && (oldItem.parent().hasClass("data2") || oldItem.parent().hasClass("data3"))) {
  //     oldItem.parent().closest("div.drag.vertical").remove();
  //   } else {
  //     oldItem.remove();
  //   }
  // }

  // function initDraggedItem(draggedItem) {
  //   let container = getNewContainer();
  //   container.draggable({
  //     cancel: false,
  //     helper: function (e) {
  //       return $(this).clone();
  //     },
  //     cursor: "move",
  //     start: function (event, ui) {
  //       $(this).draggable("instance").offset.click = {
  //         left: 0,
  //         top: 0,
  //       };
  //     },
  //   });

  //   // If existing item is dragged for editing then do belwo tasks

  //   if (draggedItem.attr("id")) {
  //     // removeItemWithParent(draggedItem.attr("id"));
  //     removeExitingItem(draggedItem.attr("id"));
  //     container.attr("id", draggedItem.attr("id"));
  //     container.find(".data").replaceWith(draggedItem.find(".data"));
  //     return container;
  //   }

  //   let UUID = `item-${Date.now()}`;
  //   container.attr("id", "container-" + UUID);
  //   let dataDiv = container.find(".data");

  //   if (draggedItem.attr("item") && itemIds.hasOwnProperty(draggedItem.attr("item"))) {
  //     let item = $(itemIds[draggedItem.attr("item")]);
  //     // addModalClick(item);
  //     if (draggedItem.attr("item") === "btnTable") {
  //       let tds = item.find("div.editor-td-div");
  //       tds.each(function (index) {
  //         let UUID2 = `item-${Date.now() + index}`;
  //         $(this).attr("id", "editorTD-" + UUID2);
  //         addDropEvent($(this), true);
  //         addModalClick($(this));
  //         addMouseOverEvents($(this));
  //       });
  //     } else {
  //       item.attr("id", UUID);
  //     }
  //     if (draggedItem.attr("item") === "btnIcon") {
  //       item.attr("src", draggedItem.attr("src"));
  //     }
  //     dataDiv.append(item);
  //     // addModalClick(draggedItem);
  //     return container;
  //   } else if (draggedItem.attr("category") === "image" || draggedItem.attr("category") === "textField") {
  //     // console.log(draggedItem);
  //     let item = draggedItem;
  //     item.attr("id", UUID);
  //     dataDiv.append(item);
  //     return container;
  //   }

  //   // dataDiv.append(draggedItem);
  //   // return container;
  // }

  // function getNewContainer() {
  //   let containerHTML = `<div class="drag vertical ph-table-row dataItem">
  //         <div class="ph-table">
  //           <div class="ph-table-row eowo">
  //             <div class="ph-table-cell west drop we s"></div>
  //             <div class="ph-table-cell">
  //               <div class="ph-table noso">
  //                 <div class="ph-table-row">
  //                   <div class="ph-table-cell north ns drop s"></div>
  //                 </div>
  //                 <div class="ph-table-row">
  //                   <div class="ph-table-cell data"></div>
  //                 </div>
  //                 <div class="ph-table-row">
  //                   <div class="ph-table-cell south ns drop s"></div>
  //                 </div>
  //               </div>
  //             </div>
  //             <div class="ph-table-cell east drop we s"></div>
  //           </div>
  //         </div>
  //       </div>`;

  //   let container = $(containerHTML);

  //   // Mouse events
  //   // addMouseEvents(container.find(".ns"), container.find(".we"));

  //   //Drop events
  //   addDropEvent(container.find(".ns"), true);
  //   addDropEvent(container.find(".we"), true);
  //   addMouseOverEvents(container.find(".data"));
  //   addModalClick(container.find(".data"));

  //   return container;
  // }

  // function addMissingNorthSouth(existingItem) {
  //   let divnoso = existingItem.find("div.noso:first");
  //   let firstChild = existingItem.find("div.noso:first > div > div.north");
  //   let lastChild = existingItem.find("div.noso:first > div > div.south");
  //   // let existingItemNorth = existingItem.find("div.noso:first > div > div.north");
  //   // let existingItemSouth = existingItem.find("div.noso:first > div > div.south");
  //   // console.log(lastChild);
  //   if (!lastChild.length) {
  //     let n = $(`<div class="ph-table-row">
  // 												<div class="ph-table-cell south ns drop s"></div>
  // 												</div>`);
  //     divnoso.append(n);
  //     //Drop events
  //     addDropEvent(n.find("div"), true);
  //     // addMouseEvents(n.find("div"), null);
  //     return existingItem;
  //   } else if (!firstChild.length) {
  //     let n = $(`<div class="ph-table-row">
  // 												<div class="ph-table-cell north ns drop s"></div>
  // 												</div>`);
  //     divnoso.prepend(n);
  //     //Drop events
  //     addDropEvent(n.find("div"), true);
  //     // addMouseEvents(n.find("div"), null);
  //     return existingItem;
  //   } else {
  //     return existingItem;
  //   }
  // }

  // function addMissingEastWest(existingItem) {
  //   let diveowo = existingItem.find("div.eowo:first");
  //   let firstChild = diveowo.children().first();
  //   let lastChild = diveowo.children().last();
  //   // console.log("existingItem++", existingItem);
  //   // console.log("diveowo++", diveowo);
  //   // console.log("firstChild", firstChild);
  //   // console.log("lastChild", lastChild);
  //   // console.log("firstChild", firstChild.hasClass("west"));
  //   // console.log("lastChild", lastChild.hasClass("east"));
  //   if (!firstChild.hasClass("west")) {
  //     let n = $(`<div class="ph-table-cell west drop we s"></div>`);
  //     //Drop events
  //     addDropEvent(n, true);
  //     // addMouseEvents(null, n);

  //     diveowo.prepend(n);
  //     return existingItem;
  //   } else if (!lastChild.hasClass("east")) {
  //     let n = $(`<div class="ph-table-cell east drop we s"></div>`);
  //     //Drop events
  //     addDropEvent(n, true);
  //     // addMouseEvents(null, n);

  //     diveowo.append(n);
  //     return existingItem;
  //   } else {
  //     return existingItem;
  //   }
  // }

  // function getNewContainerNS() {
  //   let containerHTML = `<div class="drag vertical ph-table-cell group3">
  // 							<div class="ph-table">
  // 								<div class="ph-table-row eowo">
  // 									<div class="ph-table-cell west drop we s"></div>
  // 									<div class="ph-table-cell">
  // 										<div class="ph-table noso">
  // 											<div class="ph-table-row">
  // 												<div class="ph-table-cell north ns drop s"></div>
  // 											</div>
  // 											<div class="ph-table-row">
  // 												<div class="data3" category="group">

  // 												</div>
  // 											</div>
  // 											<div class="ph-table-row">
  // 												<div class="ph-table-cell south ns drop s"></div>
  // 											</div>
  // 										</div>
  // 									</div>
  // 									<div class="ph-table-cell east drop we s"></div>
  // 								</div>
  // 							</div>
  // 						</div>`;

  //   let container = $(containerHTML);

  //   // Mouse events
  //   // addMouseEvents(container.find(".ns"), container.find(".we"));

  //   //Drop events
  //   addDropEvent(container.find(".ns"), true);
  //   addDropEvent(container.find(".we"), true);
  //   addMouseOverEvents(container.find(".data3"));
  //   addModalClick(container.find(".data3"));
  //   container.draggable({
  //     cancel: false,
  //     helper: function (e) {
  //       return $(this).clone();
  //     },
  //     cursor: "move",
  //     start: function (event, ui) {
  //       $(this).draggable("instance").offset.click = {
  //         left: 0,
  //         top: 0,
  //       };
  //     },
  //   });
  //   let UUID = `item-${Date.now()}`;
  //   container.attr("id", "container-" + UUID);
  //   return container;
  // }

  // function getNewContainerWE() {
  //   let containerHTML = `<div class="drag vertical ph-table-row group2">
  // 							<div class="ph-table">
  // 								<div class="ph-table-row eowo">
  // 									<div class="ph-table-cell west drop we s"></div>
  // 									<div class="ph-table-cell">
  // 										<div class="ph-table noso">
  // 											<div class="ph-table-row">
  // 												<div class="ph-table-cell north ns drop s"></div>
  // 											</div>
  // 											<div class="ph-table-row">
  // 												<div class="ph-table-cell">
  // 													<div class="data2" category="group">

  // 													</div>
  // 												</div>
  // 											</div>
  // 											<div class="ph-table-row">
  // 												<div class="ph-table-cell south ns drop s"></div>
  // 											</div>
  // 										</div>
  // 									</div>
  // 									<div class="ph-table-cell east drop we s"></div>
  // 								</div>
  // 							</div>
  // 						</div>`;

  //   let container = $(containerHTML);

  //   // Mouse events
  //   // addMouseEvents(container.find(".ns"), container.find(".we"));

  //   //Drop events
  //   addDropEvent(container.find(".ns"), true);
  //   addDropEvent(container.find(".we"), true);
  //   addMouseOverEvents(container.find(".data2"));
  //   addModalClick(container.find(".data2"));
  //   container.draggable({
  //     cancel: false,
  //     helper: function (e) {
  //       return $(this).clone();
  //     },
  //     cursor: "move",
  //     start: function (event, ui) {
  //       $(this).draggable("instance").offset.click = {
  //         left: 0,
  //         top: 0,
  //       };
  //     },
  //   });
  //   let UUID = `item-${Date.now()}`;
  //   container.attr("id", "container-" + UUID);
  //   return container;
  // }

  // Table functions
});

// function getSubItemsForgroup2(item) {
//   let group = $(item).find(".data2:first").children();
//   let tbody = $("<tbody>");
//   let table = $("<table>");
//   let tr = $("<tr>");
//   console.log(group);
//   $.each(group, function (index, value) {
//     let td = $("<td>");
//     console.log($(this));
//     if ($(this).hasClass("dataItem")) {
//       let dataItem = $(this).find(".data").children().eq(0).clone();
//       let vAlign = $(this).find(".data").css("vertical-align");
//       if (vAlign) {
//         td.css("vertical-align", vAlign);
//       }
//       td.append(dataItem);
//     } else if ($(this).hasClass("group2")) {
//       let table = getSubItemsForgroup2($(this));
//       td.append(table);
//     } else if ($(this).hasClass("group3")) {
//       let table = getSubItemsForgroup3($(this));
//       td.append(table);
//     }
//     tr.append(td);
//   });
//   tbody.append(tr);
//   table.append(tbody);
//   return table;
// }

// function getSubItemsForgroup3(item) {
//   let group = $(item).find(".data3:first").children();
//   let tbody = $("<tbody>");
//   let table = $("<table>");
//   console.log(group);
//   $.each(group, function (index, value) {
//     let tr = $("<tr>");
//     let td = $("<td>");
//     console.log($(this));
//     if ($(this).hasClass("dataItem")) {
//       let dataItem = $(this).find(".data").children().eq(0).clone();
//       let vAlign = $(this).find(".data").css("vertical-align");
//       if (vAlign) {
//         td.css("vertical-align", vAlign);
//       }
//       td.append(dataItem);
//     } else if ($(this).hasClass("group2")) {
//       let table = getSubItemsForgroup2($(this));
//       td.append(table);
//     } else if ($(this).hasClass("group3")) {
//       let table = getSubItemsForgroup3($(this));
//       td.append(table);
//     }
//     tr.append(td);
//     tbody.append(tr);
//   });
//   table.append(tbody);
//   return table;
// }
