const express = require('express');
const router = express.Router();
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const argon2 = require('argon2');

router.get('/', function (req, res) {
    if (req.level == 0) {
        res.sendFile(path.join(__dirname, '../public', '11.html'));
        return;
    } else {
        res.redirect('back');
        return;
    }
});

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'untitledmediaservice@gmail.com',
        pass: ' cuhd eeuy kawm tqlm'
    }
});

router.post('/sendEmail', function(req, res) {
    const email = req.body.email;
    req.pool.query('SELECT * FROM Users WHERE email = ? AND password IS NOT NULL', [email], function(error, results) {
        if (error) {
            return res.status(500).json({ success: false, message: 'Database query error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Email not found OR Email is associated to existing Google Account' });
        }
        const resetPassword = crypto.randomBytes(32).toString('hex');
        res.cookie('resetCookie', `${email}:${resetPassword}`, { httpOnly: true, secure: true, sameSite: 'Strict' });
        const mailOptions = {
            from: 'wdc63transporter@gmail.com',
            to: email,
            subject: 'Backup Password Reset',
            text: `Please use the following code to reset your password: ` +resetPassword
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                return res.status(500).json({ success: false, message: 'Error sending email' });
            } else {
                return res.status(200).json({ success: true, message: 'Email sent' });
            }
        });
    });
});

module.exports = router;