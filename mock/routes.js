var express = require("express");
var router = express.Router();
var formidable = require("formidable");
const multer = require("multer");
const cryptoUtils = require("../routes/utils");
const store = require("./store");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});

router.post("/saveHTML", function (req, res) {
  const dbData = {};
  new formidable.IncomingForm()
    .parse(req)
    .on("field", (name, field) => {
      dbData[name] = field;
    })
    .on("error", (err) => res.send({ success: false, error: err }))
    .on("end", () => {
      store.saveHTML(dbData);
      res.send({});
    });
});

router.post("/deleteSignature", function (req, res) {
  store.deleteSignature(req.body.rid);
  res.send({});
});

router.post("/updateHTML", function (req, res) {
  const dbData = {};
  new formidable.IncomingForm()
    .parse(req)
    .on("field", (name, field) => {
      dbData[name] = field;
    })
    .on("error", (err) => res.send({ success: false, error: err }))
    .on("end", () => {
      store.updateHTML(dbData);
      res.send({});
    });
});

router.get("/getSignatures", function (req, res) {
  res.send(store.getSignatures(req.query.companyId));
});

router.get("/getCustomFields", function (req, res) {
  res.send(store.getCustomFields());
});

router.get("/getCompanyUsersGroups", function (req, res) {
  res.send(store.getCompanyUsersGroups(req.query.companyId));
});

router.get("/getCurrentSignatureUsers", function (req, res) {
  res.send(store.getCurrentSignatureUsers(req.query.prid));
});

router.get("/getCurrentSigRulesConditions", function (req, res) {
  const data = store.getCurrentSigRulesConditions(req.query.prid);
  res.send(data || {});
});

router.post("/updateSigRulesConditions", function (req, res) {
  store.updateSigRulesConditions(req.body);
  res.send({});
});

router.post("/updateCurrentSignatureUsrGrp", function (req, res) {
  store.updateCurrentSignatureUsrGrp(req.body.prid, req.body.items || []);
  res.send({});
});

router.get("/getSignatureById", function (req, res) {
  res.send(store.getSignatureById(req.query.id));
});

router.post("/updateOrder", function (req, res) {
  store.updateOrder(req.body.newOrder || []);
  res.send({});
});

router.get("/exportsignature", function (req, res) {
  const data = store.getSignatureById(req.query.id);
  if (!data.recordset.length) return res.status(404).send("Signature not found");
  const sig = data.recordset[0];
  const signatureObject = {
    Id: cryptoUtils.encrypt(sig.Id),
    Name: sig.Name,
    HTML: sig.HTML,
    SigHTML: sig.SigHTML,
    ImageData: sig.ImageData,
  };
  const encryptedData = cryptoUtils.encryptFile(JSON.stringify(signatureObject));
  res.setHeader("Content-Disposition", `attachment; filename=${sig.Name}.GSign`);
  res.setHeader("Content-Type", "application/octet-stream");
  res.send(encryptedData);
});

router.post("/uploadAndDecrypt", upload.single("file"), function (req, res) {
  if (!req.file) return res.status(400).send("No file uploaded.");
  const decryptedText = cryptoUtils.decryptFile(req.file.buffer).toString();
  const extractedData = JSON.parse(decryptedText);
  store.saveHTML({
    name: req.body.signatureName,
    html: extractedData.HTML,
    signatureHTML: extractedData.SigHTML,
    compNo: req.body.companyId,
    imgData: extractedData.ImageData,
  });
  res.send({ success: true, message: "Data saved successfully" });
});

router.get("/loginuser", (req, res) => {
  const data = store.loginuser(req.query.companyId);
  if (!data) return res.status(500).send("Internal Server Error");
  res.json(data);
});

router.get("/companyuser", (req, res) => {
  if (!req.query.query) return res.status(400).send("Bad Request: Search query is missing");
  res.json(store.companyuserSearch(req.query.companyId, req.query.query));
});

router.get("/companyuser/:email", (req, res) => {
  res.json(store.companyuserByEmail(req.params.email));
});

module.exports = router;
