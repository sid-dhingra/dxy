var express = require('express');
var router = express.Router();
var path = require('path');
var formValidator = require('../utilities/formValidator');
var userManager = require('../utilities/userManager');

router.get('/', function(req, res, next) {
  var pagePath = path.join(__dirname, '..', 'pages', 'reset_password.html');
  res.sendFile(pagePath);
});

router.post('/', function(req, res, next) {
  var password = req.body.password;
  var passwordResetToken = req.body.passwordResetToken;
  console.log(password)
  if (formValidator.isValidPassword(password) === false) {
    res.send(JSON.stringify({
      error: 'invalid password format'
    }));
    return;
  }
  userManager.resetPassword(passwordResetToken, password)
  .then(() => {
    res.send(JSON.stringify({}));
  })
  .catch(error => {
    res.send(JSON.stringify({
      error: 'unknown error'
    }));
  });
});

module.exports = router;
