var express = require('express');
var router = express.Router();
var userManager = require('../utilities/userManager');
var serverURL = require('../utilities/serverURL');
var sendVerificationEmail = require('../utilities/sendVerificationEmail');

router.post('/', function(req, res, next) {
  res.send(JSON.stringify({}));
  var emailAddress = req.body.emailAddress;
  var password = req.body.password;
  userManager.isPasswordCorrect(emailAddress, password)
  .then(isPasswordCorrect => {
    return userManager.updateVerificationToken(emailAddress)
    .then(verificationToken => {
      return sendVerificationEmail(emailAddress, 
                                   verificationToken,
                                   serverURL(req));
    });
  });
});

module.exports = router;
