const express = require('express');
const path = require('path');
const crypto = require('crypto');
const argon2 = require('argon2');
const { generateFromEmail } = require("unique-username-generator");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('119246077266-568pi1sojct64fdrvn10enalph5aqgg3.apps.googleusercontent.com');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public', '10.html'));
});

router.post('/google-login', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '119246077266-568pi1sojct64fdrvn10enalph5aqgg3.apps.googleusercontent.com'
        });
        const payload = ticket.getPayload();

        const query = 'SELECT UserID FROM Users WHERE email = ?';

        req.pool.getConnection((error, connection) => {
            if (error) {
                console.error('Error getting connection from pool: ' + error);
                return res.status(500).send('Error getting connection from pool');
            }

            connection.query(query, [payload.email], (err, results) => {
                connection.release();

                if (err) {
                    console.error('Error fetching data: ' + err);
                    return res.status(500).send('Error fetching data');
                }

                if (results.length === 0) {
                    return res.status(401).send('User not found');
                }

                const userId = results[0].UserID;
                res.cookie('userID', userId, { httpOnly: true, maxAge: 900000 });
                res.status(200).send('Login successful');
            });
        });
    } catch (error) {
        console.error('Error verifying token: ' + error);
        res.status(500).send('Error verifying token');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT UserID, password FROM Users WHERE email = ?';

    req.pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error getting connection from pool: ' + error);
            return res.status(500).send({ success: false, message: 'Error getting connection from pool' });
        }

        connection.query(query, [email], async (err, results) => {
            connection.release();
            if (err) {
                console.error('Error fetching data: ' + err);
                return res.status(500).send({ success: false, message: 'Error fetching data' });
            }

            if (results.length === 0) {
                return res.status(401).send({ success: false, message: 'Invalid email or password' });
            }

            const storedPassword = results[0].password;
            const userId = results[0].UserID;

            try {
                if (await argon2.verify(storedPassword, password)) {
                    res.cookie('userID', userId.toString('hex'), { httpOnly: true, maxAge: 900000 });
                    return res.status(200).send({ success: true, message: 'Login successful' });
                } else {
                    return res.status(401).send({ success: false, message: 'Invalid email or password' });
                }
            } catch (err) {
                console.error('Error verifying password: ' + err);
                return res.status(500).send({ success: false, message: 'Error verifying password' });
            }
        });
    });
});

module.exports = router;