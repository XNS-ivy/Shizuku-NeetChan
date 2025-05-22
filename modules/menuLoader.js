import fs from 'fs/promises'
import path from 'path'
import { pathToFileURL } from 'url'

const commandDir = './commands'

export async function loadCommands(dir = commandDir) {
    let commandMap = new Map()
    const files = await fs.readdir(dir, { withFileTypes: true })

    for (const file of files) {
        const fullPath = path.join(dir, file.name)

        if (file.isDirectory()) {
            const sub = await loadCommands(fullPath)
            for (const [name, handler] of sub) {
                commandMap.set(name, handler)
            }
        } else if (file.name.endsWith('.js')) {
            try {
                const mod = await import(pathToFileURL(fullPath).href)
                const cmd = mod.default
                if (cmd?.name && typeof cmd.execute === 'function') {
                    commandMap.set(cmd.name, cmd)
                }
            } catch (e) {
                console.error(`Error loading ${file.name}:`, e)
            }
        }
    }
    return commandMap
}