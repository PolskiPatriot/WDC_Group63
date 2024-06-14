const { group } = require('console');
const express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.level > 2) {
    res.sendFile(path.join(__dirname, '../public', '18.html'));
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
    var query = "SELECT orgName FROM MainOrg WHERE MainOrgID IN (SELECT MainOrgID FROM GroupJoin INNER JOIN BranchOrg ON GroupJoin.OrgID = BranchOrg.OrgID WHERE UserID = UNHEX(?) AND UserLevel > 2)";
    connection.query(query, [req.cookies.userID], function (err, groupInfo) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      if (req.level > 4) {
        groupInfo[0].superAdmin = 1;
      }
      res.send(groupInfo);
    });
  });
});

router.get('/viewBranches', function (req, res) {
  res.redirect(path.join('..', 'viewBranchOrgs'));
});


// delete org
router.get('/deleteOrg', function (req, res) {
  var orgName = req.query.orgName;

  req.pool.getConnection((error, connection) => {
    if (error) {
      res.sendStatus(500);
    }
    var query = "DELETE FROM MainOrg WHERE orgName = ?";
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


module.exports = router;