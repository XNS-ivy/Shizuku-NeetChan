import { makeWASocket, useMultiFileAuthState, DisconnectReason } from 'baileys'
import p from 'pino'
import QRCode from 'qrcode'

export async function startSock() {
    const authDir = './auth/'
    const { state, saveCreds } = await useMultiFileAuthState(authDir)

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
    sock.ev.on('messages.upsert', ({ type, messages }) => {
        if (type == 'notify') {
            for (const message of messages) {
                
            }
        } else {
            for(const message of messages){
                
            }
        }
    })
}