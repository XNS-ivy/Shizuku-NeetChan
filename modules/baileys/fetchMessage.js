import { loadConfig } from '../botConfig.js'

export async function fetchMessage(msg = {}) {
    if (!msg.pushName) return

    const phoneNumber = msg?.key?.participant || msg?.key?.remoteJid
    const id = msg?.key?.remoteJid
    const name = msg?.pushName
    const msgKeys = Object.keys(msg.message || {})
    const type = msgKeys.includes('senderKeyDistributionMessage') ? msgKeys[2] : msgKeys[0]

    const {
        extendedTextMessage,
        stickerMessage,
        conversation,
        videoMessage,
        imageMessage
    } = msg?.message || {}

    const text = conversation
        ? conversation
        : extendedTextMessage
            ? extendedTextMessage.text
            : stickerMessage
                ? `[Sticker]`
                : videoMessage
                    ? `[Video]`
                    : imageMessage
                        ? `[Image]`
                        : null

    const expiration = msg?.message?.[type]?.contextInfo?.expiration || 0

    return {
        id,
        phoneNumber,
        name,
        type,
        text,
        expiration,
        raw: msg,
    }
}

export async function fetchCommand(text = '') {
    if (!text) return
    const loadPrefix = await loadConfig()
    const prefix = text.startsWith(loadPrefix.prefix)
    if (prefix) {
        const CommandBody = text.slice(loadPrefix.prefix.length).trim()
        const [name, ...args] = CommandBody.split(/\s+/)
        return {
            name,
            args,
        }
    }
}