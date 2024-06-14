var express = require('express');
const path = require('path');
const mysql = require('mysql');
const { error, time } = require('console');
var router = express.Router();

/* GET event edit page. */
router.get('/', function (req, res, next) {
	if (req.level > 2) {
		res.sendFile(path.join(__dirname, '../public', '6.html'));
		return;
	} else {
		res.redirect('back');
		return;
	}
});

router.post('/:id', function (req, res) {
	const connection = mysql.createConnection({
		host: "localhost",
		database: "uDatabase",
		multipleStatements: true
	});

	connection.connect((error) => {
		if (error) {
			res.send(500);
		}
	});
	let postTime = new Date;
	postTime = postTime.toISOString().slice(0, 19).replace("T", ' ');


	let time = new Date(req.body.date + " " + req.body.time);
	let endTime = time;
	endTime.setHours(time.getHours() + parseInt(req.body.duration));
	time = time.toISOString().slice(0, 19).replace("T", ' ');
	endTime = endTime.toISOString().slice(0, 19).replace("T", ' ');


	let pinned = 0;
	if (req.body.pinned == "on") pinned = 1;

	let visibility = 0;
	if (req.body.answer != "0") visibility = 1;

	var queries = ['INSERT INTO Events VALUES(UNHEX(REPLACE(UUID(), "-", "")), '
		+ '"' + time + '", '
		+ '"' + endTime + '", '
		+ '"' + req.body.address + '", '
		+ '"0")'
		, 'INSERT INTO Posts VALUES(UNHEX(REPLACE(UUID(), "-", "")), '
		+ ' (SELECT EventID from Events limit 1),'
		+ ' (SELECT OrgID from BranchOrg where orgID="' + req.params.id + '"),'
		+ ' NULL, '
		+ '"' + visibility + '", '
		+ '"' + pinned + '", '
		+ '"' + req.body.title + '", '
		+ '"' + req.body.content + '", '
		+ '"' + postTime + '", '
	+ '"0")'
	];

	/*connection.query(queries.join(';'), function(err, results) {
		if (err) throw err;

	});*/



	res.redirect('/groupManager');
	connection.end();
});

module.exports = router;
