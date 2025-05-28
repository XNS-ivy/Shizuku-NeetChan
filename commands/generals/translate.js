import { translateText } from "../../modules/translator/translator.js"
import { loadConfig } from "../../modules/botConfig.js"

const config = loadConfig()

export default {
    name: 'translate',
    desc: 'Translate to another language',
    premium: false,
    execute: async ({ args }) => {
        if (args.length < 2) return `❌ Invalid Format. Example: ${config.prefix}en saya suka anime`
        const target = args[0]
        const text = args.slice(1).join(' ')

        const result = await translateText(text, target)

        if (!result) return { text: '❌ Failed translating text.' }
        return { text: `🈯 Translate ${result.from} -> ${result.to}:\n\n${result.translated}` }
    }
}