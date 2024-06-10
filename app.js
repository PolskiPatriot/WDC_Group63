const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const crypto = require('crypto');
const argon2 = require('argon2');
const { OAuth2Client } = require('google-auth-library');
const cookieParser = require('cookie-parser');
const { generateFromEmail } = require("unique-username-generator");
var logger = require('morgan');


const app = express();
const port = 3000;

var mainFeedRouter = require('./routes/1');
var groupRouter = require('./routes/2');
var groupManagerRouter = require('./routes/3');
var viewUserRouter = require('./routes/4');
var signinRouter = require('./routes/10');
var signinRouter = require('./routes/11');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'password',
    database: 'uDatabase'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database ' + err);
        return;
    }
    console.log('Connected to MySQL database');
});

const client = new OAuth2Client('119246077266-568pi1sojct64fdrvn10enalph5aqgg3.apps.googleusercontent.com');

app.post('/google-signup', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '119246077266-568pi1sojct64fdrvn10enalph5aqgg3.apps.googleusercontent.com'
        });
        const payload = ticket.getPayload();

        const userId = crypto.randomBytes(16);
        const username = generateFromEmail(
            payload.email,
            3
          );
        const query = 'INSERT INTO Users (UserID, givenName, familyName, email) VALUES (?, ?, ?, ?)';
        console.log('USERID inserting data: ' + payload.given_name);

        db.query(query, [userId, payload.given_name, payload.family_name, payload.email], (err, results) => {
            if (err) {
                console.error('Error inserting data: ' + err);
                res.status(500).send('Error inserting data');
                return;
            }
            res.cookie('userID', userId.toString('hex'), { httpOnly: true, maxAge: 900000 });
            res.status(200).send('User registered successfully');
        });
    } catch (error) {
        console.error('Error verifying token: ' + error);
        res.status(500).send('Error verifying token');
    }
});

app.post('/google-login', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '119246077266-568pi1sojct64fdrvn10enalph5aqgg3.apps.googleusercontent.com'
        });
        const payload = ticket.getPayload();

        const query = 'SELECT UserID FROM Users WHERE email = ?';
        db.query(query, [payload.email], (err, results) => {
            if (err) {
                console.error('Error fetching data: ' + err);
                res.status(500).send('Error fetching data');
                return;
            }

            if (results.length === 0) {
                res.status(401).send('User not found');
                return;
            }

            const userId = results[0].UserID;
            res.cookie('userID', userId, { httpOnly: true, maxAge: 900000 });
            res.status(200).send('Login successful');
        });
    } catch (error) {
        console.error('Error verifying token: ' + error);
        res.status(500).send('Error verifying token');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT UserID, password FROM Users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
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

app.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const userId = crypto.randomBytes(16);

    try {
        const hashedPassword = await argon2.hash(password);
        const username = generateFromEmail(
            email,
            3
          );
        const query = 'INSERT INTO Users (UserID, givenName, familyName, email, password) VALUES (?, ?, ?, ?, ?)';
        console.log('USERID inserting data: ' + firstName);
        db.query(query, [userId, firstName, lastName, email, hashedPassword], (err) => {
            if (err) {
                console.error('Error inserting data: ' + err);
                res.status(500).send('Error inserting data');
                return;
            }
            res.cookie('userID', userId.toString('hex'), { httpOnly: true, maxAge: 900000 });
            res.status(200).send('User registered successfully');
        });
    } catch (err) {
        console.error('Error hashing password: ' + err);
        res.status(500).send('Error with password');
    }
});

app.post('/update-contact-details', (req, res) => {
    const userId = req.cookies.userID;
    const { firstName, lastName, email, phonenumber } = req.body;

    if (!userId) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
    const phoneBinary = Buffer.from(phonenumber, 'utf8'); // I got this from https://stackoverflow.com/questions/25223776/node-buffers-from-utf8-to-binary

    const query = 'UPDATE Users SET givenName = ?, familyName = ?, email = ?, phonenumber = ? WHERE UserID = UNHEX(?)';
    db.query(query, [firstName, lastName, email, phoneBinary, userId], (err) => {
        if (err) {
            console.error('Error updating data: ' + err);
            return res.status(500).send({ message: 'Error updating data' });
        }
        res.status(200).send({ message: 'Contact details updated successfully' });
    });
});

app.get('/contact-details', (req, res) => {
    const userId = req.cookies.userID;
    if (!userId) {
        return res.status(401).send({ message: 'Error' });
    }
    const query = 'SELECT givenName, familyName, email, phonenumber FROM Users WHERE UserID = UNHEX(?)';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching data: ' + err);
            return res.status(500).send({ err });
        }

        if (results.length === 0) {
            return res.status(404).send({ err });
        }

        const givenName = results[0].givenName;
        const familyName = results[0].familyName;
        const email = results[0].email;
        const phonenumber = results[0].phonenumber;

        res.status(200).send({ givenName, familyName, email, phonenumber });
    });
});

app.get('/username', (req, res) => {
    const userId = req.cookies.userID;
    if (!userId) {
        return res.status(401).send({ message: 'Error' });
    }
    console.log('USERID FOR USERNAME: ' + userId);
    const query = 'SELECT givenName, About FROM Users WHERE UserID = UNHEX(?)';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching data: ' + err);
            return res.status(500).send({ err });
        }

        if (results.length === 0) {
            return res.status(404).send({ err });
        }

        const username = results[0].givenName;
        const about = results[0].About || 'Your about content is empty!'
        res.status(200).send({ username, about });
    });
});



app.post('/update-profile', (req, res) => {
    const userId = req.cookies.userID;
    const { field, value } = req.body;

    if (!userId) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    let query;
    if (field === 'username') {
        query = 'UPDATE Users SET givenName = ? WHERE UserID = UNHEX(?)';
    } else if (field === 'descProfile') {
        query = 'UPDATE Users SET About = ? WHERE UserID = UNHEX(?)';
    } else {
        return res.status(400).send({ message: 'Invalid field' });
    }

    db.query(query, [value, userId], (err) => {
        if (err) {
            console.error('Error updating data: ' + err);
            return res.status(500).send({ message: 'Error updating data' });
        }
        res.status(200).send({ message: 'Profile updated successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', mainFeedRouter);
app.use('/group', groupRouter);
app.use('/groupManager', groupManagerRouter);
app.use('/Users', viewUserRouter);
module.exports = app;