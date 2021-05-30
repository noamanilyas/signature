var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
// var mysql = require('mysql');

var routes = require("./routes/index");
// var users = require("./routes/users");

var app = express();

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "admin",
//   database: "sportsmove"
// });
// con.connect(function(err){
//   if(err){
//     console.log('Error connecting to Db');
//     return;
//   }
//   console.log('Connection established');
// });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger("dev"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, 'public/node_modules')));
// app.use(express.static(__dirname + '/../public/node_modules'));

// var sql = require("mssql");

// // config for your database
// var config = {
//   user: "sa",
//   password: "mypassword",
//   server: "localhost",
//   database: "SchoolDB",
// };

// // connect to your database
// sql.connect(config, function (err) {
//   if (err) console.log(err);

//   // create Request object
//   var request = new sql.Request();

//   // query to the database and get the records
//   request.query("select * from Student", function (err, recordset) {
//     if (err) console.log(err);

//     // send records as a response
//     res.send(recordset);
//   });
// });

// app.use(function (req, res, next) {
// 	req.con = con;
// 	next();
// });
app.use("/", routes);
// app.use("/users", users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err,
    });
  });
}



var portNumber = process.env.port || process.env.PORT || 8000


/*
app.listen(8000, "0.0.0.0", function () {
  // print a message when the server starts listening
  console.log("Server starting on 8000");
});
*/

/*
app.listen(portNumber, () => {
	console.log(`Example app listening at http://localhost:${portNumber}`);
});
*/



app.listen(portNumber, "0.0.0.0", function () {
  // print a message when the server starts listening
  console.log("Server starting on 8000");
});





// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {},
  });
});

module.exports = app;
