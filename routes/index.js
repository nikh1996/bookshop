var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "Papers N' Parchments" });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: "Login - Papers N' Parchments" });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: "Signup - Papers N' Parchments" });
});

module.exports = router;
