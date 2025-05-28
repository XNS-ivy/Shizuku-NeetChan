import { startSock } from "./modules/baileys/socket.js"
import './apiServer.js'

startSock().catch(err => { console.error(err) })