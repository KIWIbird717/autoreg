import express, { Router, Request, Response } from "express";
import {
  RegisterUserSchema,
} from "../../servises/RegisterUserDB/registerUserSchema.servise";
import { ModuleSenderConfig } from "../../servises/ModuleSender/ModuleSender";

const router: Router = express.Router();

router.post('/new-distribution', async (req: Request, res: Response) => {
  const {
    title,
    description,
    user_owner_mail,
    tg_bots,
    tg_users,
    chats,
    shared_users,
    status,
    loop_count,
    loop_count_max,
    time_each_loop,
    msg_per_user,
    total_msg_users,
    type_sender,
    type_target,
    messages,
    total_messages_sent,
    createdAt,
    updatedAt
  } = req.body

  try {
    const userMail = await RegisterUserSchema.findOne({ $or: [{ mail: user_owner_mail }] });
    if (!userMail) {
      res.status(404).json({ message: "User not found" });
      return;
    }
  
    const senderConfig = new ModuleSenderConfig({
      title,
      description,
      user_owner_mail,
      tg_bots,
      tg_users,
      chats,
      shared_users,
      status,
      loop_count,
      loop_count_max,
      time_each_loop,
      msg_per_user,
      total_msg_users,
      type_sender,
      type_target,
      messages,
      total_messages_sent,
      createdAt,
      updatedAt
    })
    const svaedSenderConfig = senderConfig.save();
  
    return res.status(200).json({ message: "Successfully added new sender config", senderConfigData: svaedSenderConfig })
  } catch (err) {
    res.status(500).json({ message: `Internal server error. ${err}` })
  }
})


export default router;