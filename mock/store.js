const cryptoUtils = require("../routes/utils");
const persistence = require("./persistence");
const { getDefaultStore } = require("./seedData");

let store = null;

function init() {
  store = persistence.load() || getDefaultStore();
  if (!persistence.load()) {
    persist();
  }
}

function persist() {
  persistence.save(store);
}

function getStore() {
  if (!store) init();
  return store;
}

function decryptCompanyId(companyId) {
  return cryptoUtils.decrypt(`${companyId}`);
}

function getSignatures(companyId) {
  const data = getStore();
  const cono = decryptCompanyId(companyId);
  const sigs = data.signatures
    .filter((s) => s.H_CONO === cono)
    .sort((a, b) => a.H_SRL - b.H_SRL)
    .map((s) => ({
      Id: cryptoUtils.encrypt(s.RID),
      Name: s.H_DSC,
      HTML: s.H_RTextHTML || " <div    </div>",
      SigHTML: s.H_HTMLTEXT,
      ImageData: s.H_ATTACH,
      ImageData2: s.H_IMAGE,
      rstart: s.RID.startsWith("R"),
    }));

  const images = data.images
    .filter((img) => sigs.some((s) => cryptoUtils.decrypt(s.Id) === img.PRID))
    .map((img) => ({ ImgPath: img.I_NAME, ImgBase64: img.I_STR }));

  return { recordsets: [sigs, images] };
}

function getCustomFields() {
  const data = getStore();
  return {
    recordsets: [data.customFields.map(({ G_DSC, K_ALIAS }) => ({ G_DSC, K_ALIAS }))],
  };
}

function getCompanyUsersGroups(companyId) {
  const data = getStore();
  const cono = decryptCompanyId(companyId);
  return {
    recordsets: [
      data.groups.filter((g) => g.G_CONO === cono),
      data.users.filter((u) => u.U_CONO === cono),
    ],
  };
}

function getCurrentSignatureUsers(prid) {
  const data = getStore();
  const rid = cryptoUtils.decrypt(prid.replace(/_/g, " "));
  const rows = data.signatureUsers.filter((u) => u.PRID === rid);
  return {
    Included: rows.filter((u) => u.U_TYPE === "0"),
    Excluded: rows.filter((u) => u.U_TYPE === "2"),
  };
}

function getCurrentSigRulesConditions(prid) {
  const data = getStore();
  const rid = cryptoUtils.decrypt(prid);
  const sig = data.signatures.find((s) => s.RID === rid);
  if (!sig) return null;
  return {
    applySig: !!sig.H_INACTIVE,
    addSig_Status: !!sig.H_OADDSUB,
    addSig_Text: sig.H_OADDSUBTEXT || "",
    addSig_RMText: !!sig.H_OADDSUBREM,
    DA_Status: !!sig.H_DADDMSG,
    DA_Text: sig.H_DADDMSGTEXT || "",
    DA_Anywhere: !!sig.H_DADDANY,
    DA_ProcessNext: !!sig.H_DADDPNEXT,
    SigAdded_ProcessNext: !!sig.H_ADDPNEXT,
    DA_RecentEmail: !sig.H_DADDANY,
    DA_DontProcessNext: !sig.H_DADDPNEXT,
    SigAdded_DontProcessNext: !sig.H_ADDPNEXT,
  };
}

function updateSigRulesConditions(body) {
  const data = getStore();
  const rid = cryptoUtils.decrypt(body.prid);
  const sig = data.signatures.find((s) => s.RID === rid);
  if (!sig) return;
  sig.H_INACTIVE = body.applySig ? 1 : 0;
  sig.H_OADDSUB = body.addSig_Status ? 1 : 0;
  sig.H_OADDSUBTEXT = body.addSig_Text || "";
  sig.H_OADDSUBREM = body.addSig_RMText ? 1 : 0;
  sig.H_DADDMSG = body.DA_Status ? 1 : 0;
  sig.H_DADDMSGTEXT = body.DA_Text || "";
  sig.H_DADDANY = body.DA_Anywhere ? 1 : 0;
  sig.H_DADDPNEXT = body.DA_ProcessNext ? 1 : 0;
  sig.H_ADDPNEXT = body.SigAdded_ProcessNext ? 1 : 0;
  persist();
}

function updateCurrentSignatureUsrGrp(prid, items) {
  const data = getStore();
  const rid = cryptoUtils.decrypt(prid);
  data.signatureUsers = data.signatureUsers.filter((u) => u.PRID !== rid);
  for (const item of items) {
    data.signatureUsers.push({
      PRID: rid,
      U_CD: item.ucd,
      U_RTYPE: item.utype + item.ugrp,
      U_EMAIL: item.uemail,
      U_TYPE: item.utype,
      U_GRP: item.ugrp,
    });
  }
  persist();
}

