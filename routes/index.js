var express = require("express");
var router = express.Router();
var path = require("path");
var sql = require("mssql");

// config for your database
// var config = {
//   user: "sa",
//   password: "qwerty1234",
//   server: "localhost",
//   database: "greenSignature",
//   port: 1433,
// };
var config = {
  user: "sa",
  password: "asncadmin",
  server: "20.196.3.43",
  database: "JAVAD",
  port: 1433,
};

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/saveHTML", function (req, res, next) {
  // connect to your database
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    var queryText = `INSERT INTO [dbo].[signatures]
             ([HTML]
             ,[SigHTML]
             ,[Name]
             ,[ImageData])
       VALUES
             ('${req.body.html}'
             , '${req.body.signatureHTML}'
             , '${req.body.name}'
             , '${req.body.imgData}')`;

    // query to the database and get the records
    request.query(queryText, function (err, recordset) {
      if (err) console.log(err);

      // send records as a response
      res.send(recordset);
    });
  });
});

router.post("/updateHTML", function (req, res, next) {
  // connect to your database
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    var queryText =
      `UPDATE [dbo].[signatures]
        SET [HTML] = '${req.body.html}'
            ,[SigHTML] = '${req.body.signatureHTML}'
            ,[Name] = '${req.body.name}'
            ,[ImageData] = '${req.body.imgData}'
      WHERE [dbo].[signatures].[Id] = ` + req.body.id;

    // query to the database and get the records
    request.query(queryText, function (err, recordset) {
      if (err) console.log(err);

      // send records as a response
      res.send(recordset);
    });
  });
});

router.get("/getSignatures", function (req, res, next) {
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    // var queryText = `SELECT [Id]
    //         ,[HTML]
    //         ,[SigHTML]
    //         ,[Name] as
    //         ,[ImageData]
    //     FROM [dbo].[signatures]
    //     ORDER BY SigOrder`;

    var queryText = `SELECT
      RID AS Id,
      H_DSC AS Name,
      H_RTextHTML AS SigHTML,
      H_HTMLTEXT AS HTML,
      H_ATTACH AS ImageData
      FROM ADHTMLH
      WHERE H_CONO = '${req.query.companyId}'`;

    // query to the database and get the records
    request.query(queryText, function (err, recordset) {
      if (err) console.log(err);

      // send records as a response
      res.send(recordset);
    });
  });
});

router.get("/getCompanyUsersGroups", function (req, res, next) {
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    var queryText = `SELECT RID, G_DSC, G_EMAIL  FROM ADGRP365 WHERE G_CONO = '${req.query.companyId}';
    SELECT TOP 10000 RID, U_DSC, U_EMAIL FROM ADUSR  WHERE U_CONO = '${req.query.companyId}'`;

    // query to the database and get the records
    request.query(queryText, function (err, recordset) {
      if (err) console.log(err);

      // send records as a response
      res.send(recordset);
    });
  });
});

router.get("/getCurrentSignatureUsers", function (req, res, next) {
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    let prid = req.query.prid.replace(/_/g, " ");

    var queryText = `SELECT * FROM ADHTMLU_TEST WHERE PRID = '${prid}' AND U_TYPE = '0';
    SELECT * FROM ADHTMLU_TEST WHERE PRID = '${prid}' AND U_TYPE = '2'`;

    // query to the database and get the records
    request.query(queryText, function (err, data) {
      if (err) console.log(err);

      const resp = {
        Included: data ? data.recordsets[0] : [],
        Excluded: data ? data.recordsets[1] : [],
      };

      // send records as a response
      res.send(resp);
    });
  });
});

router.post("/updateCurrentSignatureUsrGrp", function (req, res, next) {
  // console.log(req.body);
  // connect to your database
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    var queryText = `
    DELETE FROM ADHTMLU_TEST WHERE PRID = '${req.body.prid.replace(/_/g, " ")}';
    INSERT INTO [dbo].[ADHTMLU_TEST]
           ([PRID]
           ,[U_CD]
           ,[U_RTYPE]
           ,[U_EMAIL]
           ,[U_TYPE]
           ,[U_GRP])
     VALUES
           ${req.body.items.map((item) => {
             return `('${req.body.prid.replace(/_/g, " ")}'
              ,'${item.ucd}'
              ,'${item.utype + item.ugrp}'
              ,'${item.uemail}'
              ,'${item.utype}'
              ,'${item.ugrp}')`;
           })}`;

    // (<PRID, varchar(16),>
    // ,<U_CD, nvarchar(200),>
    // ,<U_RTYPE, varchar(2),>
    // ,<U_EMAIL, varchar(100),>
    // ,<U_TYPE, varchar(1),>
    // ,<U_GRP, varchar(1),>)

    // console.log(queryText);

    // query to the database and get the records
    request.query(queryText, function (err, recordset) {
      if (err) console.log(err);

      // send records as a response
      res.send(recordset);
    });
  });
});

router.get("/getSignatureById", function (req, res, next) {
  // connect to your database
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();
    console.log(req.query);

    var queryText =
      `SELECT [Id]
            ,[HTML]
            ,[SigHTML]
            ,[Name]
            ,[ImageData]
        FROM [dbo].[signatures] WHERE [dbo].[signatures].[Id] = ` + req.query.id;

    // query to the database and get the records
    request.query(queryText, function (err, recordset) {
      if (err) console.log(err);

      // send records as a response
      res.send(recordset);
    });
  });
});

router.post("/updateOrder", function (req, res, next) {
  // connect to your database
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    let newOrder = req.body.newOrder;
    var queryText = "";

    for (let i = 0; i < newOrder.length; i++) {
      queryText +=
        `UPDATE [dbo].[signatures]
          SET [SigOrder] = '${i + 1}'
        WHERE [dbo].[signatures].[Id] = ` + newOrder[i];
    }

    // query to the database and get the records
    request.query(queryText, function (err, recordset) {
      if (err) console.log(err);

      // send records as a response
      res.send(recordset);
    });
  });
});

module.exports = router;
