import express, { Router, Request, Response } from "express";
import {
  RegisterUserSchema,
  IUserRes
} from "../../servises/RegisterUserDB/registerUserSchema.servise";

const router: Router = express.Router();

router.post('/add-new-folder', async (req: Request, res: Response) => {
  try {
    const { mail } = req.body
    const folder = req.body.folder
    console.log(folder)

    const result = await RegisterUserSchema.updateOne(
      { mail: mail },
      { $push: { parsingManagerFolder: folder } }
    )
    if (result.modifiedCount > 0) {
      return res.status(200).json(result)
    } else {
      return res.status(501).json('Ошибка при создании новой папки')
    }
  } catch (err) {
    return res.status(500).json(err)
  }
})

router.get('/get-pasing-folders/:mail', async (req: Request, res: Response) => {
  try {
    const { mail } = req.params
    const user: IUserRes = await RegisterUserSchema.findOne({ $or: [{mail}] })
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }
    const parsingFolders = user.parsingManagerFolder
    res.status(200).json(parsingFolders)
  } catch (err) {
    res.status(500).json({ message: 'Failed to get parse folders' })
  }
})

router.post('/delete-parsing-folder', async (req: Request, res: Response) => {
  try {
    const { mail } = req.body
    const { folderKey } = req.body
    const user = await RegisterUserSchema.findOne({ $or: [{mail}] })
    if (!user) {
      res.status(404).json({ message: 'User nor found' })
      return
    }
    const parsingFolders = user.parsingManagerFolder
    const newParsingFoldersArray = parsingFolders.filter((folder) => folder.key !== folderKey)

    user.parsingManagerFolder = newParsingFoldersArray
    await user.save()
    res.status(200).json({ message: `Folder with key: ${folderKey} successfuly deleted` })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete parse folders', error: err })
  }
})

export default router
