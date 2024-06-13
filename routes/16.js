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
  res.sendFile(path.join(__dirname, '../public', '16.html'));
});

router.get('/contact-details', (req, res) => {
    const userId = req.cookies.userID;
    if (!userId) {
        return res.status(401).send({ message: 'Error' });
    }

    req.pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error getting connection from pool: ' + error);
            return res.status(500).send('Error getting connection from pool');
        }

        const query = 'SELECT givenName, familyName, email, phonenumber FROM Users WHERE UserID = UNHEX(?)';
        connection.query(query, [userId], (err, results) => {
            connection.release();

            if (err) {
                console.error('Error fetching data: ' + err);
                return res.status(500).send({ err });
            }

            if (results.length === 0) {
                return res.status(404).send({ message: 'No user found' });
            }

            const { givenName, familyName, email, phonenumber } = results[0];
            res.status(200).send({ givenName, familyName, email, phonenumber });
        });
    });
});

router.post('/update-contact-details', (req, res) => {
    const userId = req.cookies.userID;
    const { firstName, lastName, email, phonenumber } = req.body;

    if (!userId) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
    const phoneBinary = Buffer.from(phonenumber, 'utf8'); // I got this from https://stackoverflow.com/questions/25223776/node-buffers-from-utf8-to-binary


    const query = 'UPDATE Users SET givenName = ?, familyName = ?, email = ?, phonenumber = ? WHERE UserID = UNHEX(?)';
    req.pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error getting connection from pool: ' + error);
            return res.status(500).send('Error getting connection from pool');
        }
        connection.query(query, [firstName, lastName, email, phoneBinary, userId], (err) => {
            if (err) {
                console.error('Error updating data: ' + err);
                return res.status(500).send({ message: 'Error updating data' });
            }
            res.status(200).send({ message: 'Contact details updated successfully' });
        });
    });
});



module.exports = router;