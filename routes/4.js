const { group } = require('console');
var express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public', '4.html'));
});

router.get('/getContent', function (req, res, next) {
  var orgName = req.query.orgName;
  req.pool.getConnection((error, connection) => {
    if (error) {
      res.send(500);
    }
    var query = "SELECT HEX(OrgID) AS UUID, memberCount FROM BranchOrg WHERE orgName = '" + orgName + "'";
    connection.query(query, function (err, groupUUID) {
      if (err) {
        res.sendStatus(500);
        return;
      }
      var UUID = groupUUID[0].UUID;
      var memberCount = groupUUID[0].memberCount;
      query = "SELECT givenName AS Name, HEX(GroupJoin.UserID) AS UserID, UserLevel FROM GroupJoin INNER JOIN Users ON GroupJoin.UserID = Users.UserID WHERE GroupJoin.OrgID = UNHEX('" + UUID + "') AND UserLevel < 4";
      connection.query(query, function (err, userList) {
        connection.release();
        if (err) {
          res.sendStatus(500);
          return;
        }
        userList[0].memberCount = memberCount;
        res.send(userList);
        return;
      });
    });
  });
});

module.exports = router;
