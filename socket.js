import { Server } from "socket.io"

let io

export async function createSocketServer(httpServer) {
    io = new Server(httpServer, {
        cors: { origin: '*', methods: ['GET', 'POST'] }
    })
    io.on('connection', (socket) => {
        console.log('✅ Frontend connected via socket')
    })

}

export { io }