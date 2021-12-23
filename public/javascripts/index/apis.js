async function getCurrentSignatureUsers(signatureId) {
  try {
    let URL = `${SERVER_URL}/getCurrentSignatureUsers?prid=${signatureId}`;
    // console.log(URL);
    let signatureUserGroups = await fetch(URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await signatureUserGroups.json();

    return data;
  } catch (e) {
    console.log(e);
  }
}

async function getCurrentSigRulesConditions(signatureId) {
  try {
    let URL = `${SERVER_URL}/getCurrentSigRulesConditions?prid=${signatureId}`;
    // console.log(URL);
    let signatureUserGroups = await fetch(URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await signatureUserGroups.json();

    return data;
  } catch (e) {
    console.log(e);
  }
}

async function updateSigRulesConditions(body) {
  try {
    Swal.fire({
      onBeforeOpen: () => {
        Swal.showLoading();
      },
      iconHtml: `<img src="/images/favicon.png" height="45" alt="" />`,
      title: "Saving rules and conditions",
      showConfirmButton: false,
      // timer: 1500,
    });
    let URL = `${SERVER_URL}/updateSigRulesConditions`;
    let apiCall = await fetch(URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await apiCall.json();
    Swal.close();
    Swal.fire({
      // position: "top-end",
      icon: "success",
      title: "Rules and Conditions has been saved",
      showConfirmButton: false,
      timer: 1500,
    });

    return data;
  } catch (e) {
    console.log(e);
    Swal.close();
    Swal.fire({
      // position: "top-end",
      icon: "error",
      title: "Fail to save Rules and Conditions",
      showConfirmButton: false,
      timer: 1500,
    });
  }
}

async function updateCurrentSignatureUsrGrp(body) {
  try {
    Swal.fire({
      onBeforeOpen: () => {
        Swal.showLoading();
      },
      iconHtml: `<img src="/images/favicon.png" height="45" alt="" />`,
      title: "Saving users and groups",
      showConfirmButton: false,
      // timer: 1500,
    });
    let URL = `${SERVER_URL}/updateCurrentSignatureUsrGrp`;
    let apiCall = await fetch(URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await apiCall.json();
    Swal.close();
    Swal.fire({
      // position: "top-end",
      icon: "success",
      title: "Users and groups has been saved",
      showConfirmButton: false,
      timer: 1500,
    });

    return data;
  } catch (e) {
    console.log(e);
    Swal.close();
    Swal.fire({
      // position: "top-end",
      icon: "error",
      title: "Fail to save Users and groups",
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
