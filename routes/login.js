const express = require('express');
const router = express.Router();

/* GET test listing. */
router.get('/', function (req, res, next) {
    /* view로 데이터 넘기기 */
    res.render('login.html', {
        title: 'LOGIN',
        length: 5
    });
});
module.exports = router;