const express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.level > 0) {
    res.sendFile(path.join(__dirname, '../public', '9.html'));
    return;
  } else {
    res.redirect('back');
    return;
  }
});


// receive request
router.get('/getContent', function (req, res) {
  req.pool.getConnection((error, connection) => {
    if (error) {
      res.send(500);
    }
    var query = "SELECT orgName, aboutOrg FROM BranchOrg ORDER BY orgName ASC";
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
