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
      res.sendStatus(500);
    }
    // add public groups
    var query = "SELECT HEX(Events.EventID) as EEID, HEX(Posts.EventID) as PEID, startDate, endDate, location, responseCount, private, title, content FROM Events INNER JOIN Posts ON Events.EventID = Posts.EventID WHERE Private = 1";
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