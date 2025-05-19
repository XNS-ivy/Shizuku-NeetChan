import { startSock } from "./modules/baileys/socket.js"
startSock().catch(err => { console.error(err) })