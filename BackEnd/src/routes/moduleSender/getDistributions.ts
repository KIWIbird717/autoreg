import express, { Router, Request, Response } from "express";
import { RegisterUserSchema } from "../../servises/RegisterUserDB/registerUserSchema.servise";
import { ModuleSenderConfig } from "../../servises/ModuleSender/ModuleSender";

const router: Router = express.Router();

router.get('/get-distributions/:mail', async (req: Request, res: Response) => {
  const { mail } = req.params
  try {
    // chek if user exists
    console.log(mail)
    const user = await RegisterUserSchema.findOne({ $or: [{mail}] });
    if (!user) return res.status(404).json('User not found')

    // find and return folders
    const folders = await ModuleSenderConfig.find({ user_owner_mail: mail }).exec()
    res.status(200).json(folders);
  } catch (err) {
    res.status(500).json(`Internal server error. ${err}`);
  }
})

export default router;