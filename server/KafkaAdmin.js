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



availability()
processpayment()
init()


