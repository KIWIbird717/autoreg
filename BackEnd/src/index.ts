import express, { Express, NextFunction, Request } from 'express';
import { registerRoutes } from "./utils/express/registerRoutes.js";
import Middleware from './middlewares/login.middleware.js';
import { dbConnection, dbDisconnection } from './servises/MongoDB/mongoDb.servise.js';

import dotenv from 'dotenv';
import path, { dirname } from "path";
import { WebSocketConnection } from './utils/webSocket/WebSocketConnection.js';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app: Express = express()


const ServerInitPoint = async (): Promise<void> => {
  try {
    //Connect to MongoDB 
    await dbConnection()

    // Middlewares
    Middleware(app)

    // Start server
    app.listen(process.env.PORT as string, () => {
      console.log("\x1b[36m", `[SERVER]: Running at ${process.env.URL}`)
    })

    // chek new user connection 
    app.use((req: Request, _, next: NextFunction) => {
      const ip = req.ip || req.socket.remoteAddress
      console.log('\x1b[33m%s\x1b[0m', `[SERVER]: Request from IP: ${ip}`)
      next()
    })
    
    // Auto-routing system
    const pagesPath = path.join(__dirname, "routes")
    registerRoutes(app, pagesPath, "/", () => {
      console.log("\x1b[36m", "[SERVER]: Pages loaded")
    })

    /**
     * WebSoket server init
     */
    WebSocketConnection(app)

  } catch(err) {
    throw err
  }
}

ServerInitPoint().catch( async (err: any) => {
  // Disconnect from MongoDB
  await dbDisconnection()
  console.error(err)
  process.exit(1)
})
