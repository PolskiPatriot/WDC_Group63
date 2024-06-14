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
            var query = "SELECT UserLevel FROM GroupJoin WHERE UserID = UNHEX(?) ORDER BY UserLevel DESC LIMIT 1";
            connection.query(query, [req.cookies.userID], function (err, UserLevel) {
                connection.release();
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                if (typeof UserLevel[0] === 'undefined') {
                    res.send('1');
                } else {
                    res.send(JSON.stringify(UserLevel[0].UserLevel));
                    return;
                }
            });
        });
    }
});


router.post('/delete-profile', function (req, res) {
    if (typeof req.cookies.userID === 'undefined') {
        res.send('relog');
    } else {
        req.pool.getConnection((error, connection) => {
            if (error) {
                res.sendStatus(500);
                return;
            }
            var query = "DELETE FROM Users WHERE UserID = UNHEX(?)";
            connection.query(query, [req.cookies.userID], function (err, result) {
                connection.release();
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                res.clearCookie('userID');
                res.status(200).send('Profile deleted');
            });
        });
    }
});

module.exports = router;
