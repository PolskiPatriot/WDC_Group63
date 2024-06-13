const express = require('express');
const path = require('path');
var router = express.Router();

router.get('/', function (req, res, next) {
    // check greatest permissions

    // if not signed in, redirect
    if (typeof req.cookies.userID === 'undefined') {
        res.send('relog');
    } else {
        req.pool.getConnection((error, connection) => {
            if (error) {
                res.send(500);
            }
            var query = "SELECT UserLevel FROM GroupJoin WHERE UserID = UNHEX('" + req.cookies.userID + "' ORDER BY UserLevel ASC";
            console.log(query);
            connection.query(query, function (err, UserLevel) {
                connection.release();
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                console.log(UserLevel);
            });
        });
        res.sendFile(path.join(__dirname, '../public', 'dropdown.html'));
    }
});

module.exports = router;

