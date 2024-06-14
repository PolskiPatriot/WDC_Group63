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
    var query = "SELECT * FROM Events INNER JOIN Posts ON Events.EventID = Posts.EventID";
    connection.query(query, function (err, eventInfo) {
      connection.release();
      if (err) {
        console.log(err)
        res.sendStatus(500);
        return;
      }
      console.log(eventInfo)
      res.send(eventInfo);
    });
  });
});

module.exports = router;