const { Kafka } = require("kafkajs")


const kafka = new Kafka({
    clientId: 'MusicVista-kafka',
    brokers: ["0.0.0.0:9092"]
})


module.exports = { kafka }