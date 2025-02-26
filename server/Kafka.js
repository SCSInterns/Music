const { Kafka } = require("kafkajs")
require('dotenv').config();

const kafka = new Kafka({
    clientId: 'MusicVista-kafka',
    brokers: ['localhost:9092'],
})


module.exports = { kafka }