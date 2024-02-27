import { WebSocketServer } from "ws"
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { WebSocket } from "ws";
import { RegisterUserSchema } from "../../servises/RegisterUserDB/registerUserSchema.servise.js";
import { LogsShema } from "../../servises/RegisterUserDB/LogsCollection/logsSchema.js";


dotenv.config()
const SERVER_SECRET_KEY = process.env.SERVER_SECRET_KEY

const UPDATE_INTERVAL = 5_000 // Update interval in ms.

/**
 * Subscribe to updates from MongoDB
 * 
 * For each client established it`s own protected connection.
 * Client from fronEnd side send his incrypted token which contains
 * user`s MongoDb ID
 * 
 * By this ID founds client`s data in DB and sends back every UPDATE_INTERVAL ms
 * @param wss: `WebSocketServer` 
 * @deprecated
 */
export const SubscribeToDbUpdate = async (connections: Map<{userId: string}, WebSocket>): Promise<void> => {
  setInterval(async () => {
    try {
      // Create update process for each client
      connections.forEach(async (client, userId) => {
        // reciev incripted client`s token
        console.log("[WS_SUBSCRIBE]: Send data to client:", userId.userId)
        const clietToken = userId

        // Find user in DB by clientToken decrypted id
        const userMail = await RegisterUserSchema.findById({ _id: clietToken.userId }).select('mail')
        // Find logs entity for user
        const logs = await LogsShema.findOne({ mail: userMail.mail })

        // Send MongoDb data to client
        if (client.readyState === WebSocket.OPEN) {
          if (logs) {
            client.send(JSON.stringify({status: 200, data: logs}))
          } else {
            client.send(JSON.stringify({status: 404, msg: "Logs not fount"}))
          }
        }
      })
    } catch (err) {
      console.error('\x1b[31m', `[WEBSOKET]: Error: ${err}`)
    }
  }, UPDATE_INTERVAL)
}