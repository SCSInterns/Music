const { Kafka } = require("kafkajs")
require('dotenv').config();

const kafka = new Kafka({
    clientId: 'MusicVista-kafka',
    brokers: ['192.168.1.11:9092'],
})


module.exports = { kafka }