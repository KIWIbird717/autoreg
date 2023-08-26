import mongoose, { Connection } from "mongoose"
import dotenv from 'dotenv';


dotenv.config();

const DB_URL = process.env.DB_URL

/**
 * Create connection with MongoDB. Log `connections` and `errors`
 * @description
 * You can specify connect options by adding an Object in `mongoose.connect()`
 */
export const dbConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(DB_URL as string)

    const db: Connection = mongoose.connection
    
    db.on('error', (err) => {
      console.error("\x1B[31m", `[MongoDB]: Error. ${err}`)
    })
    
    db.on('connection', (stream) => {
      console.log("\x1b[32m", `[MongoDB]: New connection. ${stream}`)
    })

    console.log("\x1b[32m", '[MongoDB]: Status OK. DB successfully connected')
  } catch(err) {
    throw new Error(`[MongoDB]: Can not connect to MongoDB. ${err}`)
  }
}

/**
 * Disconnect from MongoDB
 */
export const dbDisconnection = async (): Promise<void> => {
  try {
    await mongoose.connection.close()

    console.log("\x1b[32m", '[MongoDB]: Disconnected from MongoDB')
  } catch(err) {
    throw new Error(`[MongoDB]: Can not disconnect from MongoDB. ${err}`)
  }
}
