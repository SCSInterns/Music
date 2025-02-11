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


init()


