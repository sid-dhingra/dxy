var express = require('express');
var router = express.Router();
var userManager = require('../utilities/userManager');
var authentication = require('../utilities/authentication');
var profileSelection = require('../utilities/profileSelection');

router.get('/*', function(req, res, next) {
  userManager.verifyUserUsingVerficationToken(req.query.verificationToken)
  .then(emailAddress => {
    return new Promise((resolve, reject) => {
      authentication.updateSessionUsingEmailAddress(res,
                                                    emailAddress,
                                                    (error) => {
        if (error) {
          reject();
        } else {
          resolve();
        }
      });
    })
    .then(() => {
      return userManager.usersProfileDescriptors(emailAddress);
    })
    .then(profileDescriptors => {
      if (profileDescriptors.length === 1) {
        return userManager.usersProfile(emailAddress, profileDescriptors[0])
        .then(profile => {
          profileSelection.setSelected(res, profile);
        });
      } else {
        return Promise.resolve();
      }
    });
  })
  .then(() => {
    res.redirect('/');
  });
});

module.exports = router;
