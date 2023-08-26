import express, { Router, Request, Response } from "express";
import {
  RegisterUserSchema,
} from "../../servises/RegisterUserDB/registerUserSchema.servise";

const router: Router = express.Router()


router.post('/subscribe-to-db-update', async (req: Request, res: Response) => {
  const { mail } = req.body

  try {
    // Found user in DB and check if its exists
    const user = await RegisterUserSchema.findOne({ mail })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Subscribe to changes on the email field
   

    return res.status(200).json({ message: "Subscribed to user updates" })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: `Internal server error. ${err}` })
  }
})

export default router
