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
	var queries=["SELECT * FROM Posts "
				+"LEFT JOIN Events "
				+"ON Events.EventID=Posts.EventID "
				+"WHERE Posts.Pinned!='false' "
				+"UNION ALL "
				+"SELECT * FROM Posts "
				+"RIGHT JOIN Events "
				+"ON Events.EventID=Posts.EventID "
				+"WHERE Posts.EventID IS NULL AND Posts.Pinned!='false'",

				"SELECT * FROM Posts "
				+"LEFT JOIN Events "
				+"ON Events.EventID=Posts.EventID "
				+"UNION ALL "
				+"SELECT * FROM Posts "
				+"RIGHT JOIN Events "
				+"ON Events.EventID=Posts.EventID "
				+"WHERE Posts.EventID IS NULL"];

	connection.query(queries.join(';'), function(err, results) {
		if (err) throw err;
		console.log(results[1]);
		res.render(path.join(__dirname, '../public', '2.html'), {

			pinnedData:results[0],
			recentData:results[1]
		});
	});

	connection.end();
});

module.exports = router;
