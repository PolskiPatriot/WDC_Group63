const express = require('express');
const path = require('path');
const crypto = require('crypto');
const argon2 = require('argon2');
const { generateFromEmail } = require("unique-username-generator");
const { OAuth2Client } = require('google-auth-library');
const e = require('express');
const client = new OAuth2Client('119246077266-568pi1sojct64fdrvn10enalph5aqgg3.apps.googleusercontent.com');
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

// Basic google login
router.post('/google-login', async (req, res) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '119246077266-jsdsl8ks1ps352c9rkarvjt66nafidno.apps.googleusercontent.com'
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
                return res.status(500);
            }

            if (results.length === 0) {
                return res.status(401);
            }
            const userId = results[0].UserID;
            res.cookie('userID', userId.toString('hex'), { httpOnly: true });
            res.status(200);
        });
    });
});

// Basic login
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    const query = 'SELECT UserID, password FROM Users WHERE email = ?';

    try {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.query(query, [email]);
            connection.release();

            if (results.length === 0) {
                return res.status(401);
            }
            const storedPassword = results[0].password;
            const userId = results[0].UserID;
            if (await argon2.verify(storedPassword, password)) {
                res.cookie('userID', userId.toString('hex'), { httpOnly: true });
                return res.status(200);
            } else {
                return res.status(401);
            }
        } catch (err) {
            connection.release();
            res.status(500);
        }
    } catch (err) {
        res.status(500);
    }
});

module.exports = router;