import { Connection, Connections } from "../types/types"

export const isConnectionCancelled = (connection: Connection): boolean => {
    return connection.departure.canceled !== "0" ? true : false
}

export const isConnectionDelayed = (connection: Connection): boolean => {
    return parseInt(connection.departure.delay) > 0 ? true : false
}

export const extractZerothConnection = (connections: Connections): Connection => {
    return connections.connection.at(0)
}