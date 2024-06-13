const express = require('express');
const router = express.Router();
const path = require('path');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../public', '11.html'));
});

router.post('/getEmail', function (req, res) {
    const email = req.body.email;

    req.pool.getConnection((error, connection) => {
        if (error) {
            res.sendStatus(500);
            return;
        }

        const query = "SELECT * FROM Users WHERE email = ?";
        connection.query(query, [email], function (err, results) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.json(results);
        });
    });
});


router.post('/sendEmail', function (req, res) {
    const email = req.body.email;

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Test Email from Node.js',
        text: 'This is a test email sent from a Node.js application using Nodemailer.'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(500).send('Error sending email');
        } else {
            res.status(200).send('Email sent');
        }
    });
});
module.exports = router;