var express = require("express");
var router = express.Router();
var path = require("path");
var sql = require("mssql");
var formidable = require("formidable");

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
  connectionTimeout: 60000,
  requestTimeout: 60000,
};

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/saveHTML", function (req, res, next) {
  const dbData = {};
  var form = new formidable.IncomingForm();
  form
    .parse(req)
    .on("field", function (name, field) {
      // console.log("Got a field:", field);
      console.log("Got a field name:", name);
      dbData[name] = field;
    })
    .on("error", function (err) {
      res.send({ success: false, error: err });
    })
    .on("end", function () {
      sql.connect(config, function (err) {
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        var queryText = `
        BEGIN
        DECLARE @variable nvarchar(4);
        DECLARE @rid nvarchar(4);
        SET @variable = (SELECT max(h_cd) + 1 from [dbo].[ADHTMLH]); 
        SET @rid = 'R' + @variable;
        INSERT INTO [dbo].[ADHTMLH]
          ([RID]
          ,[H_CCD]
          ,[H_CD]
          ,[H_DSC]
          ,[H_RTextHTML]
          ,[H_HTMLTEXT]
          ,[H_CONO]
          ,[H_IMAGE]
          ,[H_NEW])
      VALUES
          (@rid
          ,'001'
          ,@variable
          ,'${dbData.name}'
          ,'${dbData.html}'
          ,'${dbData.signatureHTML}'
          ,'${dbData.compNo}'
          ,'${dbData.imgData}'
          ,1);
          END;`;

        // console.log(queryText);
        // query to the database and get the records
        request.query(queryText, function (err, recordset) {
          if (err) console.log(err);

          // send records as a response
          res.send(recordset);
        });
      });
    });
  // connect to your database
  //   sql.connect(config, function (err) {
  //     if (err) console.log(err);

  //     // create Request object
  //     var request = new sql.Request();

  //     var queryText = `INSERT INTO [dbo].[ADHTMLH]
  //     ([RID]
  //     ,[H_CCD]
  //     ,[H_CD]
  //     ,[H_DSC]
  //     ,[H_RTextHTML]
  //     ,[H_HTMLTEXT]
  //     ,[H_CONO]
  //     ,[H_IMAGE])
  // VALUES
  //     ('939   ${Math.floor(Math.random() * 10000000000)}'
  //     ,'939'
  //     ,'939'
  //     ,'${req.body.name}'
  //     ,'${req.body.signatureHTML}'
  //     ,'${req.body.html}'
  //     ,'${req.body.compNo}'
  //     ,'${req.body.imgData}')`;

  //     // var queryText = `INSERT INTO [dbo].[signatures]
  //     //          ([HTML]
  //     //          ,[SigHTML]
  //     //          ,[Name]
  //     //          ,[ImageData])
  //     //    VALUES
  //     //          ('${req.body.html}'
  //     //          , '${req.body.signatureHTML}'
  //     //          , '${req.body.name}'
  //     //          , '${req.body.imgData}')`;

  //     // query to the database and get the records
  //     request.query(queryText, function (err, recordset) {
  //       if (err) console.log(err);

  //       // send records as a response
  //       res.send(recordset);
  //     });
  //   });
});

router.post("/deleteSignature", function (req, res, next) {
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    /* var queryText = `
        EXEC USP_DELETE_ADHTMLH '${req.body.rid.replace(/_/g, " ")}';
        DELETE FROM [dbo].[ADHTMLU] WHERE PRID = '${req.body.rid.replace(/_/g, " ")}';
        DELETE FROM [dbo].[ADHTMLH] WHERE RID = '${req.body.rid.replace(/_/g, " ")}';
        EXEC USP_DELETE_ADEMAILSIGN '${req.body.rid.replace(/_/g, " ")}';`; */

    console.log(queryText);
    var queryText = `
        EXEC USP_DELETE_ADHTMLH '${req.body.rid.replace(/_/g, " ")}'`;

    // console.log(queryText);
    // query to the database and get the records
    request.query(queryText, function (err, recordset) {
      if (err) console.log(err);

      // send records as a response
      res.send(recordset);
    });
  });
});

