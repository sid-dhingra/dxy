var express = require('express');
var router = express.Router();
var userManager = require('../utilities/userManager');
var serverURL = require('../utilities/serverURL');
var sendVerificationEmail = require('../utilities/sendVerificationEmail');
var formValidator = require('../utilities/formValidator');

router.post('/', function (req, res, next) {
  var logInInfo = req.body;
  var emailAddress = logInInfo.emailAddress;
  var password = logInInfo.password;
  var organization = logInInfo.organization;
  var profileState = logInInfo.state;
  if (formValidator.isValidPassword(password) === false) {
    res.send(JSON.stringify({
      error: 'Password must be at least 6 charactes long and cannot begin or end with a space.'
    }));
    return;
  }
  userManager.doesUserExist(emailAddress)
  .then(doesUserExist => {
    if (doesUserExist === true) {
      return Promise.reject('There is already a user with this email.');
    } else {
      console.log(profileState);
      return userManager.createUser(emailAddress,organization,profileState);
    }
  })
  .then(() => {
    return userManager.changePassword(emailAddress, password);
  })
  .then(() => {
    return userManager.updateVerificationToken(emailAddress);
  })
  .then(verificationToken => {
    return sendVerificationEmail(emailAddress, 
                                 verificationToken,
                                 serverURL(req));
  })
  .then(() => {
    res.send(JSON.stringify({}));
  })
  .catch(error => {
    res.send(JSON.stringify({
      error: error
    }));
  });
});

module.exports = router;
