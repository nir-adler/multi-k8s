const keys = require('./keys')

// setup redis
const redis = require('redis')


const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: function (options) {
        console.log(options)
        return 1000
    }
})

redisClient.on('connect', () => {
    console.log('redis connected successfully')
})

const dup = redisClient.duplicate()

// fib function

const fib = (number) => {
    if (number < 2) {
        return number
    }
    return fib(number - 1) + fib(number - 2)
}

// subscribe / publish

dup.on('message', (channel, message) => {
    console.log(channel, message)
    if (channel === 'fib') {
        redisClient.hset('values', message, 'Nothig there yet', (a,b,c) => {
            console.log(a,b,c)
            redisClient.hset('values', message, fib(message))
        })
    }
})

dup.subscribe('fib')

// test

// dup.on('subscribe', (channel, count) => {
//     redisClient.publish('fib', 10)
// })