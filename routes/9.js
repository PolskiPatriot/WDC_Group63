const express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.level > 0) {
    res.sendFile(path.join(__dirname, '../public', '9.html'));
    return;
  } else {
    res.redirect('/');
    return;
  }
});


// receive request
router.get('/getContent', function (req, res) {
  req.pool.getConnection((error, connection) => {
    if (error) {
      res.send(500);
    }
    // select joined groups
    var query = "SELECT * FROM GroupJoin INNER JOIN BranchOrg ON GroupJoin.OrgID = BranchOrg.OrgID WHERE UserID = UNHEX(?)";
    connection.query(query, [req.cookies.userID], function (err, groupInfo) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send(groupInfo);
    });
  });
});


router.get('/leaveOrg', function (req, res) {
  var orgName = req.query.orgName;
  req.pool.getConnection((error, connection) => {
    if (error) {
      res.sendStatus(500);
    }
    var query = "SELECT HEX(OrgID) as OrgID FROM BranchOrg WHERE orgName = ?";
    connection.query(query, [orgName], function (err, orgUUID) {
      if (err) {
        res.sendStatus(500);
        return;
      }
      var OrgID = orgUUID[0].OrgID;
      var query = "DELETE FROM GroupJoin WHERE OrgID = UNHEX(?)";
      connection.query(query, [OrgID], function (err, deleted) {
        if (err) {
          res.sendStatus(500);
          return;
        }
        query = "UPDATE BranchOrg SET memberCount = memberCount - 1 WHERE OrgID = UNHEX(?)";
        connection.query(query, [OrgID], function (err, decremented) {
          connection.release();
          if (err) {
            res.sendStatus(500);
            return;
          }
          res.redirect('back');
          return;
        });
      });
    });
  });
});
module.exports = router;