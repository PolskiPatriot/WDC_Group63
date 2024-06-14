const express = require('express');
const router = express.Router();
const path = require('path');

router.post('/', function(req, res) {
    if (req.level == 0) {
        res.sendFile(path.join(__dirname, '../public', '12.html'));
        return;
    } else {
        res.redirect('back');
        return;
    }
});

module.exports = router;