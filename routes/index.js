var express = require("express");
var router = express.Router();
var path = require("path");
var sql = require("mssql");

// config for your database
var config = {
  user: "sa",
  password: "qwerty1234",
  server: "localhost",
  database: "greenSignature",
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

    var queryText = `SELECT [Id]
            ,[HTML]
            ,[SigHTML]
            ,[Name]
            ,[ImageData]
        FROM [dbo].[signatures]
        ORDER BY SigOrder`;

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
