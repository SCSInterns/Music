const Redis = require('ioredis');
const dotenv = require("dotenv");


dotenv.config();

const rhost = process.env.REDIS_HOST
const rport = process.env.REDIS_PORT

const redis = new Redis({
    host: rhost,
    port: rport,
});


module.exports = { redis };