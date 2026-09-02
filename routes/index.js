var express = require("express");
var router = express.Router();
var path = require("path");
var sql = require("mssql");
var formidable = require("formidable");
const multer = require("multer");
const cryptoUtils = require("./utils");
require("dotenv").config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { USER_NAME, DB_PASSWORD, DB_SERVER, DB_DBNAME } = process.env;
var config = {
  user: USER_NAME,
  password: DB_PASSWORD,
  server: DB_SERVER,
  database: DB_DBNAME,
  port: 1433,
  connectionTimeout: 60000,
  requestTimeout: 60000,
  options: {
    enableArithAbort: true,
    encrypt: false,
    trustServerCertificate: true,
  },
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
          ,'${cryptoUtils.decrypt(dbData.compNo)}'
          ,'${dbData.imgData}'
          ,1);
          END;`;
        request.query(queryText, function (err, recordset) {
          if (err) console.log(err);
          res.send(recordset);
        });
      });
    });
});

router.post("/deleteSignature", function (req, res, next) {
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();
    let rid = cryptoUtils.decrypt(req.body.rid.replace(/_/g, ""));

    var queryText = `
        EXEC USP_DELETE_ADHTMLH '${rid}'`;

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
          WHERE [dbo].[ADHTMLH].[RID] = '${cryptoUtils.decrypt(dbData.id)}';
          EXEC USP_DELETE_ADEMAILSIGN '${dbData.id}';`;

        // query to the database and get the records
        request.query(queryText, function (err, recordset) {
          if (err) console.log(err);

          // send records as a response
          res.send(recordset);
        });
      });
    });
});

router.get("/getSignatures", function (req, res, next) {
  const decryptId = cryptoUtils.decrypt(`${req.query.companyId}`);
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    var queryText = `SELECT
      RID AS Id,
      H_DSC AS Name,
      ISNULL( H_RTextHTML, ' <div    </div>' ) AS HTML,
      H_HTMLTEXT AS SigHTML,
      H_ATTACH AS ImageData,
      H_IMAGE AS ImageData2
      FROM ADHTMLH
      WHERE H_CONO = '${decryptId}'
      ORDER BY H_SRL;
      
      SELECT 
        DISTINCT I_NAME AS ImgPath, I_STR AS ImgBase64  FROM ADHTMLIMG  
        INNER JOIN ADHTMLH ON ADHTMLH.RID = ADHTMLIMG.PRID
        WHERE H_CONO = '${decryptId}';`;

    // query to the database and get the records
    request.query(queryText, function (err, recordset) {
      if (err) console.log(err);
      else {
        let dbId = recordset.recordsets[0];
        for (let i = 0; i < dbId.length; i++) {
          dbId[i]["rstart"] = dbId[i].Id.startsWith("R");
          var encryptdbIds = cryptoUtils.encrypt(dbId[i].Id);
          dbId[i].Id = encryptdbIds;
        }
      }
      // send records as a response
      res.send(recordset);
    });
  });
});

router.get("/getCustomFields", function (req, res, next) {
  sql.connect(config, function (err) {
    if (err) {
      console.error("Error connecting to SQL Server:", err);
      return res.status(500).send("Internal Server Error");
    }

    // create Request object
    var request = new sql.Request();
    var queryText = `SELECT 
    G_DSC, 
    K_ALIAS  
    FROM adkey 
    INNER JOIN ADGRP ON  G_CD = K_GCD
    ORDER BY G_CD;`;

    // query the database and get the records
    request.query(queryText, function (err, recordset) {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).send("Internal Server Error");
      }

      // send records as a response
      res.send(recordset);
    });
  });
});

