var express = require('express');
const path = require('path');
const mysql = require('mysql');
const { error, time } = require('console');
var router = express.Router();

/* GET event edit page. */
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
	var queries=["SELECT * FROM Posts "
				+"INNER JOIN Events "
				+"ON Events.EventID=Posts.EventID "
				+"WHERE Posts.EventID=" + req.query.EventID,
                "Select BranchOrg.* From Posts "
                +"RIGHT JOIN BranchOrg "
                +"ON Posts.OrgID=BranchOrg.OrgID "
                +"WHERE Posts.EventID=" + req.query.EventID
            ];

	connection.query(queries.join(';'), function(err, results) {
		if (err) throw err;
		res.render(path.join(__dirname, '../public', '5.html'), {

			postData:results[0][0],
            groupData:results[1][0]
		});
	});

	connection.end();
});

module.exports = router;
