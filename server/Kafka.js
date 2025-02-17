const { Kafka } = require("kafkajs")


const kafka = new Kafka({
    clientId: 'MusicVista-kafka',
    brokers: ["192.168.1.9:9092"]
})


module.exports = { kafka }