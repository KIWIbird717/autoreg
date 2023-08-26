import express, { Router, Request, Response } from "express";
import {
  RegisterUserSchema,
  IAccountsManagerFolder,
  IUserRes
} from "../../servises/RegisterUserDB/registerUserSchema.servise";

const router: Router = express.Router();

router.post('/add-new-folder', async (req: Request, res: Response) => {
  try {
    const { mail, folderTitle, folderDescription } = req.body

    // validate request
    if (!mail) return res.status(400).json({ message: 'Bad request. Select mail' })
    if (!folderTitle) return res.status(400).json({ message: 'Bad request. Select folderTitle' })
    if (!folderDescription) return res.status(400).json({ message: 'Bad request. Select folderDescription' })

    const user = await RegisterUserSchema.findOne({ mail })
    if (!user) return res.status(404).json({ message: 'User not found' })

    // find latest folder key
    const accountsManagerFolders = user.accountsManagerFolder
    let dinamicKey = Math.max(...accountsManagerFolders.map((folder) => Number(folder.key)))
    console.log(dinamicKey)
    if (dinamicKey < 0) dinamicKey = 0

    // create new folder
    const newKey = dinamicKey + 1
    const newFolder = {
      key: newKey.toString(),
      apiHash: null,
      apiId: null,
      folder: folderTitle,
      dopTitle: folderDescription,
      accountsAmount: 0,
      country: 'Не указано',
      latestActivity: new Date(),
      banned: 0,
      accounts: [],
    }

    const updatedUser = await RegisterUserSchema.findOneAndUpdate(
      { mail: mail },
      { $push: { 'accountsManagerFolder': newFolder } },
      { new: true },
    )

    const newFolderFromDB = updatedUser.accountsManagerFolder.filter((folder) => folder.key == newKey.toString())
    
    return res.status(200).json({ message: 'Seccessfully added new folder', updatedFolders: updatedUser.accountsManagerFolder, newFolder: newFolderFromDB[0] })
  } catch(err) {
    return res.status(500).json({ error: err })
  }
})

router.get('/get-accounts-folders/:mail', async (req: Request, res: Response) => {
  try{
    const { mail } = req.params

    const user: IUserRes = await RegisterUserSchema.findOne({ $or: [{ mail }] })
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const accountFolders = user.accountsManagerFolder
    res.status(200).json(accountFolders)
  } catch(err) {
    res.status(500).json({ message: 'Failed to get account folders' })
  }
})

export default router