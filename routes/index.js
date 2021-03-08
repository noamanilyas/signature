var express = require("express");
var router = express.Router();
var path = require("path");
var sql = require("mssql");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/saveHTML", function (req, res, next) {
  console.log("Body", req.body);

  // config for your database
  var config = {
    user: "sa",
    password: "qwerty1234",
    server: "localhost",
    database: "greenSignature",
    port: 1433,
  };

  // connect to your database
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    var queryText = `INSERT INTO [dbo].[signatures]
             ([HTML]
             ,[SigHTML]
             ,[Name])
       VALUES
             ('${req.body.html}'
             , '${req.body.signatureHTML}'
             , '${req.body.name}')`;

    // query to the database and get the records
    request.query(queryText, function (err, recordset) {
      if (err) console.log(err);

      // send records as a response
      res.send(recordset);
    });
  });
});

router.post("/updateHTML", function (req, res, next) {
  console.log("Body", req.body);

  // config for your database
  var config = {
    user: "sa",
    password: "qwerty1234",
    server: "localhost",
    database: "greenSignature",
    port: 1433,
  };

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
  // config for your database
  var config = {
    user: "sa",
    password: "qwerty1234",
    server: "localhost",
    database: "greenSignature",
    port: 1433,
  };

  // connect to your database
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    var queryText = `SELECT [Id]
            ,[HTML]
            ,[SigHTML]
            ,[Name]
        FROM [dbo].[signatures]`;

    // query to the database and get the records
    request.query(queryText, function (err, recordset) {
      if (err) console.log(err);

      // send records as a response
      res.send(recordset);
    });
  });
});

router.get("/getSignatureById", function (req, res, next) {
  // config for your database
  var config = {
    user: "sa",
    password: "qwerty1234",
    server: "localhost",
    database: "greenSignature",
    port: 1433,
  };

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
        FROM [dbo].[signatures] WHERE [dbo].[signatures].[Id] = ` + req.query.id;

    // query to the database and get the records
    request.query(queryText, function (err, recordset) {
      if (err) console.log(err);

      // send records as a response
      res.send(recordset);
    });
  });
});

router.get("/markerIcon1", function (req, res, next) {
  res.sendFile(path.join(__dirname, "../public/images/location-2@2x.png"));
});

router.get("/getAllLocations", function (req, res, next) {
  let db = req.con;

  let query = `SELECT Id, Title FROM locations;`;

  let vals = [];

  db.query(query, vals, function (err, rows) {
    if (err) {
      res.send({ Status: 0, Msg: `Get data failed: ${err}`, Data: [] });
    }
    res.send({ Status: 1, Msg: "Get data successfull.", Data: rows });
  });
});

router.get("/getAllLocationsData", function (req, res, next) {
  let db = req.con;

  let query = `SELECT Id, Title, Details FROM locations;`;

  let vals = [];

  db.query(query, vals, function (err, rows) {
    if (err) {
      res.send({ Status: 0, Msg: `Get data failed: ${err}`, Data: [] });
    }
    res.send({ Status: 1, Msg: "Get data successfull.", Data: rows });
  });
});

router.post("/deleteLocation", function (req, res, next) {
  console.log("Body", req.body);
  let db = req.con;

  let query = `DELETE FROM ${"`locations`"} WHERE Id = ?;`;

  let vals = [req.body.Id];

  db.query(query, vals, function (err, rows) {
    if (err) {
      res.send({ Status: 0, Msg: `Delete data failed: ${err}`, Data: [] });
    }
    res.send({ Status: 1, Msg: "Delete data successfull.", Data: [] });
  });
});

module.exports = router;
