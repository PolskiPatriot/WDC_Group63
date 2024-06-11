const express = require('express');
const path = require('path');
const { send } = require('process');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public', '19.html'));
});


// receive request
router.post('/createOrg', function (req, res) {
  var orgName = req.body.orgName;
  var orgAbout = req.body.orgAbout;

  req.pool.getConnection((error, connection) => {
    if (error) {
      res.send(500);
    }
    var query = "INSERT INTO MainOrg VALUES (UNHEX(REPLACE(UUID(), '-','')), ?, ?, 0, NULL, 1)";
    connection.query(query, [orgName, orgAbout], function (err, success) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send('success');
    });
  });
});

module.exports = router;
