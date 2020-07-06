var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var authentication = require('./utilities/authentication');
var profileSelection = require('./utilities/profileSelection');
var indexRouter = require('./routes/index');
var updateUsersVerificationSessionRouter 
  = require('./routes/updateUsersVerificationSessionRouter');
var verifyUserRouter = require('./routes/verifyUserRouter');
var inviteUserRouter = require('./routes/inviteUserRouter');
var updateUsersPasswordResetSessionRouter 
  = require('./routes/updateUsersPasswordResetSessionRouter');
var resetUsersPasswordRouter 
  = require('./routes/resetUsersPasswordRouter');
var queryRouter = require('./routes/query');
var organizationRouter = require('./routes/organizationRouter');
var userRouter = require('./routes/userRouter');
var signUpRouter = require('./routes/signUpRouter');
var authenticateRouter = require('./routes/authenticateRouter');
var accountSetupRouter = require('./routes/accountSetupRouter');
var billingWebhook = require('./routes/billingWebhook');


var app = express();

// TODO Remove this once we move off of Heroku.
//      This is used for rate limiting.
app.enable("trust proxy");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('public'));

const unauthenticatedRateLimiter = require("express-rate-limit")({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: JSON.stringify({error: 'unauthenticated rate limit reached'})
});

app.use('/billingWebhook', billingWebhook);
app.use('/invite_user', 
        unauthenticatedRateLimiter,
        inviteUserRouter);
app.use('/sign_up',
        unauthenticatedRateLimiter,
        signUpRouter);
app.use('/update_users_verification_session', 
        unauthenticatedRateLimiter,
        updateUsersVerificationSessionRouter);
app.use('/verify_user',
        unauthenticatedRateLimiter,
        verifyUserRouter);
app.use('/update_users_password_reset_session', 
        unauthenticatedRateLimiter,
        updateUsersPasswordResetSessionRouter);
app.use('/reset_users_password',
        unauthenticatedRateLimiter,
        resetUsersPasswordRouter);
app.use('/authenticate',
        unauthenticatedRateLimiter,
        authenticateRouter);
app.use(authentication.checkSession);
app.use('/user', userRouter);
app.use(profileSelection.enforce);
app.use('/organization', organizationRouter);
app.use('/query', queryRouter);
app.use('/account_setup', accountSetupRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
