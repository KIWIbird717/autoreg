import express, { Router, Request, Response } from "express";
import { updateUser } from "../../servises/RegisterUserDB/updateUser.servise";

const router: Router = express.Router();

router.post('/update-apphash-appid', async (req: Request, res: Response) => {
  const { userMail, appHash, appId } = req.body

  updateUser(userMail, { defaultAppHash: appHash, defaultAppId: appId })
    .then((updatedUser) => {
      if (updatedUser) {
        return res.status(200).json(updatedUser)
      } else {
        return res.status(400).json("User not found")
      }
    })
})

export default router