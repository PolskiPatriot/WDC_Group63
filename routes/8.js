const express = require('express');
const path = require('path');
const { isModuleNamespaceObject } = require('util/types');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public', '8.html'));
});


// receive request
router.get('/getContent', function (req, res) {
  req.pool.getConnection((error, connection) => {
    if (error) {
      res.send(500);
    }
    var query = "SELECT hex(EventID), startDate, endDate, location, responseCount, eventName FROM Events ORDER BY responseCount desc";
    connection.query(query, function (err, eventInfo) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send(eventInfo);
    });
  });
});

module.exports = router;