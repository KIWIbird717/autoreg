import express, { Router, Request, Response } from "express";
import {
  RegisterUserSchema,
} from "../../servises/RegisterUserDB/registerUserSchema.servise";

const router: Router = express.Router()

router.post('/delete-accounts-folder', async (req: Request, res: Response) => {
  try {
    const { mail, folderKey } = req.body

    // Find user by email
    const user = await RegisterUserSchema.findOne({ mail })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Find the folder index based on the folder key
    const newFolders = user.accountsManagerFolder.filter((folder) => folder.key !== folderKey)

    // Remove the folder from the user's accountManagerFolder array
    user.accountsManagerFolder = newFolders

    // Save the updated user
    await user.save()

    return res.status(200).json({ message: 'Folder deleted successfully', updatedFolders: user.accountsManagerFolder })
  } catch(err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

export default router