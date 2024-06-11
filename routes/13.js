const express = require('express');
const path = require('path');
const crypto = require('crypto');
const argon2 = require('argon2');
const { generateFromEmail } = require("unique-username-generator");
var router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('119246077266-568pi1sojct64fdrvn10enalph5aqgg3.apps.googleusercontent.com');

/* GET home page. */
router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../public', '13.html'));
});

router.post('/google-signup', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '119246077266-568pi1sojct64fdrvn10enalph5aqgg3.apps.googleusercontent.com'
        });
        const payload = ticket.getPayload();


        const userId = crypto.randomBytes(16);
        const username = generateFromEmail(payload.email, 3);
        const query = 'INSERT INTO Users (UserID, givenName, familyName, email) VALUES (?, ?, ?, ?)';
        console.log('USERID inserting data: ' + payload.given_name);

        req.pool.getConnection((error, connection) => {
            if (error) {
                console.error('Error getting connection from pool: ' + error);
                return res.status(500).send('Error getting connection from pool');
            }

            connection.query(query, [userId, payload.given_name, payload.family_name, payload.email], (err, results) => {
                connection.release();

                if (err) {
                    console.error('Error inserting data: ' + err);
                    return res.status(500).send('Error inserting data');
                }
                res.cookie('userID', userId.toString('hex'), { httpOnly: true, maxAge: 900000 });
                res.status(200).send('User registered successfully');
            });
        });
    } catch (error) {
        console.error('Error verifying token: ' + error);
        res.status(500).send('Error verifying token');
    }
});

router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const userId = crypto.randomBytes(16);

    try {
        const hashedPassword = await argon2.hash(password);
        const username = generateFromEmail(email, 3);
        const query = 'INSERT INTO Users (UserID, givenName, familyName, email, password) VALUES (?, ?, ?, ?, ?)';
        console.log('USERID inserting data: ' + firstName);

        req.pool.getConnection((error, connection) => {
            if (error) {
                console.error('Error getting connection from pool: ' + error);
                return res.status(500).send('Error getting connection from pool');
            }

            connection.query(query, [userId, firstName, lastName, email, hashedPassword], (err) => {
                connection.release();

                if (err) {
                    console.error('Error inserting data: ' + err);
                    return res.status(500).send('Error inserting data');
                }
                res.cookie('userID', userId.toString('hex'), { httpOnly: true, maxAge: 900000 });
                res.status(200).send('User registered successfully');
            });
        });
    } catch (err) {
        console.error('Error hashing password: ' + err);
        res.status(500).send('Error with password');
    }
});

module.exports = router;