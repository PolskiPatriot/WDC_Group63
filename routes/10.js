const express = require('express');
const path = require('path');
const crypto = require('crypto');
const argon2 = require('argon2');
const { generateFromEmail } = require("unique-username-generator");
const { OAuth2Client } = require('google-auth-library');
const e = require('express');
const client = new OAuth2Client('119246077266-jsdsl8ks1ps352c9rkarvjt66nafidno.apps.googleusercontent.com');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.level == 0) {
        res.sendFile(path.join(__dirname, '../public', '10.html'));
        return;
    } else {
        res.redirect('back');
        return;
    }
});

router.post('/google-login', async (req, res) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '119246077266-jsdsl8ks1ps352c9rkarvjt66nafidno.apps.googleusercontent.com',
    });
    const payload = ticket.getPayload();
    const query = 'SELECT UserID FROM Users WHERE email = ?';
    req.pool.getConnection((error, connection) => {
        if (error) {
            return res.status(500);
        }
        connection.query(query, [payload.email], (err, results) => {
            connection.release();

            if (err) {
                return res.status(500).json({ success: false });
            }

            if (results.length === 0) {
                return res.status(401).json({ success: false });
            }
            const userId = results[0].UserID;
            res.cookie('userID', userId.toString('hex'), { httpOnly: true });
            res.status(200).json({ success: true });
        });
    });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT UserID, password FROM Users WHERE email = ?';
    req.pool.getConnection((error, connection) => {
        if (error) {
            return res.status(500);
        }
        connection.query(query, [email], async (err, results) => {
            connection.release();
            if (err) {
                return res.status(500);
            }
            if (results.length === 0) {
                return res.status(401);
            }
            const storedPassword = results[0].password;
            const userId = results[0].UserID;
            if (await argon2.verify(storedPassword, password)) {
                res.cookie('userID', userId.toString('hex'), { httpOnly: true });
                return res.status(200).send({ success: true });
            } else {
                return res.status(401).send({ success: false });
            }
        });
    });
});

module.exports = router;