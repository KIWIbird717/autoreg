import express, { Express, Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv";
dotenv.config();

/**
 * Allows server using `json` formating & unlocks `cors` policy
 * 
 * @description
 * You can add more aditional settings to `Middleware`
 */
const Middleware = (app: Express): void => {
  app.use(cors({
    origin: "*",
    credentials: true,
  }))
  console.log("\x1b[36m", `[SERVER]: Cors policy ${process.env.WEB_SITE_HEADER}`)
  app.use(express.json())
  // app.use(express.urlencoded({ extended: true }));

  app.use((req: Request, res: Response, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', "*");

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
  });
}

export default Middleware