var express = require('express');
const path = require('path');
const mysql = require('mysql');
const { error } = require('console');
const { exit } = require('process');


var router = express.Router();

router.get("/like", function(req, res, next) {
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
	var queries=["SELECT likeCount FROM Posts WHERE PostID="+req.query.id,
				"UPDATE Posts SET likeCount = likeCount + 1 WHERE PostID="+req.query.id
];

	connection.query(queries.join(';'), function(err, results) {
		if (err) throw err;
		res.status(200).send(String(results[0][0].likeCount+1));
	});

	connection.end();


});

router.get("/unLike", function(req, res, next) {
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
	var queries=["SELECT likeCount FROM Posts WHERE PostID="+req.query.id,
				"UPDATE Posts SET likeCount = likeCount - 1 WHERE PostID="+req.query.id
];

	connection.query(queries.join(';'), function(err, results) {
		if (err) throw err;
		res.status(200).send(String(results[0][0].likeCount-1));
	});

	connection.end();


});


router.get('/rsvp', function (req, res, next) {
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
	//req.query.id and req.cookies.userid
	if (req.cookies.userID) {

		var testqueries = ['UPDATE Events e SET e.responseCount = e.responseCount + 1 WHERE NOT EXISTS (SELECT EventID, UserID FROM EventJoin j WHERE j.EventID = ' + req.query.id + ' AND j.UserID = 0x' + req.cookies.userID + ') AND e.EventID='+req.query.id,
		'INSERT INTO EventJoin SELECT'
		+' UNHEX(REPLACE(UUID(), "-", "")), ' +  req.query.id + ', 0x' + req.cookies.userID + ''
		+' WHERE NOT EXISTS (Select * from EventJoin Where EventJoin.EventID = ' + req.query.id + ' AND EventJoin.UserID = 0x' + req.cookies.userID + ')',

		"SELECT responseCount from Events WHERE EventID = " + req.query.id
		];

		connection.query(testqueries.join(';'), function(err, results) {
			res.status(200).send(String(results[2][0].responseCount) + ' Attending');
			});
	} else {
		res.status(204).send("0");
	}



	connection.end();
});


router.get('/decline', function(req, res, next){
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

	if (req.cookies.userID) {
		var testqueries = ['UPDATE Events e SET e.responseCount = e.responseCount - 1 WHERE EXISTS (SELECT EventID, UserID FROM EventJoin j WHERE j.EventID = ' + req.query.id + ' AND j.UserID = 0x' + req.cookies.userID + ') AND e.EventID='+req.query.id,
		"SELECT responseCount from Events WHERE EventID = " + req.query.id,
		'DELETE FROM EventJoin WHERE EventJoin.EventID = ' + req.query.id + ' AND EventJoin.UserID = 0x' + req.cookies.userID
		];

		connection.query(testqueries.join(';'), function(err, results) {
			res.status(200).send(String(results[1][0].responseCount) + ' Attending');
		});
	} else {
		res.status(204).send("0");
	}

});


router.get('/delete', function(req, res, next){
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
	var queries = ["SELECT *, HEX(EventID) AS TrueEventID from Posts where Posts.PostID=0x"+req.query.id];

	connection.query(queries.join(';'), function(err, results) {

		console.log(results);
		if (results[0].EventID){
			queries = ['DELETE FROM Events WHERE Events.EventID = 0x' + results[0].TrueEventID + ''];
			console.log("event");
		} else {
			var queries = ["DELETE from Posts where Posts.PostID=0x"+req.query.id];
			console.log("update");
		}
		connection.query(queries.join(';'), function (err, results) {
			if (err) {
				console.log(err);
				res.sendStatus(500);
			}
			console.log(results);
		});

		res.status(200).send("ok");
	});
});


router.get('/join', function(req, res, next) {
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

	if (!req.cookies.userID){
		res.status(204).send("notOK");
		return;
	} else {
		console.log("Stay");
	}
	console.log("test");
	var queries = ['INSERT INTO GroupJoin VALUES(UNHEX(REPLACE(UUID(), "-", "")),  '
				+"0x" +req.query.OrgID + ", "
				+req.query.Userid + ", 1)",
				'UPDATE BranchOrg SET memberCount=memberCount + 1 WHERE OrgID=' +"0x" +req.query.OrgID ];

	connection.query(queries.join(';'), function(err, results) {

		res.status(200).send("ok");
	});
});

router.get('/leave', function(req, res, next) {
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

	var queries = ["DELETE FROM GroupJoin WHERE OrgID=0x"+req.query.OrgID +" AND UserID="+req.query.Userid,
				'UPDATE BranchOrg SET memberCount=memberCount -1 WHERE OrgID=' +"0x" +req.query.OrgID ];

	console.log(queries);
	connection.query(queries.join(';'), function(err, results) {

		res.status(200).send("ok");
	});

});

module.exports = router;