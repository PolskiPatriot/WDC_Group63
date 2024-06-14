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
	var queries=["SELECT *, HEX(Posts.EventID) AS TrueEventID FROM Posts "
				+"LEFT JOIN Events "
				+"ON Events.EventID=Posts.EventID "
				+"WHERE Posts.Pinned!='false' "
				+"UNION ALL "
				+"SELECT *, HEX(Posts.EventID) AS TrueEventID FROM Posts "
				+"RIGHT JOIN Events "
				+"ON Events.EventID=Posts.EventID "
				+"WHERE Posts.EventID IS NULL AND Posts.Pinned!='false'",

				"SELECT *, HEX(Posts.EventID) AS TrueEventID FROM Posts "
				+"LEFT JOIN Events "
				+"ON Events.EventID=Posts.EventID "
				+"UNION ALL "
				+"SELECT *, HEX(Posts.EventID) AS TrueEventID FROM Posts "
				+"RIGHT JOIN Events "
				+"ON Events.EventID=Posts.EventID "
				+"WHERE Posts.EventID IS NULL"];

	connection.query(queries.join(';'), function(err, results) {
		if (err) throw err;
		console.log(results[1][0]);


		if (req.level == 0) {
			res.render(path.join(__dirname, '../public', '3.html'), {

				pinnedData:results[0],
				recentData:results[1]
			});
			return;
		} else {
			res.redirect('back');
			return;
		}
	});

	connection.end();
});

module.exports = router;
