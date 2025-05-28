import express from 'express'
import http from 'http'
import { createSocketServer } from './socket.js'

const app = express()
const server = http.createServer(app)

app.get('/', (req, res) => {
    res.send('✅ API & Socket Server is running')
  })

createSocketServer(server)

server.listen(3000, () =>{
    console.log('API + Socket Server on http://localhost:3000')
})
