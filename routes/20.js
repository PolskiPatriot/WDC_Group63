const express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
	if (req.level > 2) {
		res.sendFile(path.join(__dirname, '../public', '20.html'));
		return;
	} else {
		res.redirect('back');
		return;
	}
});


// receive request
router.get('/getContent', function (req, res) {
  // need to be the CORRECT ADMIN
  req.pool.getConnection((error, connection) => {
    if (error) {
      res.sendStatus(500);
    }
    // ADD CHECK FOR ADMIN HERE
    var mainOrgName = req.query.orgName;
    var query = "SELECT orgName FROM BranchOrg WHERE MainOrgID = (SELECT MainOrgID FROM MainOrg WHERE orgName = ?) ORDER BY orgName ASC;";
    connection.query(query, [mainOrgName], function (err, groupInfo) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send(groupInfo);
    });
  });
});

// delete org
router.get('/deleteOrg', function (req, res) {
  var orgName = req.query.orgName;

  // need to be a SUPER ULTRA MEGA ADMIN
  req.pool.getConnection((error, connection) => {
    if (error) {
      res.sendStatus(500);
    }
    // ADD CHECK FOR SUPER ULTRA MEGA ADMIN HERE
    var query = "DELETE FROM BranchOrg WHERE orgName = ?";
    // console.log(query);
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

router.post('/createBranchOrg', (req, res) => {

  // if not signed in, redirect
  if (typeof req.cookies.userID === 'undefined') {
    res.send('relog');
  } else {

    var mainOrg = req.body.mainOrg;
    var orgName = req.body.orgName;
    var orgRegion = req.body.orgRegion;
    var orgAbout = req.body.orgAbout;

    req.pool.getConnection((error, connection) => {
      if (error) {
        res.sendStatus(500);
      }
      var query = "SELECT HEX(MainOrgID) AS UUID FROM MainOrg WHERE orgName = ?";
      connection.query(query, [mainOrg], function (err, mainGroupUUID) {
        if (err) {
          res.sendStatus(500);
          return;
        }
        var mainUUID = mainGroupUUID[0].UUID;

        // check if org already exists
        query = "SELECT orgName FROM BranchOrg WHERE MainOrgID = UNHEX(?) AND orgName = ?";
        connection.query(query, [mainUUID, orgName], function (err, exists) {
          if (err) {
            res.sendStatus(500);
            return;
          }
          if (!(typeof exists[0] === 'undefined')) {
            res.send("exists");
            return;
          } else {
            query = "SELECT REPLACE(UUID(), '-','') AS UUID";
            connection.query(query, function (err, groupUUID) {
              if (err) {
                res.sendStatus(500);
                return;
              }
              var UUID = groupUUID[0].UUID;
              var query = "INSERT INTO BranchOrg VALUES (UNHEX(?), ?, ?, 0, NULL, ?, UNHEX(?))";
              connection.query(query, [UUID, orgName, orgAbout, orgRegion, mainUUID], function (err, success) {
                if (err) {
                  res.sendStatus(500);
                  return;
                }
                var query = "INSERT INTO GroupJoin VALUES (UNHEX(REPLACE(UUID(), '-','')), UNHEX(?), UNHEX(?), 4)";
                connection.query(query, [UUID, req.cookies.userID], function (err, success) {
                  connection.release();
                  if (err) {
                    res.sendStatus(500);
                    return;
                  }
                  res.send("success");
                  return;
                });
              });
            });
          }
        });
      });
    });
  }
});


module.exports = router;