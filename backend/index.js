const keys = require('./keys')


//setup express

const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

// redis setup
const redis = require('redis')
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: function (options) {
        console.log(options)
        return 1000
    }
})

redisClient.on('error', (error) => {
    console.log('redis error')
    console.log(error)
})

redisClient.on('connect', () => {
    console.log('redis connected successfully')
})


// postgres setup

const { Pool } = require('pg')

const pool = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})
console.log(keys)
setTimeout(() => {
    pool.connect((error, client, release) => {
        if (error) {
            console.log('--------------------------------')
            return console.log(error)
        }
        client.query('CREATE TABLE IF NOT EXISTS values (number INT PRIMARY KEY) ', (error, result) => {
            release()
            if (error) {
                return console.log(error)
            }
            console.log('postgres - values table created')
        })
    })
}, 25000)

// routes

app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/temp', (req, res) => {
    console.log(redisClient.hgetall)
    redisClient.hgetall('values', (error, values) => {
        console.log(error, values)
        if (error) {
            console.log(error)
            return res.status(500).send({ error: error.message })
        }
        if (values === null) {
            return res.send({ data: {} })
        }
        res.send({ data: values })
    })
})

app.get('/saved', async (req, res) => {
    let client
    try {
        client = await pool.connect()
        const { rows } = await client.query('SELECT * FROM values')
        res.send({ data: rows })
    } catch (error) {
        if (client) {
            client.release(true)
        }
        console.timeLog(error)
        res.status(500).send({ error: error.message })
    }
})


app.post('/fib', async (req, res) => {
    const { number } = req.body
    if (!number || number > 39) {
        return res.status(422).send({ error: 'Please provide number' })
    }
    let client
    try {
        client = await pool.connect()
        await client.query('INSERT INTO values (number) VALUES ($1)', [number])
        client.release(true)
        redisClient.publish('fib', number, (error, success) => {
            // console.log(error,b,c)
            if (error) {
                return res.status(500).send({ error: error.message })
            } else if (!success) {
                return res.status(500).send({ error: 'redis not add the number' })
            }
            res.status(201).send()
        })
    } catch (error) {
        if (client) {
            client.release(true)
        }
        console.log(error)
        res.status(500).send({ error: error.message })
    }
})



app.listen(8081, () => {
    console.log('server up on port 8081')
})