function getSignatureById(id) {
  const data = getStore();
  const rid = cryptoUtils.decrypt(id);
  const sig = data.signatures.find((s) => s.RID === rid);
  if (!sig) return { recordset: [] };
  return {
    recordset: [
      {
        Id: sig.RID,
        Name: sig.H_DSC,
        HTML: sig.H_RTextHTML,
        SigHTML: sig.H_HTMLTEXT,
        ImageData: sig.H_IMAGE,
      },
    ],
  };
}

function saveHTML(data) {
  const storeData = getStore();
  const rid = `R${storeData.nextSigNum}`;
  storeData.nextSigNum += 1;
  storeData.signatures.push({
    RID: rid,
    H_CCD: "001",
    H_CD: storeData.nextSigNum - 1,
    H_DSC: data.name,
    H_RTextHTML: data.html,
    H_HTMLTEXT: data.signatureHTML,
    H_CONO: cryptoUtils.decrypt(data.compNo),
    H_IMAGE: data.imgData || "",
    H_ATTACH: null,
    H_NEW: 1,
    H_SRL: storeData.signatures.length + 1,
    H_INACTIVE: 0,
    H_OADDSUB: 0,
    H_OADDSUBTEXT: "",
    H_OADDSUBREM: 0,
    H_DADDMSG: 0,
    H_DADDMSGTEXT: "",
    H_DADDANY: 0,
    H_DADDPNEXT: 0,
    H_ADDPNEXT: 0,
  });
  persist();
}

function updateHTML(data) {
  const storeData = getStore();
  const rid = cryptoUtils.decrypt(data.id);
  const sig = storeData.signatures.find((s) => s.RID === rid);
  if (!sig) return;
  sig.H_HTMLTEXT = data.signatureHTML;
  sig.H_RTextHTML = data.html;
  sig.H_DSC = data.name;
  sig.H_IMAGE = data.imgData || "";
  persist();
}

function deleteSignature(ridEnc) {
  const storeData = getStore();
  const rid = cryptoUtils.decrypt(ridEnc.replace(/_/g, ""));
  storeData.signatures = storeData.signatures.filter((s) => s.RID !== rid);
  storeData.signatureUsers = storeData.signatureUsers.filter((u) => u.PRID !== rid);
  storeData.images = storeData.images.filter((i) => i.PRID !== rid);
  persist();
}

function updateOrder(newOrder) {
  const storeData = getStore();
  newOrder.forEach((rid, index) => {
    const sig = storeData.signatures.find((s) => s.RID === rid);
    if (sig) sig.H_SRL = index + 1;
  });
  persist();
}

function loginuser(companyId) {
  const storeData = getStore();
  const decryptId = parseInt(decryptCompanyId(companyId), 10);
  const userData = storeData.companies.find((c) => c.C_CD === decryptId);
  if (!userData) return null;
  return {
    First_Name: userData.C_FNAME,
    Last_Name: userData.C_LNAME,
    Name: `${userData.C_FNAME} ${userData.C_LNAME}`,
    Company: userData.C_NAME,
    telephoneNumber: userData.C_TEL,
    StreetAddress: userData.C_ADD1,
    City: userData.C_TOWN,
    State: userData.C_STATE,
    PostalCode: userData.C_ZIP,
    E_Mail: userData.C_USRCD,
    Mobile_No: userData.C_MOBILEKEY,
  };
}

function companyuserSearch(companyId, query) {
  const storeData = getStore();
  const cono = decryptCompanyId(companyId);
  return storeData.users
    .filter((u) => u.U_CONO === cono && u.U_EMAIL.includes(query))
    .map((u) => u.U_EMAIL);
}

function companyuserByEmail(email) {
  const storeData = getStore();
  const details = storeData.userDetails[email] || {};
  return Object.entries(details).reduce((acc, [key, val]) => {
    acc[key.replace(/ /g, "_").replace(/-/g, "_").replace(/\./g, "")] = val;
    return acc;
  }, {});
}

module.exports = {
  getSignatures,
  getCustomFields,
  getCompanyUsersGroups,
  getCurrentSignatureUsers,
  getCurrentSigRulesConditions,
  updateSigRulesConditions,
  updateCurrentSignatureUsrGrp,
  getSignatureById,
  saveHTML,
  updateHTML,
  deleteSignature,
  updateOrder,
  loginuser,
  companyuserSearch,
  companyuserByEmail,
};
