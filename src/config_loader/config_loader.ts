import * as fs from 'fs'
import * as yaml from 'js-yaml'
import { cwd } from 'process'

export const loadConfig = async (filename: string): Promise<any> => {
    const path = `${cwd()}/config/${filename}`
    const file = await fs.promises.readFile(path)
    const parsedYaml = yaml.load(file.toString())
    return parsedYaml
}