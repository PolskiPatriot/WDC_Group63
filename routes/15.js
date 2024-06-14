const express = require('express');
const path = require('path');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    if (req.level > 0) {
        res.sendFile(path.join(__dirname, '../public', '15.html'));
        return;
    } else {
        res.redirect('/');
        return;
    }
});

router.get('/username', (req, res) => {
    const userId = req.cookies.userID;
    if (!userId) {
        return res.status(401).send({ message: 'Error' });
    }
    req.pool.getConnection((error, connection) => {
        if (error) {
            return res.status(500).send({ message: 'Error getting connection from pool' });
        }
        const query = 'SELECT givenName, About FROM Users WHERE UserID = UNHEX(?)';
        connection.query(query, [userId], (err, results) => {
            connection.release();
            if (err) {
                return res.status(500).send({ err });
            }
            if (results.length === 0) {
                return res.status(404).send({ message: 'User not found' });
            }
            const username = results[0].givenName || 'No Username!';
            const about = results[0].About || 'Your about content is empty!';
            res.status(200).send({ username, about });
        });
    });
});

router.post('/update-profile', (req, res) => {
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
    req.pool.getConnection((error, connection) => {
        if (error) {
            return res.status(500).send({ message: 'Error getting connection from pool' });
        }
        connection.query(query, [value, userId], (err) => {
            connection.release();
            if (err) {
                return res.status(500).send({ message: 'Error updating data' });
            }
            res.status(200).send({ message: 'Profile updated successfully' });
        });
    });
});

module.exports = router;