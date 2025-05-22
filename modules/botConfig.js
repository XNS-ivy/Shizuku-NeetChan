import fs from 'fs/promises'
const configPath = './config.json'

export async function loadConfig(){
    const loadConfig = await fs.readFile(configPath, 'utf-8')
    const config = JSON.parse(loadConfig)
    return config
}