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
			res.send(500);
		}
	});

	var queries;
	if (req.cookies.userID){

		queries=[

				"(SELECT Posts.* ,Events.* , HEX(Posts.EventID) AS TrueEventID, HEX(Posts.PostID) AS TruePostID  FROM Posts "
					+"INNER JOIN GroupJoin ON GroupJoin.OrgID=Posts.OrgID "
					+"LEFT JOIN Events "
					+"ON Events.EventID=Posts.EventID "
					+"WHERE GroupJoin.UserID=0x"+req.cookies.userID +"  "
				+"UNION ALL "
				+"SELECT Posts.*, Events.*, HEX(Posts.EventID) AS TrueEventID, HEX(Posts.PostID) AS TruePostID FROM Posts "
					+"INNER JOIN GroupJoin ON GroupJoin.OrgID=Posts.OrgID "
					+"RIGHT JOIN Events "
					+"ON Events.EventID=Posts.EventID "
					+"WHERE Posts.EventID IS NULL AND GroupJoin.UserID=0x"+req.cookies.userID +" "
				+"ORDER BY PostDate DESC) ",

				"(SELECT Posts.*, Events.*, HEX(Posts.EventID) AS TrueEventID, HEX(Posts.PostID) AS TruePostID FROM Posts "
					+"LEFT JOIN GroupJoin ON GroupJoin.OrgID!=Posts.OrgID "
					+"LEFT JOIN Events "
					+"ON Events.EventID=Posts.EventID "
					+"WHERE Posts.private='false' AND Posts.OrgID NOT IN(SELECT OrgId From GroupJoin Where GroupJoin.UserID=0x"+req.cookies.userID +") "
				+"UNION ALL "
				+"SELECT Posts.*, Events.*, HEX(Posts.EventID) AS TrueEventID, HEX(Posts.PostID) AS TruePostID FROM Posts "
					+"LEFT JOIN GroupJoin ON GroupJoin.OrgID!=Posts.OrgID "
					+"RIGHT JOIN Events "
					+"ON Events.EventID=Posts.EventID "
					+"WHERE Posts.EventID IS NULL AND Posts.private='false' AND Posts.OrgID NOT IN(SELECT GroupJoin.OrgId From GroupJoin Where GroupJoin.UserID=0x"+req.cookies.userID +") )"
				,
				"SELECT HEX(JoinID) AS TrueJoinID, HEX(EventID) AS TrueEventID, HEX(UserID) AS TruePostID From EventJoin WHERE UserID=0x" + req.cookies.userID,
				"SELECT *,HEX(BranchOrg.OrgID) AS TrueOrgID FROM BranchOrg ORDER BY memberCount ASC LIMIT 3 ",
                ];
	} else {
		queries=["(SELECT *, HEX(Posts.EventID) AS TrueEventID, HEX(Posts.PostID) AS TruePostID, HEX(OrgID) AS TrueOrgID FROM Posts "
		+"LEFT JOIN Events "
		+"ON Events.EventID=Posts.EventID "
		+"WHERE Posts.private='false') "
		+"UNION ALL "
		+"(SELECT *, HEX(Posts.EventID) AS TrueEventID, HEX(Posts.PostID) AS TruePostID, HEX(OrgID) AS TrueOrgID FROM Posts "
		+"RIGHT JOIN Events "
		+"ON Events.EventID=Posts.EventID "
		+"WHERE Posts.EventID IS NULL AND Posts.private='false') "
		+"ORDER BY postDate DESC ",
		"SELECT *, HEX(EventID) AS TrueEventID FROM EventJoin",
		"SELECT *, HEX(EventID) AS TrueEventID FROM EventJoin",
		"SELECT *,HEX(BranchOrg.OrgID) AS TrueOrgID FROM BranchOrg ORDER BY memberCount ASC LIMIT 5 ",
                ];
	}

	console.log(queries);
	if (req.cookies.userID) {
		queries.push("SELECT * ,HEX(BranchOrg.OrgID) AS TrueOrgID FROM GroupJoin LEFT JOIN BranchOrg ON BranchOrg.OrgID=GroupJoin.OrgID WHERE UserID=0x"+req.cookies.userID + " LIMIT 3 " );
	} else {
		queries.push("SELECT * FROM GroupJoin");
	}

		console.log(queries);
	connection.query(queries.join(';'), function(err, results) {
		if (err) throw err;
		//console.log(results);
		var Joined = {};
		var flag = false;
		var userLevel = 99;
		var Posts = results[0];

		if (req.cookies.userID) {
			Posts = Posts.concat(results[1]);
			userLevel = 0;
			for (let i = 0; i < Posts.length; i++){ // for all posts selected

				if (Posts[i].EventID) { //if its an event
					for (let j = 0; j < results[2].length; j++) { // for all events joined
						if (Posts[i].TrueEventID == results[2][j].TrueEventID){ //if event joined is equal to current event

							Joined[Posts[i].TrueEventID] = '1'; // appened joined [id] : '1'
							flag = true;
						}
					}
					if (!flag) {
						Joined[Posts[i].TrueEventID] = '0';
					}
					flag = false;
				}
			}
		}


		res.render(path.join(__dirname, '../public', '1.html'), {
			recentData:Posts,
			joinHistory:Joined,
			userLevel:userLevel,
			PopularBranches: results[3],
			YourBranches:results[4]
		});
	});

	connection.end();
});

module.exports = router;