var express = require('express');
const path = require('path');
const mysql = require('mysql');
const { error, time } = require('console');
const nodemailer = require('nodemailer');
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

	var queries = ["SELECT HEX(OrgID) AS TrueOrgID from BranchOrg WHERE OrgID=0x"+req.query.id];

	if (req.query.EventID) {
		queries.push ("SELECT *, HEX(Posts.EventID) as TrueEventID, HEX(Posts.PostID) as TruePostID  FROM Posts INNER JOIN Events ON Events.EventID=Posts.EventID WHERE Posts.EventID="+req.query.EventID);
	} else {
		queries.push ("SELECT * FROM Posts");
	}

	connection.query(queries.join(';'), function(err, results) {
		if (err) throw err;

		if (req.query.EventID) {
			res.render(path.join(__dirname, '../public', 'EditEvent.html'), {
				OrgID: results[0],
				EventInfo:results[1]
			});
		} else {
		res.render(path.join(__dirname, '../public', '6.html'), {
			OrgID: results[0]
		});
	}
	});

});

router.post('/', function(req, res) {



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


	let postTime = new Date;
	postTime = postTime.toISOString().slice(0, 19).replace("T", ' ');
	let time = new Date(req.body.date + " " + req.body.time);
	var endTime = new Date(req.body.date + " " + req.body.time);
	endTime.setHours(endTime.getHours()+ parseInt(req.body.duration));
	time = time.toISOString().slice(0, 19).replace("T", ' ');
	endTime = endTime.toISOString().slice(0, 19).replace("T", ' ');


	let pinned = 0;
	if (req.body.pinned == "on") pinned = 1;

	let visibility = 0;
	if (req.body.answer != "0") visibility = 1;

	var queries;
	if (req.query.EventID) {
		queries=[ 'UPDATE Events SET '
				+ 'startDate="' + time + '", '
				+ 'endDate="' + endTime + '", '
				+ 'location="' + req.body.address + '" '
				+ ' WHERE EventID=0x'+req.query.EventID
				,'UPDATE Posts SET '
				+ 'private="' + visibility + '", '
				+ 'pinned="' + pinned + '", '
				+ 'title="' + req.body.title + '", '
				+ 'content="' + req.body.content + '" '
				+ 'WHERE EventID=0x'+req.query.EventID];

	} else {
		queries=[ 'INSERT INTO Events VALUES(UNHEX(REPLACE(UUID(), "-", "")), '
				+ '"' + time + '", '
				+ '"' + endTime + '", '
				+ '"' + req.body.address + '", '
				+ '"0")'
				,'INSERT INTO Posts VALUES(UNHEX(REPLACE(UUID(), "-", "")), '
				+ ' (SELECT EventID from Events limit 1),'
				+ ' (SELECT OrgID from BranchOrg where OrgID=0x' + req.query.id + '),'
				+ ' NULL, '
				+ '"' + visibility + '", '
				+ '"' + pinned + '", '
				+ '"' + req.body.title + '", '
				+ '"' + req.body.content + '", '
				+ '"' + postTime + '", '
				+ '"0")',
				'SELECT email FROM GroupJoin RIGHT JOIN Users ON GroupJoin.UserID=Users.UserID WHERE GroupJoin.OrgID=0x' + req.query.id,
					'SELECT * FROM BranchOrg WHERE OrgId=0x'+req.query.id
				];
	}




	connection.query(queries.join(';'), function(err, results) {
		if (err) throw err;
		if (!req.query.EventID) {
			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: "untitledmediaservice@gmail.com",
					pass: "cuhd eeuy kawm tqlm"
				}
			});
			var emails = [];
			for (var i = 0; i < results[2].length; i++) {
				emails.push(results[2][i].email);
			}
			var mailOptions = {
				from: 'untitledmediaservice@gmail.com',
				to: 'undisclosed: <example@untitled.com>',
				bcc: emails,
				subject: results[3][0].orgName + ": " + req.body.title,
				text: results[3][0].orgName + ' Has Posted a new Event: ' + req.body.title + "\n " +req.body.content + '\n\nThanks, \n The Untitled Team'
			};

			transporter.sendMail(mailOptions, function(err, info) {
				if (err) throw err;

			});
		}
	});
	res.redirect('/groupManager?id=0x' + req.query.id);
	connection.end();
});

module.exports = router;


//cuhd eeuy kawm tqlm