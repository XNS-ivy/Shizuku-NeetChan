import { makeWASocket, useMultiFileAuthState, DisconnectReason } from 'baileys'
import p from 'pino'
import QRCode from 'qrcode'
import { fetchCommand, fetchMessage } from './fetchMessage.js'
import { loadCommands } from '../menuLoader.js'

export async function startSock() {
    const authDir = './auth/'
    const { state, saveCreds } = await useMultiFileAuthState(authDir)
    const commands = await loadCommands();

    const sock = makeWASocket({
        auth: state,
        logger: p({ level: 'silent' }),
        browser: ["Shizuku", "1.0.0", "Chrome"],
        emitOwnEvents: false,
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
            const command = await fetchMessage(message)
            const parsed = await fetchCommand(command?.text)
            if (!parsed) return

            const { name, args } = parsed
            if (commands.has(name)) {
                const runCmd = commands.get(name)
                const response = await runCmd.execute(args)
                if (response?.text && !response?.url) {
                    await sock.sendMessage(command.id, { text: response.text }, { quoted: command.raw, ephemeralExpiration: command.expiration })
                }
            }
        }
    })
}