import express, { Router, Request, Response } from "express";
import {
  RegisterUserSchema,
} from "../../servises/RegisterUserDB/registerUserSchema.servise.js";
import multer from "multer";
import { ModuleSenderConfig } from "../../servises/ModuleSender/ModuleSender.js";
import S3 from "aws-sdk/clients/s3.js";



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
    
    // get saved distribution & replace filenames with proper path
    const savedDistribution = await ModuleSenderConfig.findById(svaedSenderConfig._id)
    savedDistribution.messages.forEach((msg, msgIndex) => {
      msg.media.forEach((filename, index) => {
        const newFileName = `${savedDistribution._id}/${msg._id}/${filename}`
        savedDistribution.messages[msgIndex].media[index] = newFileName
      })
    })
    await savedDistribution.save()

    return res.status(200).json({ message: "Successfully added new sender config", senderConfigData: svaedSenderConfig })
  } catch (err) {
    res.status(500).json({ message: `Internal server error. ${err}` })
  }
})

router.post('/new-distributioni-images', multer().none(), async (req: Request, res: Response) => {
  try {
    // parse image data from headers request
    let media: any[] = []
    try {
      // if was provided 1 file
      const parsedBodyMedia = JSON.parse(Object.assign({}, req.body).media)
      media = [parsedBodyMedia]
    } catch (error) {
      // if was provided multiple files
      media = Object.assign({}, req.body).media.map((media) => JSON.parse(media))
    }

    // console.log(media)

    let keys: string[] = []
    media.forEach((media) => {
      // convert image to base64 array
      const image =  Buffer.from(media.thumbUrl.slice(media.thumbUrl.indexOf(',')), 'base64')
      const splitedFileName = media.name.split('/')
      // upload media to buket
      const bucketKey = `${splitedFileName[0]}/${splitedFileName[1]}/${splitedFileName[2]}`
      keys.push(bucketKey)
      const uploadParams = { Bucket: 'tg_media', Key: bucketKey, Body: image }
      s3.upload({ ...uploadParams }).send((err, data) => {
        if (err) {
          console.log(`[S3]: Error occured: ${data}`)
        }
        if (data) {
          console.log({ s3SaveData: data })
        }
      })
    })

    // setTimeout(async () => {
    //   keys.forEach(async (key) => {
    //     const params = { Bucket: 'tg_media', Key: key }
    //     const res = await s3.getObject(params).promise()
    //     console.log({params})
    //     console.log({ savedFiles: res })
    //   })
    // }, 5000);
  
    return res.status(200).json({ message: "Files successfully uploaded" })
  } catch (error) {
    console.log(`[SENDER]: ${error}`)
    return res.status(500).json({message: `Error while uploading files: ${error}`})
  }
})


export default router;