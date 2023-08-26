import express, { Router, Request, Response } from "express";
import {
  RegisterUserSchema,
  IAccountsManagerFolder
} from "../../servises/RegisterUserDB/registerUserSchema.servise";

const router: Router = express.Router();

/**
 * request example:
 * {
 *  mail: string,
 *  accounts: [
    {
      key: string;
      avatar?: string;
      phoneNumber: string;
      resting: Date | number;
      userName: string;
      firstName?: string;
      lastName?: string;
      secondFacAith: string;
      proxy: string;
      latestActivity: Date;
      status: "success" | "warning" | "error" | string;
      telegramSession: string;
      apiId?: number;
      apiHash?: string;
    },
  ]
 * }
 */
router.post('/add-accounts-to-user', async (req: Request, res: Response) => {
  try {
    const { mail } = req.body
    const { folderKey } = req.body
    const accounts: IAccountsManagerFolder["accounts"] = req.body.accounts
  
    if (folderKey === undefined) {
      return res.status(400).json({ error: 'Key not selected' })
    }

    // Find the user by email
    const user = await RegisterUserSchema.findOne({ mail: mail })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Find the matching folder by key within the user's accountsManagerFolder
    const folder: IAccountsManagerFolder | undefined = user.accountsManagerFolder.find(
      (folder) => folder.key === folderKey
    )
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' })
    }

     // Push the new accounts to the 'accounts' field
     folder.accounts.push(...accounts)

     // Save the updated user
    await user.save()

    return res.status(200).json({ message: 'Accounts added successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router