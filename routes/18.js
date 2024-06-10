const express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public', '18.html'));
});


// receive request
router.get('/getContent', function (req, res) {
  req.pool.getConnection((error, connection) => {
    if (error) {
      res.send(500);
    }
    // ADD CHECK FOR ADMIN HERE
    var query = "SELECT orgName FROM MainOrg ORDER BY orgName ASC";
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

router.get('/viewBranches', function (req, res) {
  res.redirect(path.join('..', 'viewBranchOrgs'));
});

module.exports = router;