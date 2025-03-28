const { Kafka } = require("kafkajs")
require('dotenv').config();

const kafka = new Kafka({
    clientId: 'MusicVista-kafka',
    brokers: ['192.168.31.26:9092'],
})


module.exports = { kafka }