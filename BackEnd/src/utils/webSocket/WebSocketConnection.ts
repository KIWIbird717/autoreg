import { createServer } from 'http';
import type { IncomingMessage } from 'http';
import type { Express } from 'express';
import dotenv from 'dotenv'
import { WebSocketServer } from 'ws';
import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import { RegisterUserSchema } from '../../servises/RegisterUserDB/registerUserSchema.servise.js';
import { LogsShema } from '../../servises/RegisterUserDB/LogsCollection/logsSchema.js';


dotenv.config()
const WS_PORT = process.env.WS_PORT // WebSocket PORT
const SERVER_SECRET_KEY = process.env.SERVER_SECRET_KEY // Server secret key

/**
 * Convert WebSocket string header request to Object with param fields
 * @param req - `IncomingMessage` (type from http lib)
 * @return `{[index: string]: string}` ws request
 */
const parseWsReques = (req: IncomingMessage): {[index: string]: string} => {
  // Split request header: string to array of requests
  const splitedReq = req.url.split('?')[1].split('&')

  // Parse request from string[] to Object
  const requestParsed: {[index: string]: string} = {}
  splitedReq.forEach((param) => {
    const field = param.split('=')
    requestParsed[field[0]] = field[1]
  })

  return requestParsed
}

const GettingUpdatesFromDb = async (event: WebSocket.RawData, ws: WebSocket) => {
  try {
    // Parse token and reciev incripted client`s token
    const userToken = JSON.parse(event.toLocaleString())
    const token = jwt.verify(userToken.token, SERVER_SECRET_KEY) as {userId: string}
  
    console.log("[WS_SUBSCRIBE]: Send data to client:", token.userId)
  
    // Find user in DB by clientToken decrypted id
    const userMail = await RegisterUserSchema.findById({ _id: token.userId }).select('mail')
    // Find logs entity for user
    const logs = await LogsShema.findOne({ mail: userMail.mail })
  
    // Send MongoDb data to client
    if (ws.readyState === WebSocket.OPEN) {
      if (logs) {
        ws.send(JSON.stringify({status: 200, data: logs}))
      } else {
        ws.send(JSON.stringify({status: 404, msg: "Logs not fount"}))
      }
    }
  } catch (err) {
    console.error('\x1b[31m', `[WEBSOKET]: Error: ${err}`)
    ws.send(JSON.stringify({status: 400, msg: err}))
  }
}

/**
 * Create webSocket connection
 * @param app Express
 */
export const WebSocketConnection = (app: Express) => {
  // Create server for WebSocket
  const server = createServer(app)
  server.listen(WS_PORT, () => {
    console.log("\x1b[36m", `[WEBSOCKET] Created server for WS on PORT: ${WS_PORT}`)
  })
  // Initialized WebSocket Server
  const wss = new WebSocketServer({ server })

  // Start WebSocket Server
  const userConnections = new Map<{userId: string}, WebSocket>()
  wss.on('connection', (ws, req) => {
    const parsedReq = parseWsReques(req)  // get and parse request from user

    // Authenticate and authorize the WebSocket connection
    try {
      const decoded = jwt.verify(parsedReq.token, SERVER_SECRET_KEY) as {userId: string}
      // Push new user to connected users
      userConnections.set(decoded, ws)

      console.log('[WEBSOCKET] Authenticated WebSocket connection for user:', decoded.userId)

      ws.send(JSON.stringify({status: 200, msg: 'Authenticated WebSocket connection'}))

      // Handle WebSocket close connection
      ws.on('close', (ws) => {
        console.log('[WEBSOCKET]: client disconnected with event:', ws)
        console.log('[WEBSOCKET] Connections size:', userConnections.size)
        // Remove the WebSocket connection from the userConnections map
        userConnections.delete(decoded)
      })

      ws.on('message', (event) => {
        GettingUpdatesFromDb(event, ws)
      })
      
      console.log('[WEBSOCKET] Connections size:', userConnections.size)
      /**
       * Subscribe each connected user to DB update
       */
      // SubscribeToDbUpdate(userConnections)
    } catch (err) {
      console.log('Invalid or expired token')
      ws.terminate(); // Close the WebSocket connection
    }

  })
}