router.get("/getCompanyUsersGroups", function (req, res, next) {
  const decryptId = cryptoUtils.decrypt(`${req.query.companyId}`);
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    var queryText = `SELECT RID, G_DSC, G_EMAIL  FROM ADGRP365 WHERE G_CONO = '${decryptId}';
    SELECT TOP 10000 RID, U_DSC, U_EMAIL FROM ADUSR  WHERE U_CONO = '${decryptId}'`;

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

    let prid = cryptoUtils.decrypt(req.query.prid.replace(/_/g, " "));
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
    let rid = cryptoUtils.decrypt(req.query.prid);
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

      const resp = {
        ...data.recordset[0],
        DA_RecentEmail: !data.recordset[0].DA_Anywhere,
        DA_DontProcessNext: !data.recordset[0].DA_ProcessNext,
        SigAdded_DontProcessNext: !data.recordset[0].SigAdded_ProcessNext,
      };

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
    let rid = cryptoUtils.decrypt(body.prid);

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
  let rid = cryptoUtils.decrypt(req.body.prid);
  // connect to your database
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();
    var queryText = `
    DELETE FROM ADHTMLU WHERE PRID = '${rid}';`;
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
             return `('${rid}'
              ,'${item.ucd}'
              ,'${item.utype + item.ugrp}'
              ,'${item.uemail}'
              ,'${item.utype}'
              ,'${item.ugrp}')`;
           })};
    EXEC USP_INSERT_ADHTMLC '${rid}';`;

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
    var decryptId = cryptoUtils.decrypt(req.query.id);

    var queryText = `SELECT
      RID AS Id,
      H_DSC AS Name,
      H_RTextHTML AS HTML,
      H_HTMLTEXT AS SigHTML,
      H_IMAGE AS ImageData
      FROM ADHTMLH
      WHERE RID = '${decryptId}';`;
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

router.get("/exportsignature", function (req, res, next) {
  sql.connect(config, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send("Database connection error");
    }
    var request = new sql.Request();
    var decryptId = cryptoUtils.decrypt(req.query.id);
    var queryText = `SELECT
      RID AS Id,
      H_DSC AS Name,
      H_RTextHTML AS HTML,
      H_HTMLTEXT AS SigHTML,
      H_IMAGE AS ImageData
      FROM ADHTMLH
      WHERE RID = '${decryptId}';`;
    request.query(queryText, function (err, recordset) {
      if (err) {
        console.log(err);
        return res.status(500).send("Error querying the database");
      }
      if (recordset.recordset.length === 0) {
        return res.status(404).send("Signature not found");
      }
      const signatureObject = {
        Id: cryptoUtils.encrypt(recordset.recordset[0].Id),
        Name: recordset.recordset[0].Name,
        HTML: recordset.recordset[0].HTML,
        SigHTML: recordset.recordset[0].SigHTML,
        ImageData: recordset.recordset[0].ImageData,
      };
      const objectString = JSON.stringify(signatureObject);
      const encryptedData = cryptoUtils.encryptFile(objectString);
      res.setHeader("Content-Disposition", `attachment; filename=${recordset.recordset[0].Name}.GSign`);
      res.setHeader("Content-Type", "application/octet-stream");
      res.send(encryptedData);
    });
  });
});
router.post("/uploadAndDecrypt", upload.single("file"), function (req, res, next) {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const fileData = req.file.buffer;
  const { companyId, signatureName } = req.body;
  const decryptedData = cryptoUtils.decryptFile(fileData);
  const decryptedText = decryptedData.toString();
  const extractedData = JSON.parse(decryptedText);
  saveToDatabase(extractedData, companyId, signatureName, res);
});
function saveToDatabase(extractedData, companyId, signatureName, res) {
  sql.connect(config, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send("Database connection error");
    }
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
        ,'${signatureName}'  -- Modify this part based on your actual data structure
        ,'${extractedData.HTML}'
        ,'${extractedData.SigHTML}'
        ,'${cryptoUtils.decrypt(companyId)}'
        ,'${extractedData.ImageData}'
        ,1);
      END;`;
    request.query(queryText, function (err, recordset) {
      if (err) {
        console.log(err);
        return res.status(500).send("Error saving data to the database");
      }
      res.send({ success: true, message: "Data saved successfully" });
    });
  });
}

router.get("/loginuser", (req, res) => {
  sql.connect(config, function (err) {
    var decryptId = cryptoUtils.decrypt(req.query.companyId);
    if (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
    var request = new sql.Request();
    var queryText = `SELECT * FROM ADCO WHERE C_CD = ${decryptId}`;
    request.query(queryText, function (err, recordset) {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }
      const userData = recordset.recordset[0];
      if (!userData) {
        return res.json({});
      }
      const filteredUserData = {
        First_Name: userData.C_FNAME,
        Last_Name: userData.C_LNAME,
        Name: userData.C_FNAME + " " + userData.C_LNAME,
        Company: userData.C_NAME,
        telephoneNumber: userData.C_TEL,
        StreetAddress: userData.C_ADD1,
        City: userData.C_TOWN,
        State: userData.C_STATE,
        PostalCode: userData.C_ZIP,
        E_Mail: userData.C_USRCD,
        Mobile_No: userData.C_MOBILEKEY,
      };
      res.json(filteredUserData);
    });
  });
});

router.get("/companyuser", (req, res) => {
  const searchQuery = req.query.query;
  if (!searchQuery) {
    return res.status(400).send("Bad Request: Search query is missing");
  }
  sql.connect(config, function (err) {
    var decryptId = cryptoUtils.decrypt(req.query.companyId);
    if (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
    var request = new sql.Request();
    var queryText = `SELECT U_EMAIL FROM ADUSR WHERE U_CONO = '${decryptId}' AND U_EMAIL LIKE @searchQuery`;
    request.input("searchQuery", sql.NVarChar, `%${searchQuery}%`);
    request.query(queryText, function (err, recordset) {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }
      const emailAddresses = recordset.recordset.map((row) => row.U_EMAIL);
      res.json(emailAddresses);
    });
  });
});

router.get("/companyuser/:email", (req, res) => {
  const selectedEmail = req.params.email;
  sql.connect(config, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
    var request = new sql.Request();
    var queryText = `SELECT  D_KEY = ISNULL( K_ALIAS,  D_KEY ) , D_VAL FROM ADPATH
    LEFT JOIN ADDET ON D_PCD = P_CD
    LEFT JOIN ADKEY ON  K_NO = D_KNO
     WHERE P_DSC = '${selectedEmail}'`;
    request.query(queryText, function (err, recordset) {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }
      const userData1 = recordset.recordset;
      const userData = userData1.reduce((acc, { D_KEY, D_VAL }) => {
        const formattedKey = D_KEY.replace(/ /g, "_").replace(/-/g, "_").replace(/\./g, "");
        acc[formattedKey] = D_VAL;
        return acc;
      }, {});
      res.json(userData);
    });
  });
});

module.exports = router;
