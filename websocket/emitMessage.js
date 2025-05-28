import { io } from '../socket.js'

export function handleIncomingCommands(msg) {

    io.emit('incoming-command', {
        id: msg.id,
        phoneNumber: msg.phoneNumber,
        name: msg.name,
        text: msg.text,
        timestamp: msg.raw.messageTimestamp,
        remoteJid: msg.raw.key.remoteJid,
    })
}