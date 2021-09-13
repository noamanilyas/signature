var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource...');
});

router.get('/select', function(req, res, next) {
  res.send('${req.query.id}');
});

router.get('/deleteUser', function(req, res, next) {
  res.send('deleteUser');
});

module.exports = router;
