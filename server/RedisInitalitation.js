const Redis = require('ioredis');
const dotenv = require("dotenv");


dotenv.config();

const rhost = process.env.REDIS_HOST
const rport = parseInt(process.env.REDIS_PORT, 10)

const redis = new Redis({
    host: rhost,
    port: rport,
});


module.exports = { redis };