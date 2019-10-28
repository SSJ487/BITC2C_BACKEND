var express = require('express');
var router = express.Router();

// socket io 통신
router.get('/', function (req, res, next) {
    res.render('alarm', { title: 'socket tutorial' }); // View 에 chat.jade 를 추가해야됨

});

module.exports = router;