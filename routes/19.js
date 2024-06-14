const express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	if (req.level > 4) {
		res.sendFile(path.join(__dirname, '../public', '19.html'));
		return;
	} else {
		res.redirect('back');
		return;
	}
});


// receive request
router.get('/getContent', function (req, res) {
  // need to be a SUPER ULTRA MEGA ADMIN
  req.pool.getConnection((error, connection) => {
    if (error) {
      res.send(500);
    }
    // ADD CHECK FOR SUPER ULTRA MEGA ADMIN HERE
    var query = "SELECT orgName, verification FROM MainOrg WHERE verification = 1 ORDER BY orgName ASC";
    connection.query(query, function (err, groupInfo) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send(groupInfo);
    });
  });
});

module.exports = router;

router.get('/verifyOrg', function (req, res) {
  var orgName = req.query.orgName;
  // need to be a SUPER ULTRA MEGA ADMIN
  req.pool.getConnection((error, connection) => {
    if (error) {
      res.send(500);
    }
    // ADD CHECK FOR SUPER ULTRA MEGA ADMIN HERE
    var query = "UPDATE MainOrg SET verification = 2 WHERE orgName = ?";
    connection.query(query, [orgName], function (err, groupInfo) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.redirect('back');
    });
  });
});

router.get('/denyOrg', function (req, res) {
  var orgName = req.query.orgName;
  // need to be a SUPER ULTRA MEGA ADMIN
  req.pool.getConnection((error, connection) => {
    if (error) {
      res.send(500);
    }
    // ADD CHECK FOR SUPER ULTRA MEGA ADMIN HERE
    var query = "UPDATE MainOrg SET verification = 0 WHERE orgName = ?";
    connection.query(query, [orgName], function (err, groupInfo) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.redirect('back');
    });
  });
});