import express, { Router, Request, Response } from "express";
import {
  RegisterUserSchema,
} from "../../servises/RegisterUserDB/registerUserSchema.servise";
import multer from "multer";
import { ModuleSenderConfig } from "../../servises/ModuleSender/ModuleSender";
import S3 from "aws-sdk/clients/s3";


const router: Router = express.Router();

/** @description Create S3 store */
const s3 = new S3({
  accessKeyId: 'cw50994',
  secretAccessKey: 'd0066ce569287e8ec11617bcbfdcddc4',
  endpoint: 'https://s3.timeweb.com',
  s3ForcePathStyle: true,
  region: 'ru-1',
  apiVersion: 'latest',
})


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
    const svaedSenderConfig = await senderConfig.save();
  
    return res.status(200).json({ message: "Successfully added new sender config", senderConfigData: svaedSenderConfig })
  } catch (err) {
    res.status(500).json({ message: `Internal server error. ${err}` })
  }
})

router.post('/new-distributioni-images', multer().none(), async (req: Request, res: Response) => {
  try {
    // parse image data from headers request
    const media = Object.assign({}, req.body).media.map((media) => JSON.parse(media))
  
    let keys: string[] = []
    media.forEach((media) => {
      // convert image to base64 array
      const image =  Buffer.from(media.thumbUrl.slice(media.thumbUrl.indexOf(',')), 'base64')
      const splitedFileName = media.name.split('/')
      // upload media to buket
      const bucketKey = `${splitedFileName[0]}/${splitedFileName[1]}/${splitedFileName[2]}`
      keys.push(bucketKey)
      const uploadParams = { Bucket: 'tg_media', Key: bucketKey, Body: image }
      s3.upload({ ...uploadParams }).promise()
    })
  
    return res.status(200)
  } catch (error) {
    console.log(`[SENDER]: ${error}`)
  }
})


export default router;