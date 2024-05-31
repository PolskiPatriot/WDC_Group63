var express = require('express');
const path = require('path');
const mysql = require('mysql');
const { error } = require('console');



var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	const connection = mysql.createConnection({
		host: "localhost",
		database: "uDatabase",
		multipleStatements: true
	});

	connection.connect((error)=>{
		if (error) {
			console.error("error ", error);
		}
	});
	var queries = [ "SELECT * FROM Posts WHERE Pinned != 'false'",
					"SELECT * FROM Posts WHERE Pinned = 'false'"];

	connection.query(queries.join(';'), function(err, results) {
		if (err) throw err;
		res.render(path.join(__dirname, '../public', '2.html'), {
			pinnedData:results[0],
			recentData:results[1]
		});
	});

	connection.end();
});

module.exports = router;
