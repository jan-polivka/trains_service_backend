import { appendFile } from "fs"
import { getTodayDDMMYY } from "./utility"
import { Connections } from "../types/types"
import { loadConfig } from "../config_loader/config_loader"

const options = {
    headers: {
        "User-Agent": "trains_service/0.0 (https://github.com/jan-polivka/trains_service; j.polivka5@gmail.com"
    }
}

const url = "https://api.irail.be/"

export async function stationGet() {
    let api = 'stations?format=json'
    let resp = await fetch(url + api, options)
    resp = await resp.json()
    return resp
}

export async function connectionGet(): Promise<Connections> {
    const date = getTodayDDMMYY(new Date())
    const api = 'connections?from=BE.NMBS.008821600&to=BE.NMBS.008821006&format=json&time=0730&date=' + date
    let resp = await fetch(url + api, options)
    let connections: Connections = await resp.json()
    return connections
}

export const connectionGetBremen = async (): Promise<number> => {
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
    console.log(date)
    const month = date[0]['value']
    const day = date[2]['value']
    const year = date[4]['value']
    const config = await loadConfig('config_default.yaml')
    const apiKey = config['api_key']
    const start = '53.16976,8.629996'
    const destination = '53.103839,8.786177'
    const urlBremen = `http://gtfsr.vbn.de/api/routers/connect/plan?arriveBy=false&date=${month}-${day}-${year}&fromPlace=${start}&toPlace=${destination}&time=07:50:00&mode=WALK,TRANSIT&maxWalkDistance=300`

    console.log(apiKey)
    const optionsBremen = {
        headers: {
            "Authorization": apiKey,
            "Host": 'gtfsr.vbn.de'
        }
    }
    let resp = await fetch(urlBremen, optionsBremen)
    const json = await resp.json()
    const delay = json['plan']['itineraries'][0]['legs'][0]['departureDelay']
    return delay
}