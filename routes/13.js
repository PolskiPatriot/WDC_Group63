const express = require('express');
const path = require('path');
const crypto = require('crypto');
const argon2 = require('argon2');
const { generateFromEmail } = require("unique-username-generator");
var router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('119246077266-jsdsl8ks1ps352c9rkarvjt66nafidno.apps.googleusercontent.com');

/* GET home page. */
router.get('/', function (req, res) {
    if (req.level == 0) {
        res.sendFile(path.join(__dirname, '../public', '13.html'));
        return;
    } else {
        res.redirect('back');
        return;
    }
});

// Google signup
router.post('/google-signup', async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '119246077266-jsdsl8ks1ps352c9rkarvjt66nafidno.apps.googleusercontent.com'
        });
        const payload = ticket.getPayload();
        const userId = crypto.randomBytes(16);
        const username = generateFromEmail(payload.email, 3);
        const query = 'INSERT INTO Users (UserID, givenName, familyName, email) VALUES (?, ?, ?, ?)';
        console.log('USERID inserting data: ' + payload.given_name);
        req.pool.getConnection((error, connection) => {
            if (error) {
                return res.status(500).send('Error getting connection');
            }
            connection.query(query, [userId, payload.given_name, payload.family_name, payload.email], (err, results) => {
                connection.release();
                if (err) {
                    return res.status(500).send('Error inserting data');
                }
                res.cookie('userID', userId.toString('hex'), { httpOnly: true });
                res.status(200).send('User registered successfully');
            });
        });
    } catch (err) {
        res.status(500).send('Error verifying token');
    }
});

// Normal signup
router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const userId = crypto.randomBytes(16);
        const hashedPassword = await argon2.hash(password);
        const username = generateFromEmail(email, 3);
        const query = 'INSERT INTO Users (UserID, givenName, familyName, email, password) VALUES (?, ?, ?, ?, ?)';
        console.log('USERID inserting data: ' + userId);
        req.pool.getConnection((error, connection) => {
            if (error) {
                return res.status(500).send('Error getting connection');
            }
            connection.query(query, [userId, firstName, lastName, email, hashedPassword], (err) => {
                connection.release();
                if (err) {
                    return res.status(500).send('Error inserting data');
                }
                res.cookie('userID', userId.toString('hex'), { httpOnly: true });
                res.status(200).send('User registered successfully');
            });
        });
    } catch (err) {
        res.status(500).send('Error hashing password');
    }
});

module.exports = router;