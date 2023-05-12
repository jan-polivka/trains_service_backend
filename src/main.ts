import cors from '@fastify/cors'
import Fastify from 'fastify'
import * as fs from 'fs'
import { loadConfig } from './config_loader/config_loader'
import { extractZerothConnection, isConnectionCancelled, isConnectionDelayed } from './connection_processor/connection_processor'
import { connectionGet, connectionGetBremen, stationGet } from './loader/loader'
import { loadMailerConfig, sendMail } from './mailer/mailer'
import { persistInFile, retrieveFromFile } from './persistence/file_persistence'
import * as schedule from 'node-schedule'

const fastify = Fastify({ logger: true })

fastify.register(cors)

fastify.get('/', (req, res) => {
    res.send({ hello: 'world' })
})

fastify.get('/health', (req, res) => {
    console.log("health is checked")
    res.status(200)
    res.send("healthy")
})

fastify.get('/trains', async (req, res) => {
    let stations = await stationGet()
    fs.writeFile('/workspaces/ubuntu-6/trains_service/backend/stations.json', JSON.stringify(stations), err => {
        if (err)
            console.log(err)
    })
    res.send('go away')
})

fastify.get('/station', async (req, res) => {
    let read = await fs.promises.readFile('/workspaces/ubuntu-6/trains_service/backend/stations.json', 'utf-8')
    console.log(read)
    res.send(read)
})
//{"locationX":"4.560614","locationY":"51.135758","id":"BE.NMBS.008821600","name":"Lier","@id":"http://irail.be/stations/NMBS/008821600","standardname":"Lier"},
//{"locationX":"4.421101","locationY":"51.2172","id":"BE.NMBS.008821006","name":"Antwerp-Central","@id":"http://irail.be/stations/NMBS/008821006","standardname":"Antwerpen-Centraal"}

fastify.get('/connection', async (req, res) => {
    let connection = await connectionGet()
    res.send(connection)
})

fastify.get('/mail', async (req, res) => {
    const config = loadConfig('config_default.yaml')
    const mailerConfig = loadMailerConfig(config['mail'])
    const connections = await connectionGet()
    const zerothConnection = extractZerothConnection(connections)
    const isConnectionBorked = isConnectionCancelled(zerothConnection) && isConnectionDelayed(zerothConnection)
    let mailRes = await sendMail(mailerConfig, isConnectionBorked)
    res.send(zerothConnection)
})

fastify.post('/submit_time_string', async (req, res) => {
    console.log(req.body)
    const hour = +req.body['hourString']
    const minute = +req.body['minuteString']
    const resp = Number.isNaN(hour) && Number.isNaN(minute) ? "NOT OK" : "OK"
    console.log(hour + " " + minute + " " + resp)
    if (resp === "OK") {
        const config = await loadConfig('config_default.yaml')
        // await persistInFile(parsed.toString(), config['file'])
        console.log(hour)
        console.log(minute)
        const job = schedule.scheduleJob(`23 8 * * *`, function () {
            console.log("persisted job")
        });
    }
    res.status(200)
    res.send(resp)
})

fastify.get('/retrieve_time_string', async (req, res) => {
    const config = await loadConfig('config_default.yaml')
    const timeString = await retrieveFromFile(config['file'])
    console.log(timeString)
    res.send(timeString)
})

fastify.listen({ host: '0.0.0.0', port: 8080 }, async () => {
    console.log("doing the listen")
    /*
    let optionsIntl: Intl.DateTimeFormatOptions = {
        timeZone: 'Europe/Berlin',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    }
    const formatter = new Intl.DateTimeFormat([], optionsIntl);
    const date = formatter.formatToParts(new Date());
    const config = await loadConfig('config_default.yaml')
    const mailerConfig = loadMailerConfig(config)
    const job = schedule.scheduleJob(`15 * * * * *`, async function () {
        console.log("persisted job")
        const delay = await connectionGetBremen()
        const isConnectionBorked = delay > 0 ? true : false
        let mailRes = await sendMail(mailerConfig, isConnectionBorked)
    });
    */
})
