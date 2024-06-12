const express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // need to be AN ADMIN
  res.sendFile(path.join(__dirname, '../public', '20.html'));
});


// receive request
router.get('/getContent', function (req, res) {
  // need to be the CORRECT ADMIN
  req.pool.getConnection((error, connection) => {
    if (error) {
      res.send(500);
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

router.get('/deleteOrg', function (req, res) {
  var orgName = req.query.orgName;
  // need to be a SUPER ULTRA MEGA ADMIN
  req.pool.getConnection((error, connection) => {
    if (error) {
      res.send(500);
    }
    // ADD CHECK FOR SUPER ULTRA MEGA ADMIN HERE
    var query = "DELETE FROM BranchOrg WHERE orgName = ?";
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

router.post('/createBranchOrg', function (req, res) {
  var mainOrg = req.body.mainOrg;
  var orgName = req.body.orgName;
  var orgRegion = req.body.orgRegion;
  var orgAbout = req.body.orgAbout;
  var query;
  var UUID;
  var mainOrgUUID;

  req.pool.getConnection((error, connection) => {
    if (error) {
      res.send(500);
    }
    // generate UUID
    query = "SELECT REPLACE(UUID(), '-','') AS UUID";
    connection.query(query, function (err, groupUUID) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      UUID = groupUUID[0].UUID;
      console.log(UUID);
    });

    // retreive mainOrg UUID
    req.pool.getConnection((error, connection) => {
      if (error) {
        res.send(500);
      }
      query = "SELECT HEX(MainOrgID) AS UUID FROM MainOrg WHERE orgName = ?";
      connection.query(query, [mainOrg], function (err, mainGroupUUID) {
        connection.release();
        if (err) {
          res.sendStatus(500);
          return;
        }
        mainOrgUUID = mainGroupUUID[0].UUID;
      });

      // create branch Org
      req.pool.getConnection((error, connection) => {
        if (error) {
          res.send(500);
        }
        query = "INSERT INTO BranchOrg VALUES (UNHEX('" + UUID + "'), ?, ?, 0, NULL, ?, UNHEX('" + mainOrgUUID + "'))";
        connection.query(query, [orgName, orgAbout, orgRegion], function (err, success) {
          connection.release();
          if (err) {
            res.sendStatus(500);
            return;
          }
        });
      });
    });

    // link account to branch Org
    req.pool.getConnection((error, connection) => {
      if (error) {
        res.send(500);
      }
      query = "INSERT INTO GroupJoin VALUES (UNHEX(REPLACE(UUID(), '-','')), UNHEX('" + UUID + "'), UNHEX('" + req.cookies.userID + "'), 3)";
      console.log(query);
      connection.query(query, [orgName, orgAbout], function (err, success) {
        connection.release();
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        console.log(success);
        res.sendStatus(200);
        return;
      });
    });
  });
});
module.exports = router;
