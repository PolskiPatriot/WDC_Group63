const express = require('express');
const path = require('path');
const { send } = require('process');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // need to be a User
  res.sendFile(path.join(__dirname, '../public', '19.html'));
});


// receive request
router.post('/createOrg', function (req, res) {
  var orgName = req.body.orgName;
  var orgAbout = req.body.orgAbout;
  var query;
  var UUID;

  req.pool.getConnection((error, connection) => {
    if (error) {
      res.send(500);
    }
    // generate UUID
    query = "SELECT REPLACE(UUID(), '-','') AS UUID";
    connection.query(query, [orgName, orgAbout], function (err, groupUUID) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      UUID = groupUUID[0].UUID;
    });
    // create mainOrg
    req.pool.getConnection((error, connection) => {
      if (error) {
        res.send(500);
      }
      query = "INSERT INTO MainOrg VALUES (UNHEX('" + UUID + "'), ?, ?, 0, NULL, 1)";
      connection.query(query, [orgName, orgAbout], function (err, success) {
        connection.release();
        if (err) {
          res.sendStatus(500);
          return;
        }
      });
    });
    // link account to mainOrg
    req.pool.getConnection((error, connection) => {
      if (error) {
        res.send(500);
      }
      query = "INSERT INTO GroupJoin VALUES (UNHEX(REPLACE(UUID(), '-','')), UNHEX('" + UUID + "'), UNHEX('" + req.cookies.userID + "'), 3)";
      connection.query(query, [orgName, orgAbout], function (err, success) {
        connection.release();
        if (err) {
          res.sendStatus(500);
          return;
        }
        res.redirect('back');
      });
    });
  });
});

module.exports = router;
