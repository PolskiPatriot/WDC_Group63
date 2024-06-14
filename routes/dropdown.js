const express = require('express');
const path = require('path');
var router = express.Router();

router.get('/', function (req, res, next) {
    // need to be AN ADMIN
    res.sendFile(path.join(__dirname, '../public', 'dropdown.html')).send("logged");
});

router.get('/logout', function (req, res) {
    if (req.cookies.userID) {
        res.clearCookie("userID");
        res.send("OK");
    } else
        res.send("already logged out");
});

router.get('/loginStatus', function (req, res) {
    if (req.cookies.userID) {
        res.send("logged");
    } else {
        res.send("notLogged");
    }
});

module.exports = router;