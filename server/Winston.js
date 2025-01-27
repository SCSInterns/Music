// winston
const winston = require("winston")
const dotenv = require("dotenv")

// formatting the logs 
const { combine, timestamp, json, prettyPrint, errors } = winston.format;

dotenv.config()

const token = process.env.Sourcetoken
const { Logtail } = require("@logtail/node");
const { LogtailTransport } = require("@logtail/winston")
const logtail = new Logtail(token);

// creating the log template
const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        json(),
        prettyPrint(),
        errors({ stack: true })
    ),
    defaultMeta: { service: 'music-vista-application' },
    transports: [
        new LogtailTransport(logtail),
    ],
})

// ensuring the logs are save to cloud 
logtail.flush()


module.exports = logger