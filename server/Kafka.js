const { Kafka } = require("kafkajs")


const kafka = new Kafka({
    clientId: 'my-node-app',
    brokers: [process.env.KAFKA_BROKER || 'kafka:9092']
})


module.exports = { kafka }