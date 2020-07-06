var express = require('express');
var router = express.Router();
var userManager = require('../utilities/userManager');
var authentication = require('../utilities/authentication');
var profileSelection = require('../utilities/profileSelection');

router.post('/change_password', function(req, res, next) {
  var emailAddress = authentication.getEmailAddress(req);
  var currentPassword = req.body.currentPassword;
  var newPassword = req.body.newPassword;
  if (newPassword === currentPassword) {
    res.send(JSON.stringify({
      error: 'new password must be different than current password'
    }));
    return;
  }
  userManager.isPasswordCorrect(emailAddress, currentPassword)
  .then(isPasswordCorrect => {
    if (isPasswordCorrect === true) {
      return userManager.changePassword(emailAddress, newPassword);
    } else {
      return Promise.reject('incorrect current password');
    }
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

router.post('/get_profile', function (req, res, next) {
  var emailAddress = authentication.getEmailAddress(req);
  userManager.usersProfile(emailAddress, req.body.profileDescriptor)
  .then(profile => {
    res.send(JSON.stringify({
      profile: profile
    }));
  })
  .catch(error => {
    res.send(JSON.stringify({
      error: error
    }));
  });
});

router.post('/set_selected_profile', function (req, res, next) {
  var emailAddress = authentication.getEmailAddress(req);
  userManager.usersProfile(emailAddress, req.body.profileDescriptor)
  .then(profile => {
    profileSelection.setSelected(res, profile);
    res.send(JSON.stringify({}));
  })
  .catch(error => {
    res.send(JSON.stringify({
      error: error
    }));
  });
});

module.exports = router;
