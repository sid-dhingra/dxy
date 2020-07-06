var express = require('express');
var router = express.Router();
var organizationManager = require('../utilities/organizationManager');

router.post('/', (req, res) => {
  let event;
  try {
    event = req.body;
  }
  catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'invoice.upcoming':
      const upcomingInvoice = event.data.object;
      console.log("Upcoming Invoice");
      //handleUpcomingInvoice(upcomingInvoice);
      break;
    case 'invoice.payment_failed':
      const failedPayment = event.data.object;
      console.log("Payment Failed");
      //handleFailedPayment(failedPayment);
      break;
    case 'invoice.payment_succeeded':
      const successfulPayment = event.data.object;
      var paidUntil = successfulPayment.lines.data[0].period.end;
      organizationManager.handleSuccessfulPayment(successfulPayment.customer, paidUntil);
      break;
    default:
      // Unexpected event type
      return res.status(400).end();
  }

  res.setHeader('Content-Type', 'application/json');
  var jsonString = JSON.stringify({received: true});
  res.send(jsonString);

});

module.exports = router;