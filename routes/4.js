const { group } = require('console');
var express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  if (req.level > 1) {



    res.sendFile(path.join(__dirname, '../public', '4.html'));
    return;
  } else {
    res.redirect('back');
    return;
  }
});

router.get('/getContent', function (req, res) {
  var orgName = req.query.orgName;
  var eventID;
  if (req.query.id) {
    eventID = req.query.id;
  }
  req.pool.getConnection((error, connection) => {
    if (error) {
      res.send(500);
    }
    var query;
    if (eventID) {
      query = "SELECT COUNT(JoinID) AS Count FROM EventJoin WHERE EventID = " + eventID;
      connection.query(query, function (err, success) {
        if (err) {
          res.sendStatus(500);
          return;
        }
        var memberCount = success[0].Count;
        // list all members of event
        query = "SELECT givenName AS Name, EventID FROM EventJoin INNER JOIN Users ON EventJoin.UserID = Users.UserID WHERE EventID = " + eventID;
        connection.query(query, function (err, userList) {
          if (err) {
            res.sendStatus(500);
            return;
          }
          userList[0].memberCount = memberCount;
          userList[0].OwnUserLevel = 0;
          res.send(userList);
        });
      });
    } else {
      // get branchOrgID and member count
      query = "SELECT HEX(OrgID) AS UUID, memberCount FROM BranchOrg WHERE orgName = ?";
      connection.query(query, [orgName], function (err, groupUUID) {
        if (err) {
          res.sendStatus(500);
          return;
        }
        var UUID = groupUUID[0].UUID;
        var memberCount = groupUUID[0].memberCount;
        // list all members of org
        query = "SELECT givenName AS Name, HEX(GroupJoin.JoinID) AS JoinID, UserLevel FROM GroupJoin INNER JOIN Users ON GroupJoin.UserID = Users.UserID WHERE GroupJoin.OrgID = UNHEX(?) AND UserLevel < 6";
        connection.query(query, [UUID], function (err, userList) {
          if (err) {
            res.sendStatus(500);
            return;
          }
          query = "SELECT UserLevel FROM GroupJoin WHERE OrgID = UNHEX(?) AND UserID = UNHEX(?)";
          connection.query(query, [UUID, req.cookies.userID], function (err, userLevel) {
            connection.release();
            if (err) {
              res.sendStatus(500);
              return;
            }
            userList[0].memberCount = memberCount;
            userList[0].OwnUserLevel = userLevel[0].UserLevel;
            res.send(userList);
            return;
          });
        });
      });
    }
  });
});


router.post('/manageUser', function (req, res) {
  var manageType = req.body.type;
  var JoinID = req.body.JoinID;
  var query;
  switch (manageType) {
    case 0:
      query = "UPDATE GroupJoin SET UserLevel = (UserLevel + 1) WHERE JoinID = UNHEX(?)";
      break;
    case 1:
      query = "UPDATE GroupJoin SET UserLevel = (UserLevel - 1) WHERE JoinID = UNHEX(?)";
      break;
    case 2:
      query = "DELETE FROM GroupJoin WHERE JoinID = UNHEX(?)";
      break;
    default:
      res.send("INVALID TYPE");
      break;
  }
  req.pool.getConnection((error, connection) => {
    if (error) {
      res.send(500);
    }
    connection.query(query, [JoinID], function (err, success) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send(success);
      return;
    });
  });
});

module.exports = router;
