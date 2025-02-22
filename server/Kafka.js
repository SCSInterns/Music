const { Kafka } = require("kafkajs")
require('dotenv').config();

const kafka = new Kafka({
    clientId: 'my-node-app',
    brokers: [process.env.KAFKA_BROKERS],
})


module.exports = { kafka }