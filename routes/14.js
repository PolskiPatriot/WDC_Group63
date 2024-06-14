var express = require('express');
var router = express.Router();
const path = require('path');

router.get('/', function (req, res, next) {
    if (!(typeof req.cookies.userID === 'undefined')) {
        res.redirect('/');
    } else {
        res.sendFile(path.join(__dirname, '../public', '14.html'));
    }
});

router.get('/getEventsForMonth', function(req, res, next) {
    var userID = req.cookies.userID;
    var month = req.query.month;
    var year = req.query.year;

    if (!userID) {
        return res.status(401).send('User not authenticated');
    }

    req.pool.getConnection(function(err, connection) {
        if (err) {
            return next(err);
        }
        var startDate = new Date(year, month - 1, 1).toISOString().slice(0, 10);
        var endDate = new Date(year, month, 0).toISOString().slice(0, 10);
        var query = `
            SELECT Events.EventID, Events.startDate, Events.endDate, Events.location, HEX(Events.EventID) as TrueEventID
            FROM Events
            JOIN EventJoin ON Events.EventID = EventJoin.EventID
            WHERE EventJoin.UserID = UNHEX(?) AND (
                (Events.startDate BETWEEN ? AND ?) OR
                (Events.endDate BETWEEN ? AND ?)
            )
        ;
        `;
        connection.query(query, [userID, startDate, endDate, startDate, endDate], function(error, results) {
            connection.release();
            if (error) {
                return next(error);
            }
            res.json(results);
        });
    });
});

module.exports = router;