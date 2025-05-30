import { makeWASocket, useMultiFileAuthState, DisconnectReason } from 'baileys'
import p from 'pino'
import QRCode from 'qrcode'
import { fetchCommand, fetchMessage } from './fetchMessage.js'
import { loadCommands } from '../menuLoader.js'
import { handleIncomingCommands } from '../../websocket/emitMessage.js'

export async function startSock() {
    const authDir = './auth/'
    const { state, saveCreds } = await useMultiFileAuthState(authDir)
    const commands = await loadCommands();

    const sock = makeWASocket({
        auth: state,
        logger: p({ level: 'silent' }),
        browser: ["Shizuku", "1.0.0", "Chrome"],
        emitOwnEvents: false,
        syncFullHistory: false,
        generateHighQualityLinkPreview: true,
    })
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update
        if (qr) {
            console.log(await QRCode.toString(qr, { type: 'terminal', small: true }))
        }
        if (connection === 'close') {
            const shouldRestart = (lastDisconnect?.error)?.output?.statusCode === DisconnectReason.restartRequired
            if (shouldRestart) {
                console.log("Restarting socket...")
                await startSock()
            }
        }
    })
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('messages.upsert', async ({ type, messages }) => {
        if (type !== 'notify') return

        for (const message of messages) {
            const msg = await fetchMessage(message)
            const parsed = await fetchCommand(msg?.text)
            if (!parsed) return

            handleIncomingCommands(msg)

            const { name, args } = parsed
            if (commands.has(name)) {
                const runCmd = commands.get(name)
                const response = await runCmd.execute({ args, msg, sock })
                if (Array.isArray(response)) {
                    for (const item of response) {
                        if (item?.type === 'image') {
                            await sock.sendMessage(msg.id, { image: { url: item.url }, caption: item.text }, { quoted: msg.raw, ephemeralExpiration: msg.expiration })
                        } else {
                            await sock.sendMessage(msg.id, { text: item.text }, { quoted: msg.raw, ephemeralExpiration: msg.expiration })
                        }
                    }
                } else {
                    if (response?.text && !response?.url) {
                        await sock.sendMessage(msg.id, { text: response.text, mentions: response?.mentions }, { quoted: msg.raw, ephemeralExpiration: msg.expiration })
                    } else if (response?.type === 'image') {
                        await sock.sendMessage(msg.id, { image: { url: response.url }, caption: response.text }, { quoted: msg.raw, ephemeralExpiration: msg.expiration })
                    }
                }
            }
        }
    })
}