const { kafka } = require("./Kafka")

async function init() {
    const admin = kafka.admin()
    await admin.connect()
    console.log("admin connected to kafka")

    console.log("creating topic")
    await admin.createTopics({
        topics: [
            {
                topic: "EventTickets",
                numPartitions: 2
            }
        ]
    })
    console.log("topic created ")

    await admin.disconnect()
    console.log("admin disconnected from kafka")
}


async function availability() {
    const admin = kafka.admin()
    await admin.connect()
    console.log("admin connected to kafka")

    console.log("creating topic")
    await admin.createTopics({
        topics: [
            {
                topic: "CheckAvailability",
                numPartitions: 1
            }
        ]
    })
    console.log("topic created ")

    await admin.disconnect()
    console.log("admin disconnected from kafka")
}

async function processpayment() {
    const admin = kafka.admin()
    await admin.connect()
    console.log("admin connected to kafka")

    console.log("creating topic")
    await admin.createTopics({
        topics: [
            {
                topic: "ProcessPayment",
                numPartitions: 1
            }
        ]
    })
    console.log("topic created ")

    await admin.disconnect()
    console.log("admin disconnected from kafka")
}


const createTopic = async (topicName) => {
    try {
        const admin = kafka.admin();
        await admin.connect();
        const topics = await admin.listTopics();

        if (!topics.includes(topicName)) {
            await admin.createTopics({
                topics: [{ topic: topicName, numPartitions: 3, replicationFactor: 1 }],
            });
            console.log(` Topic ${topicName} created`);
        } else {
            console.log(`ℹ️ Topic ${topicName} already exists`);
        }
        await admin.disconnect();
    } catch (error) {
        console.error("Kafka Topic Creation Error:", error);
    }
};

init()
createTopic("PaymentEntry");
createTopic("Qrcode")
createTopic("TicketsMailing")
createTopic("UpdateStats")
availability()
processpayment()



module.exports = { createTopic }

