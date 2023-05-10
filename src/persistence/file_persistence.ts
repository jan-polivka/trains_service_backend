import { readFile, writeFile } from "fs/promises"
import { Time } from "../types/types"

export const persistInFile = async (time: Time, filepath: string) => {
    const jsonTimeString = JSON.stringify(time)
    await writeFile(filepath, jsonTimeString)
}

export const retrieveFromFile = async (filepath: string): Promise<string> => {
    const timeStringFile = await readFile(filepath, "utf-8").catch((err) => {
        console.error(err.message)
        return '{"hour": "", "minute": ""}'
    })
    const parsed = JSON.parse(timeStringFile)
    return parsed
}