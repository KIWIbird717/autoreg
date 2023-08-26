import express, { Express, Request, Response } from "express"
import cors from "cors"

/**
 * Allows server using `json` formating & unlocks `cors` policy
 * 
 * @description
 * You can add more aditional settings to `Middleware`
 */
const Middleware = (app: Express): void => {
  app.use(cors())
  app.use(express.json())

  app.use((req: Request, res: Response, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.WEB_SITE_HEADER);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});
}

export default Middleware