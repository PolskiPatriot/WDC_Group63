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
	var queries;

	if (req.cookies.userID) {
		queries=[
		"SELECT Posts.*, Events.*, HEX(Posts.EventID) AS TrueEventID, HEX(Posts.PostID) AS TruePostID, HEX(Posts.OrgID) AS TrueOrgID FROM Posts "
			+"LEFT JOIN GroupJoin ON GroupJoin.OrgID=Posts.OrgID "
			+"LEFT JOIN Events "
			+"ON Events.EventID=Posts.EventID "
			+"WHERE Posts.Pinned!='false' AND Posts.OrgID="+req.query.id +" AND Posts.private!='false' AND GroupJoin.UserID=0x"+req.cookies.userID +" "
		+"UNION ALL "
		+"SELECT Posts.*, Events.*, HEX(Posts.EventID) AS TrueEventID, HEX(Posts.PostID) AS TruePostID, HEX(Posts.OrgID) AS TrueOrgID FROM Posts "
			+"LEFT JOIN GroupJoin ON GroupJoin.OrgID=Posts.OrgID "
			+"RIGHT JOIN Events "
			+"ON Events.EventID=Posts.EventID "
			+"WHERE Posts.EventID IS NULL AND Posts.Pinned!='false' AND Posts.OrgID="+req.query.id +"  AND Posts.private!='false' AND GroupJoin.UserID=0x"+req.cookies.userID + " "
		+"Union all "
		+"SELECT Posts.*, Events.*, HEX(Posts.EventID) AS TrueEventID, HEX(Posts.PostID) AS TruePostID, HEX(Posts.OrgID) AS TrueOrgID FROM Posts "
			+"LEFT JOIN Events "
			+"ON Events.EventID=Posts.EventID "
			+"WHERE Posts.Pinned!='false' AND Posts.OrgID="+req.query.id +" AND Posts.private='false' "
		+"UNION ALL "
		+"SELECT Posts.*, Events.*, HEX(Posts.EventID) AS TrueEventID, HEX(Posts.PostID) AS TruePostID, HEX(Posts.OrgID) AS TrueOrgID FROM Posts "
			+"RIGHT JOIN Events "
			+"ON Events.EventID=Posts.EventID "
			+"WHERE Posts.EventID IS NULL AND Posts.Pinned!='false' AND Posts.OrgID="+req.query.id +"  AND Posts.private='false' "


			,
		"SELECT Posts.*, Events.*, HEX(Posts.EventID) AS TrueEventID, HEX(Posts.PostID) AS TruePostID, HEX(Posts.OrgID) AS TrueOrgID FROM Posts "
			+"LEFT JOIN GroupJoin ON GroupJoin.OrgID=Posts.OrgID "
			+"LEFT JOIN Events "
			+"ON Events.EventID=Posts.EventID "
			+"WHERE Posts.Pinned='false' AND Posts.OrgID="+req.query.id +" AND Posts.private!='false' AND GroupJoin.UserID=0x"+req.cookies.userID +" "
		+"UNION ALL "
		+"SELECT Posts.*, Events.*, HEX(Posts.EventID) AS TrueEventID, HEX(Posts.PostID) AS TruePostID, HEX(Posts.OrgID) AS TrueOrgID FROM Posts "
			+"LEFT JOIN GroupJoin ON GroupJoin.OrgID=Posts.OrgID "
			+"RIGHT JOIN Events "
			+"ON Events.EventID=Posts.EventID "
			+"WHERE Posts.EventID IS NULL AND Posts.Pinned='false' AND Posts.OrgID="+req.query.id +"  AND Posts.private!='false' AND GroupJoin.UserID=0x"+req.cookies.userID + " "
		+"Union all "

		+"SELECT Posts.*, Events.*, HEX(Posts.EventID) AS TrueEventID, HEX(Posts.PostID) AS TruePostID, HEX(Posts.OrgID) AS TrueOrgID FROM Posts "
			+"LEFT JOIN Events "
			+"ON Events.EventID=Posts.EventID "
			+"WHERE Posts.Pinned='false' AND Posts.OrgID="+req.query.id +" AND Posts.private='false' "
		+"UNION ALL "
		+"SELECT Posts.*, Events.*, HEX(Posts.EventID) AS TrueEventID, HEX(Posts.PostID) AS TruePostID, HEX(Posts.OrgID) AS TrueOrgID FROM Posts "
			+"RIGHT JOIN Events "
			+"ON Events.EventID=Posts.EventID "
			+"WHERE Posts.EventID IS NULL AND Posts.Pinned='false' AND Posts.OrgID="+req.query.id +"  AND Posts.private='false' "
			,
				"SELECT HEX(JoinID) AS TrueJoinID, HEX(EventID) AS TrueEventID, HEX(UserID) AS TruePostID From EventJoin WHERE UserID=0x" + req.cookies.userID
			];
	} else {
		queries=["SELECT Posts.*, Events.*, HEX(Posts.EventID) AS TrueEventID, HEX(Posts.PostID) AS TruePostID, HEX(Posts.OrgID) AS TrueOrgID FROM Posts "
				+"LEFT JOIN Events "
				+"ON Events.EventID=Posts.EventID "
				+"WHERE Posts.Pinned!='false' AND Posts.private='false'"
				+"UNION ALL "
				+"SELECT Posts.*, Events.*, HEX(Posts.EventID) AS TrueEventID, HEX(Posts.PostID) AS TruePostID, HEX(Posts.OrgID) AS TrueOrgID FROM Posts "
				+"RIGHT JOIN Events "
				+"ON Events.EventID=Posts.EventID "
				+"WHERE Posts.EventID IS NULL AND Posts.Pinned!='false' AND Posts.private='false'",

				"SELECT Posts.*, Events.*, HEX(Posts.EventID) AS TrueEventID, HEX(Posts.PostID) AS TruePostID, HEX(Posts.OrgID) AS TrueOrgID FROM Posts "
				+"LEFT JOIN Events "
				+"ON Events.EventID=Posts.EventID "
				+"WHERE Posts.Pinned='false' AND Posts.private='false' "
				+"UNION ALL "
				+"SELECT Posts.*, Events.*, HEX(Posts.EventID) AS TrueEventID, HEX(Posts.PostID) AS TruePostID, HEX(Posts.OrgID) AS TrueOrgID FROM Posts "
				+"RIGHT JOIN Events "
				+"ON Events.EventID=Posts.EventID "
				+"WHERE Posts.EventID IS NULL AND Posts.Pinned='false' AND Posts.private='false'",
				"SELECT *, HEX(EventID) AS TrueEventID FROM EventJoin"
			];
	}
	var miscQueries = ['SELECT *, HEX(BranchOrg.OrgID) AS TrueOrgID FROM BranchOrg WHERE OrgID = ' + req.query.id +' ' ,
	"SELECT Posts.title, Events.startDate, Events.responseCount FROM Posts, Events WHERE Posts.OrgID="+req.query.id + " AND Posts.EventID= Events.EventID ORDER BY Events.startDate ASC LIMIT 3",

	'SELECT *, HEX(BranchOrg.OrgID) AS TrueOrgID FROM BranchOrg INNER JOIN MainOrg ON BranchOrg.MainOrgID = MainOrg.MainOrgID '
	+'WHERE BranchOrg.MainOrgID = (SELECT MainOrgID FROM BranchOrg Where BranchOrg.OrgID = "'+req.query.id + '") '
	+'AND BranchOrg.OrgID != '+req.query.id];

	if (req.cookies.userID) {
		miscQueries.push("SELECT UserLevel FROM GroupJoin WHERE OrgID="+req.query.id + ' AND UserID=0x'+req.cookies.userID + ' ');
	}
	queries = queries.concat(miscQueries);




	connection.query(queries.join(';'), function(err, results) {
		if (err) throw err;


		var JoinedPinned = {};
		var flagPinned = false;
		var Joined = {};
		var flag = false;
		var userLevel;
		var userID;
		var joinedBool = false;

		if (req.cookies.userID) {
			for (let i = 0; i < results[1].length; i++){ // for all posts selected

				if (results[1][i].EventID) { //if its an event
					for (let j = 0; j < results[2].length; j++) { // for all events joined
						if (results[1][i].TrueEventID == results[2][j].TrueEventID){ //if event joined is equal to current event

							Joined[results[1][i].TrueEventID] = '1'; // appened joined [id] : '1'
							flag = true;
						}
					}
					if (!flag) {
						Joined[results[1][i].TrueEventID] = '0';
					}
					flag = false;
				}
			}

			for (let i = 0; i < results[0].length; i++){ // for all posts selected


				if (results[0][i].EventID) { //if its an event
					for (let j = 0; j < results[2].length; j++) { // for all events joined
						if (results[0][i].TrueEventID == results[2][j].TrueEventID){ //if event joined is equal to current event

							JoinedPinned[results[0][i].TrueEventID] = '1'; // appened joined [id] : '1'
							flagPinned = true;
						}
					}
					if (!flagPinned) {
						JoinedPinned[results[0][i].TrueEventID] = '0';
					}
					flagPinned = false;
				}
			}

			if (results[6][0]) {
				userLevel = results[6][0].UserLevel;
				joinedBool=true;
			} else {
				userLevel = -1;
			}
			userID = req.cookies.userID;
		} else {
			userLevel = -1;
			userID = 0;
		}

		res.render(path.join(__dirname, '../public', '3.html'), {

			pinnedData:results[0],
			recentData:results[1],
			joinHistory:Joined,
			PinnedjoinHistory:JoinedPinned,
			OrgData:results[3],
			EventsShortData:results[4],
			RelatedBranches:results[5],
			userLevel: userLevel,
			userID: userID,
			joinedBool: joinedBool
		});
	});

	connection.end();
});

module.exports = router;
