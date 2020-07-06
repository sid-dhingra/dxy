console.log('dbdebug running...');

var mongoose = require('mongoose');
var mongoDB = "mongodb://admin:foo@ds217310.mlab.com:17310/demandxy_development";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var DB = mongoose.connection;
DB.on('error', console.error.bind(console, 'MongoDB connection error:'));

var User = require('./models/user')

// Find users with password = "doop".
// User.find({ 'password': 'doop' }, function (err, users) {
//   if (err) {
//     console.log(err);
//     return
//   } else {
//     console.log(users.length)
//     console.log(JSON.stringify(users))
//   }
// })

// Add a user.
// var user_instance = new User({
//                                email: "doop",
//                                password: "doop",
//                                sessionEndDate: Date.now()
//                              });
// user_instance.save(function (err) {
//   if (err) {
//     console.log(err)
//   } else {
//     DB.close()
//   }
// });

// Count users with password = "doop".
// User.count({ 'password': 'doop' }, function (err, count) {
//   if (err) {
//     console.log(err);
//     return
//   } else {
//     console.log(count)
//   }
// })

var Organization = require('./models/organization') 

var organization_instance = new Organization({
  name: "fuelclub",
  numberOfAccountsRemaining: Infinity
});
organization_instance.save(function (err) {
if (err) {
console.log(err)
} else {
DB.close()
}
});
