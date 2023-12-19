import express, { Router, Request, Response } from "express";
import { RegisterUserSchema } from "../../servises/RegisterUserDB/registerUserSchema.servise";
import { ModuleSenderConfig } from "../../servises/ModuleSender/ModuleSender";

const router: Router = express.Router();

router.get('/delete-distribution/:mail/:folderId', async (req: Request, res: Response) => {
  try {
    const { mail, folderId } = req.params;

    await ModuleSenderConfig.deleteOne({ _id: folderId })
    const folders = await ModuleSenderConfig.find({ user_owner_mail: mail }).exec()
    res.status(200).json(folders)
  } catch (err) {
    res.status(500).json(`Internal server error. ${err}`)
  }
})

export default router;