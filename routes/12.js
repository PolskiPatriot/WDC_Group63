const express = require('express');
const router = express.Router();
const path = require('path');
const argon2 = require('argon2');


router.get('/', function(req, res) {
    if (req.level == 0) {
        res.sendFile(path.join(__dirname, '../public', '12.html'));
        return;
    } else {
        res.redirect('back');
        return;
    }
});


// Confirm Password reset
router.post('/confirmReset', function(req, res) {
    const { resetCode, newPassword } = req.body;
    const { resetCookie } = req.cookies;
    const [email, storedResetPassword] = resetCookie.split(':');
    req.pool.getConnection((error, connection) => {
        if (error) {
            return res.status(500);
        }

        connection.query('SELECT * FROM Users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                connection.release();
                return res.status(500);
            }
            if (results.length === 0) {
                connection.release();
                return res.status(404).json({ success: false, message: 'Email not found' });
            }
            if (storedResetPassword !== resetCode) {
                connection.release();
                return res.status(400).json({ success: false, message: 'Invalid reset code' });
            }
            const hashedNewPassword = await argon2.hash(newPassword);
            connection.query('UPDATE Users SET password = ? WHERE UserID = ?', [hashedNewPassword, results[0].UserID], (updateErr) => {
                connection.release();
                if (updateErr) {
                    return res.status(500);
                }
                res.clearCookie('resetCookie');
                return res.status(200).json({ success: true, message: 'Password reset successfully' });
            });
        });
    });
});

module.exports = router;