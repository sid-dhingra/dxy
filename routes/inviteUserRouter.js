var express = require('express');
var router = express.Router();
var path = require('path');
var formValidator = require('../utilities/formValidator');
var userManager = require('../utilities/userManager');

router.get('/', function(req, res, next) {
  var pagePath = path.join(__dirname, '..', 'pages', 'invitation.html');
  res.sendFile(pagePath);
});

router.post('/', function(req, res, next) {
  var invitationToken = req.body.invitationToken;
  var password = req.body.password;
  if (formValidator.isValidPassword(password) === false) {
    res.send(JSON.stringify({
      error: 'invalid new password format'
    }));
    return;
  }
  userManager.acceptInvitation(invitationToken, password)
  .then(emailAddress => {
    res.send(JSON.stringify({
      emailAddress: emailAddress
    }));
  })
  .catch(error => {
    res.send(JSON.stringify({
      error: 'unknown error'
    }));
  });
});

module.exports = router;
