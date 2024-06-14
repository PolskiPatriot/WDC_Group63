var express = require('express');
const path = require('path');
const mysql = require('mysql');
const { error } = require('console');


var router = express.Router();

router.get('/', function(req, res, next) {
    const connection = mysql.createConnection({
          host: "localhost",
          database: "uDatabase",
          multipleStatements: true
      });
      connection.connect((error)=>{
          if (error) {
			res.send(500);
          }
      });

      var queries;

});

module.exports = router;