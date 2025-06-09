import { loadConfig } from '../botConfig.js'

export async function fetchMessage(msg = {}) {
    if (!msg.pushName) return

    const phoneNumber = msg?.key?.participant || msg?.key?.remoteJid
    const id = msg?.key?.remoteJid
    const name = msg?.pushName

    const msgKeys = Object.keys(msg.message || {})
    const type = msgKeys.find(key => key !== 'senderKeyDistributionMessage') || 'unknown'

    const {
        extendedTextMessage,
        stickerMessage,
        conversation,
        videoMessage,
        imageMessage
    } = msg?.message || {}

    const text = conversation
        || extendedTextMessage?.text
        || (stickerMessage && '[Sticker]')
        || videoMessage?.caption
        || imageMessage?.caption
        || null

    const getMediaUrl = (media = {}) => media?.url || null

    const expiration = msg?.message?.[type]?.contextInfo?.expiration || 0
    
    return {
        id,
        phoneNumber,
        name,
        type,
        text,
        mediaUrl: getMediaUrl(videoMessage) || getMediaUrl(imageMessage),
        expiration,
        raw: msg,
    }
}

export async function fetchCommand(text = '') {
    if (!text) return
    const loadPrefix = await loadConfig()
    if (text.startsWith(loadPrefix.prefix)) {
        const CommandBody = text.slice(loadPrefix.prefix.length).trim()
        const [name, ...args] = CommandBody.split(/\s+/)
        return {
            name,
            args,
        }
    }
}