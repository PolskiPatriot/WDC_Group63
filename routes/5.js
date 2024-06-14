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
			console.error("error ", error);
		}
	});

	var queries=["SELECT *, HEX(Posts.EventID) AS TrueEventID FROM Posts "
				+"INNER JOIN Events "
				+"ON Events.EventID=Posts.EventID "
				+"WHERE Posts.EventID=" + req.query.EventID,
                "Select BranchOrg.*, HEX(BranchOrg.OrgID) AS TrueOrgID From Posts "
                +"RIGHT JOIN BranchOrg "
                +"ON Posts.OrgID=BranchOrg.OrgID "
                +"WHERE Posts.EventID=" + req.query.EventID
            ];


	if (req.cookies.userID) {
		queries.push("SELECT * from EventJoin WHERE UserID=0x"+req.cookies.userID +" AND EventID=" + req.query.EventID);
		queries.push("SELECT UserLevel FROM GroupJoin WHERE OrgID= (SELECT OrgID from Events WHERE EventID=" + req.query.EventID + ') AND UserID=0x'+req.cookies.userID + ' ');

	} else {
		queries.push("SELECT * from EventJoin WHERE EventID=" + req.query.EventID);
	}

	var joinedBool = false;
	var JoinedOrgBool = false;
	var userID;
	connection.query(queries.join(';'), function(err, results) {
		if (err) throw err;
		if (req.cookies.userID) {
			if (results[2].length > 0){
				joinedBool = true;
			}
			if (results[3].length>0) {
				JoinedOrgBool = true;
			}
			userID = req.cookies.userID;
		} else {
			userID = 0;
		}

		res.render(path.join(__dirname, '../public', '5.html'), {

			postData:results[0][0],
            groupData:results[1][0],
			joinedBool: joinedBool,
			JoinedOrgBool: JoinedOrgBool,
			userID: userID
		});
	});

	connection.end();
});

module.exports = router;
