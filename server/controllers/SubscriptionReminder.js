const Admin = require("../models/Admin")
const redis = require("../RedisInitalitation")
const cron = require('node-cron');
const moment = require('moment');
const email = require("./emailc")

cron.schedule("0 0 * * *", () => {
    try {
        console.log("Running Cron")
        calculaterenewalreminders()
    } catch (error) {
        console.log("Error connceting to cron", error)
    }

}
)

const calculateSubscriptionReminder = async (academydetails, hashKey) => {
    const academyId = academydetails.academy_id;
    await redis.redis.hset(hashKey, academyId, JSON.stringify({
        renewaldate: academydetails.renewaldate,
        academy_name: academydetails.academy_name,
    }));

    console.log(`Subscription added for user ${academydetails.academy_id}`);
}

const calculaterenewalreminders = async () => {
    try {
        const currentDate = moment().format('DD-MM-YYYY');
        const currentMoment = moment(currentDate, 'DD-MM-YYYY');

        const academyIds = await redis.redis.hkeys('subscriptions');

        for (const academyId of academyIds) {
            const academyData = await redis.redis.hget('subscriptions', academyId);

            if (academyData) {
                const parsedData = JSON.parse(academyData);

                const renewalMoment = moment(parsedData.renewaldate, 'DD-MM-YYYY');

                if (currentMoment.isSame(renewalMoment, 'day')) {
                    console.log(`Reminder: Subscription renewal for academy ${academyId} is today.`);

                    const admin = await Admin.findOne({ academy_id: academyId })

                    // send email to admin 

                    await email.renewalreminderemail(admin.academy_name, admin.renewaldate, "4000", admin.academy_email)


                    // update the details  

                    admin.academy_access = "Reject"
                    admin.paymentstatus = "Due Renewal"
                    await admin.save()


                }
            }
        }
    } catch (error) {
        console.error('Error in calculating renewal reminders:', error);
    }

}


const updateAcademyDetails = async (academyId, newDetails, hashKey) => {

    const currentData = await redis.redis.hget(hashKey, academyId);

    if (currentData) {

        const parsedData = JSON.parse(currentData);

        const updatedData = {
            ...parsedData,
            ...newDetails,
        };

        await redis.redis.hset(hashKey, academyId, JSON.stringify(updatedData));
        console.log(`Updated details for academy ${academyId}`);

    } else {
        console.log(`Academy with ID ${academyId} not found in Redis`);
    }
}


module.exports = { calculateSubscriptionReminder, updateAcademyDetails }