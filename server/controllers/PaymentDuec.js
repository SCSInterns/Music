const Installment = require("../models/Installment");
const Email = require("../controllers/emailc")
const cron = require('node-cron');
const moment = require('moment');

// Schedule the cron job to run every minute 


// cron job and schedule time  
// every day midnight - '0 0 * * *' 
// evrey minute - '* * * * *' 
// every 5 min - '*/5 * * * *' 
// every 10 min - '*/10 * * * *' 

cron.schedule('0 0 * * *', () => {
    console.log('Running cron job for payment reminder...');
    calculatePaymentDueDates();
});

const calculatePaymentDueDates = async () => {
    const currentdate = moment().format('DD-MM-YYYY');
    console.log('Current Date:', currentdate);

    try {
        const users = await Installment.find({ nextPaymentDate: currentdate });

        if (users.length > 0) {
            const userNames = users.map(user => ({
                studentname: user.studentname,
                course: user.course,
                amount: user.amount,
                email: user.studentemail,
                nextPaymentDate: user.nextPaymentDate
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

module.exports = { calculatePaymentDueDates };
