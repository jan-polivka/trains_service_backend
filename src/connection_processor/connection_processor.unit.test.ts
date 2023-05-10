import { expect, test } from '@jest/globals'
import * as fs from 'fs'
import { extractZerothConnection, isConnectionCancelled, isConnectionDelayed } from "./connection_processor";
import { cwd } from "node:process";
import { Connection, Connections } from '../types/types';

test("connection is not cancelled", () => {
    const connection: Connection = { id: "0", departure: { canceled: "0", delay: "0", time: "123" } }
    const result = isConnectionCancelled(connection)
    expect(result).toBe(false);
})

test("connection is cancelled", () => {
    const connection: Connection = { id: "0", departure: { canceled: "1", delay: "0", time: "123" } }
    const result = isConnectionCancelled(connection)
    expect(result).toBe(true);
})

test("connection is not delayed", () => {
    const connection: Connection = { id: "0", departure: { canceled: "0", delay: "0", time: "123" } }
    const result = isConnectionDelayed(connection)
    expect(result).toBe(false);
})

test("connection is delayed", () => {
    const connection: Connection = { id: "0", departure: { canceled: "0", delay: "2", time: "123" } }
    const result = isConnectionDelayed(connection)
    expect(result).toBe(true);
})

test("extract the zeroth connection", () => {
    const path = `${cwd()}/resources/test/connection.json`
    const file = fs.readFileSync(path)
    const parsed: Connections = JSON.parse(file.toString())
    const connection = extractZerothConnection(parsed)
    expect(connection.id).toBe("0")
})