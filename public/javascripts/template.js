$(document).ready(function () {
  // $(".test1").jqte();
  Swal.fire({
    onBeforeOpen: () => {
      Swal.showLoading();
    },
    iconHtml: `<img src="/images/favicon.png" height="45" alt="" />`,
    title: "Templates are loading",
    showConfirmButton: false,
  });

  /**
   * Set reorder url
   */
  // $("#reorderBtn").attr("href", `reorder.html?companyId=${companyId}`);
  // $("#newSigBtn").attr("href", `editor.html?companyId=${companyId}`);

  /**
   * Get signature list
   */
  (async () => {
    // console.log(c);

    let companyId = "pMr0lShPukk=";
    if (!companyId) {
      Swal.fire({
        // position: "top-end",
        icon: "info",
        title: "Templates not available.",
        showConfirmButton: true,
      });
      return;
    }
    const rawResponse = await fetch(`${SERVER_URL}/getSignatures?companyId=${companyId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const content = await rawResponse.json();
    const signatureData = content.recordsets[0];
    const imageData = content.recordsets[1];

    if (signatureData.length === 0) {
      Swal.fire({
        // position: "top-end",
        icon: "info",
        title: "Templates not available.",
        showConfirmButton: true,
      });
      return;
    }

    for (const signature of signatureData) {
      await createSigForTemplate(signature, imageData);
    }

    setTimeout(function () {
      $("#ssDiv").html("");

      Swal.close();
    }, 3000);
  })();
});
