const Installment = require("../models/Installment");
const PaymentDue = require("../models/PaymentDues")
const Email = require("../controllers/emailc")
const cron = require('node-cron');
const moment = require('moment');
const Handlepayment = require("../controllers/Handlepaymentstats")

// Schedule the cron job to run every minute 


// cron job and schedule time  
// every day midnight - '0 0 * * *' 
// evrey minute - '* * * * *' 
// every 5 min - '*/5 * * * *' 
// every 10 min - '*/10 * * * *' 

cron.schedule('0 0 * * *', () => {
    console.log('Running cron job for payment reminder...');
    calculatePaymentDueDates();
    calcexpirydays();
});

const calculatePaymentDueDates = async () => {
    const currentdate = moment().format('DD-MM-YYYY');
    console.log('Current Date:', currentdate);

    try {
        const users = await PaymentDue.find({ nextpaymentdate: currentdate });

        if (users.length > 0) {
            const userNames = users.map(user => ({
                studentname: user.studentname,
                course: user.course,
                amount: user.amount,
                email: user.studentemail,
                nextPaymentDate: user.nextpaymentdate
            },
                Email.sendpaymentmail(user.studentemail, user.amount, user.studentname, user.academyname)
            ),
            );

            console.log('Payment reminders found:', userNames);
        } else {
            console.log('No payment reminders found for the specified date.');
        }

        users.forEach(user => {
            sendPaymentReminder(user.studentname);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

const sendPaymentReminder = (user) => {
    console.log("Your fees are pending for:", user);
};

const calcexpirydays = async () => {
    const subscriptions = await PaymentDue.find();

    try {
        for (const subscription of subscriptions) {
            const currentDate = moment();
            const expiryDate = moment(subscription.nextpaymentdate, 'DD-MM-YYYY');;
            const timeDiff = expiryDate.diff(currentDate);
            const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

            await PaymentDue.updateOne(
                { _id: subscription._id },
                { $set: { daysleft: daysLeft } }
            );

            console.log(`${subscription.studentname} has ${daysLeft} days left until expiry`);
        }
    } catch (error) {
        console.error('Error calculating subscription expiry:', error);
    }

};



module.exports = { calculatePaymentDueDates };
