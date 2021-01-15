var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/markerIcon1', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/images/location-2@2x.png'));
});


router.get('/getAllLocations', function(req, res, next) {

	let db = req.con;

  let query = `SELECT Id, Title FROM locations;`;
    
  let vals = [];

	db.query(query, vals,function(err,rows){
		if(err){
      res.send({'Status': 0, 'Msg': `Get data failed: ${err}`, 'Data': []});
    }
    res.send({'Status': 1, 'Msg': 'Get data successfull.', 'Data': rows});
	});
});

router.get('/getAllLocationsData', function(req, res, next) {

	let db = req.con;

  let query = `SELECT Id, Title, Details FROM locations;`;
    
  let vals = [];

	db.query(query, vals,function(err,rows){
		if(err){
      res.send({'Status': 0, 'Msg': `Get data failed: ${err}`, 'Data': []});
    }
    res.send({'Status': 1, 'Msg': 'Get data successfull.', 'Data': rows});
	});
});

router.post('/addNewLocation', function(req, res, next) {


	console.log("Body", req.body);
  // res.send({'Status': 1, 'Msg': 'Save data successfull.', 'Data': []});


	let db = req.con;

  let query = `INSERT INTO ${'`locations` (`Details`, `Title`)'}
		VALUES (?, ?);`;
    
  let vals = [JSON.stringify(req.body), req.body.Title];

	db.query(query, vals,function(err,rows){
		if(err){
      res.send({'Status': 0, 'Msg': `Save data failed: ${err}`, 'Data': []});
    }
    else if(rows.affectedRows == 1){
      res.send({'Status': 1, 'Msg': 'Save data successfull.', 'Data': []});
    } else {
      res.send({'Status': 0, 'Msg': 'Save data failed.', 'Data': []});
    }
	});
});

router.post('/deleteLocation', function(req, res, next) {

	console.log("Body", req.body);
	let db = req.con;

  let query = `DELETE FROM ${'`locations`'} WHERE Id = ?;`;
    
  let vals = [req.body.Id];

	db.query(query, vals,function(err,rows){
		if(err){
      res.send({'Status': 0, 'Msg': `Delete data failed: ${err}`, 'Data': []});
    }
    res.send({'Status': 1, 'Msg': 'Delete data successfull.', 'Data': []});
	});
});

module.exports = router;
