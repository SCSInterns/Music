const cron = require('node-cron');
const Dues = require("../models/PaymentDues");

cron.schedule('0 0 * * *', () => {
    console.log("Running cron job...");
    totaldue();
});

function getCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    return `${day}-${month}-${year}`;
}

function calculateMonthDifference(date1, date2) {
    const [day1, month1, year1] = date1.split('-').map(Number);
    const [day2, month2, year2] = date2.split('-').map(Number);

    const firstDate = new Date(year1, month1 - 1, day1);
    const secondDate = new Date(year2, month2 - 1, day2);

    const yearDiff = secondDate.getFullYear() - firstDate.getFullYear();
    const monthDiff = secondDate.getMonth() - firstDate.getMonth();

    return yearDiff * 12 + monthDiff;
}

const totaldue = async () => {
    try {
        const records = await Dues.find();

        if (!records || records.length === 0) {
            console.log("No records found");
            return;
        }

        for (const record of records) {
            if (!record || !record.amount || !record.nextpaymentdate) {
                console.error(`Invalid record for student ID: ${record.studentid}`);
                continue;
            }

            console.log("Processing student: ", record.studentname);

            const fees = record.amount;
            const paymentdate = record.paymentdate;
            const currentdate = getCurrentDate();

            const months = calculateMonthDifference(currentdate, paymentdate);

            if (months === 0) {
                record.dueamount = 0;
                record.advanceamount = 0;

                await record.save()

                console.log(`No payment due for ${record.studentname}`);
                continue;
            }

            if (months > 0) {
                const advancepayment = Math.abs(months) * fees;
                record.advanceamount = Math.abs(advancepayment);
                record.dueamount = 0;
                await record.save();
                console.log(`Advance payment for ${record.studentname}: ${advancepayment}`);
            }

            if (months < 0) {
                const pendingfeesamount = months * fees;
                record.dueamount = Math.abs(pendingfeesamount);
                record.advanceamount = 0;
                await record.save();
                console.log(`Payment due for ${record.studentname}: ${pendingfeesamount}`);
            }
        }

    } catch (error) {
        console.error('Error calculating advance and due amounts:', error);
    }
};

module.exports = { totaldue };