router.post("/updateHTML", function (req, res, next) {
  const dbData = {};
  var form = new formidable.IncomingForm();
  form
    .parse(req)
    .on("field", function (name, field) {
      // console.log("Got a field:", field);
      console.log("Got a field name:", name);
      dbData[name] = field;
    })
    .on("error", function (err) {
      res.send({ success: false, error: err });
    })
    .on("end", function () {
      sql.connect(config, function (err) {
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        var queryText = `UPDATE [dbo].[ADHTMLH]
            SET [H_HTMLTEXT] = '${dbData.signatureHTML}'
                ,[H_RTextHTML] = '${dbData.html}'
                ,[H_DSC] = '${dbData.name}'
                ,[H_IMAGE] = '${dbData.imgData}'
          WHERE [dbo].[ADHTMLH].[RID] = '${dbData.id}';
          EXEC USP_DELETE_ADEMAILSIGN '${dbData.id}';`;

        // query to the database and get the records
        request.query(queryText, function (err, recordset) {
          if (err) console.log(err);

          // send records as a response
          res.send(recordset);
        });
      });
    });

  // console.log(req.body);
  // // connect to your database
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
      ISNULL( H_RTextHTML, ' <div    </div>' ) AS HTML,
      H_HTMLTEXT AS SigHTML,
      H_ATTACH AS ImageData,
      H_IMAGE AS ImageData2
      FROM ADHTMLH
      WHERE H_CONO = '${req.query.companyId}'
      ORDER BY H_SRL;
      
      SELECT 
        DISTINCT I_NAME AS ImgPath, I_STR AS ImgBase64  FROM ADHTMLIMG  
        INNER JOIN ADHTMLH ON ADHTMLH.RID = ADHTMLIMG.PRID
        WHERE H_CONO = '${req.query.companyId}';`;

    // select * from ADHTMLIMG  where prid = '583           75'
    // log form raju 21/02/2022
    // console.log(queryText);

    // query to the database and get the records
    request.query(queryText, function (err, recordset) {
      if (err) console.log(err);

      // send records as a response
      res.send(recordset);
    });
  });
});

router.get("/getCustomFields", function (req, res, next) {
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();
    var queryText = `SELECT 
    G_DSC, 
    K_ALIAS  
    FROM adkey 
    INNER JOIN ADGRP ON  G_CD = K_GCD
    ORDER BY G_CD;`;

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

    var queryText = `SELECT * FROM ADHTMLU WHERE PRID = '${prid}' AND U_TYPE = '0';
    SELECT * FROM ADHTMLU WHERE PRID = '${prid}' AND U_TYPE = '2'`;

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

router.get("/getCurrentSigRulesConditions", function (req, res, next) {
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    // console.log("rid", req.query);
    let rid = req.query.prid.replace(/_/g, " ");

    // const resp = {
    //   applySig: false,
    //   addSig_Status: true,
    //   addSig_Text: "Text",
    //   addSig_RMText: true,
    //   DA_Status: true,
    //   DA_Text: "Subjec text",
    //   DA_Anywhere: false,
    //   DA_RecentEmail: true,
    //   DA_ProcessNext: true,
    //   DA_DontProcessNext: false,
    //   SigAdded_ProcessNext: true,
    //   SigAdded_DontProcessNext: false,
    // };

    //     H_INACTIVE
    // ALTER TABLE ADHTMLH  ADD H_OADDSUB BIT
    // ALTER TABLE ADHTMLH  ADD H_OADDSUBTEXT NVARCHAR(100)
    // ALTER TABLE ADHTMLH  ADD H_OADDSUBREM BIT
    // ALTER TABLE ADHTMLH  ADD H_DADDMSG BIT
    // ALTER TABLE ADHTMLH  ADD H_DADDMSGTEXT NVARCHAR(100)
    // ALTER TABLE ADHTMLH  ADD H_DADDANY BIT
    // ALTER TABLE ADHTMLH  ADD H_DADDPNEXT BIT
    // ALTER TABLE ADHTMLH  ADD H_ADDPNEXT BIT

    // CASE WHEN EntityProfile IS NULL THEN 'False' ELSE 'True' END
    var queryText = `SELECT 
      H_INACTIVE AS applySig,
      CASE WHEN H_OADDSUB IS NULL OR H_OADDSUB = 0 THEN CAST(0 as bit) ELSE CAST(1 as bit) END AS addSig_Status,
      H_OADDSUBTEXT AS addSig_Text,
      CASE WHEN H_OADDSUBREM IS NULL OR H_OADDSUBREM = 0 THEN CAST(0 as bit) ELSE CAST(1 as bit) END AS addSig_RMText,
      CASE WHEN H_DADDMSG IS NULL OR H_DADDMSG = 0 THEN CAST(0 as bit) ELSE CAST(1 as bit) END AS DA_Status,
      H_DADDMSGTEXT AS DA_Text,
      CASE WHEN H_DADDANY IS NULL OR H_DADDANY = 0 THEN CAST(0 as bit) ELSE CAST(1 as bit) END AS DA_Anywhere,
      CASE WHEN H_DADDPNEXT IS NULL OR H_DADDPNEXT = 0 THEN CAST(0 as bit) ELSE CAST(1 as bit) END AS DA_ProcessNext,
      CASE WHEN H_ADDPNEXT IS NULL OR H_ADDPNEXT = 0 THEN CAST(0 as bit) ELSE CAST(1 as bit) END AS SigAdded_ProcessNext
      FROM ADHTMLH WHERE RID = '${rid}';`;

    // query to the database and get the records
    request.query(queryText, function (err, data) {
      if (err) console.log(err);

      console.log("rid", rid);
      console.log("Before", data.recordset[0]);
      const resp = {
        ...data.recordset[0],
        DA_RecentEmail: !data.recordset[0].DA_Anywhere,
        DA_DontProcessNext: !data.recordset[0].DA_ProcessNext,
        SigAdded_DontProcessNext: !data.recordset[0].SigAdded_ProcessNext,
      };

      console.log("After", resp);
      res.send(resp);
    });
  });
});

router.post("/updateSigRulesConditions", function (req, res, next) {
  console.log(req.body);
  // connect to your database
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    const body = req.body;
    let rid = body.prid.replace(/_/g, " ");

    var queryText = `UPDATE ADHTMLH
      SET H_INACTIVE = ${body.applySig ? 1 : 0},
      H_OADDSUB = ${body.addSig_Status ? 1 : 0},
      H_OADDSUBTEXT = '${body.addSig_Text ? body.addSig_Text : ""}',
      H_OADDSUBREM = '${body.addSig_RMText ? 1 : 0}',
      H_DADDMSG = ${body.DA_Status ? 1 : 0},
      H_DADDMSGTEXT = '${body.DA_Text ? body.DA_Text : ""}',
      H_DADDANY = ${body.DA_Anywhere ? 1 : 0},
      H_DADDPNEXT= ${body.DA_ProcessNext ? 1 : 0},
      H_ADDPNEXT = ${body.SigAdded_ProcessNext ? 1 : 0}
      WHERE RID = '${rid}';`;

    console.log(queryText);

    // query to the database and get the records
    request.query(queryText, function (err, recordset) {
      if (err) console.log(err);

      // send records as a response
      console.log(recordset);
      res.send(recordset);
    });
  });
});

router.post("/updateCurrentSignatureUsrGrp", function (req, res, next) {
  console.log("Body", req.body);
  // connect to your database
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    var queryText = `
    DELETE FROM ADHTMLU WHERE PRID = '${req.body.prid.replace(/_/g, " ")}';`;
    if (req.body.items.length)
      queryText += `INSERT INTO [dbo].[ADHTMLU]
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
           })};
    EXEC USP_INSERT_ADHTMLC '${req.body.prid.replace(/_/g, " ")}';`;

    // (<PRID, varchar(16),>
    // ,<U_CD, nvarchar(200),>
    // ,<U_RTYPE, varchar(2),>
    // ,<U_EMAIL, varchar(100),>
    // ,<U_TYPE, varchar(1),>
    // ,<U_GRP, varchar(1),>)

    console.log(queryText);

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

    var queryText = `SELECT
      RID AS Id,
      H_DSC AS Name,
      H_RTextHTML AS HTML,
      H_HTMLTEXT AS SigHTML,
      H_IMAGE AS ImageData
      FROM ADHTMLH
      WHERE RID = '${req.query.id}';`;

    // var queryText =
    //   `SELECT [Id]
    //         ,[HTML]
    //         ,[SigHTML]
    //         ,[Name]
    //         ,[ImageData]
    //     FROM [dbo].[signatures] WHERE [dbo].[signatures].[Id] = ` + req.query.id;

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
      queryText += `UPDATE ADHTMLH  SET H_SRL = ${i + 1} WHERE RID = '${newOrder[i]}';`;
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
