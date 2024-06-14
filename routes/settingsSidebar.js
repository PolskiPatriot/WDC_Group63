const express = require('express');
const path = require('path');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public', 'dropdown.html'));
});
router.get('/getContent', function (req, res, next) {

    // if not signed in, redirect
    if (typeof req.cookies.userID === 'undefined') {
        res.send('relog');
    } else {
        // check greatest permissions of user
        req.pool.getConnection((error, connection) => {
            if (error) {
                res.send(500);
            }
            var query = "SELECT UserLevel FROM GroupJoin WHERE UserID = UNHEX('" + req.cookies.userID + "') ORDER BY UserLevel DESC LIMIT 1";
            connection.query(query, function (err, UserLevel) {
                connection.release();
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                res.send(JSON.stringify(UserLevel[0].UserLevel));
                return;
            });
        });
    }
});
module.exports = router;

