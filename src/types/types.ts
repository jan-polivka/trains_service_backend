export type Connections = {
    connection: Connection[]
}

export type Connection = {
    id: string
    departure: {
        delay: string
        time: string
        canceled: string
    }
}

export type Time = {
    hour: string
    minute: string
}