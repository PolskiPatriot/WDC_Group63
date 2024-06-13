const express = require('express');
const router = express.Router();

router.post('/', function(req, res) {
    const email = req.body.email;

    req.pool.getConnection((error, connection) => {
        if (error) {
            res.sendStatus(500);
            return;
        }

        const query = "SELECT * FROM Users WHERE email = ?";
        connection.query(query, [email], function(err, results) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.json(results);
        });
    });
});

module.exports = router;