import express, { Router, Request, Response } from "express"
import CreateNewUser from '../../servises/RegisterUserDB/addRegisterUser.servise'
import { RegisterUserSchema, IUserRes, IRegisterUserSchema } from '../../servises/RegisterUserDB/registerUserSchema.servise';
import { customCompareDecription } from "../../utils/hooks/customCompareDecryption.util";
import dotenv from 'dotenv'
import jwt from "jsonwebtoken";


dotenv.config()

const secretKey = process.env.SERVER_SECRET_KEY
const router: Router = express.Router()

router.post('/registration', async (req: Request, res: Response) => {
  // Get the data from the request body
  const { nick, mail, password, defaultAppHash, defaultAppId, accountsManagerFolder, proxyManagerFolder, parsingManagerFolder, recentAutoregActivity }: IRegisterUserSchema = req.body

  // Check if user already exists
  const existingUser: IUserRes | null = await RegisterUserSchema.findOne({$or: [{ mail }]})

  if (existingUser) {
    if (await customCompareDecription(password, existingUser.password)) {
      const existingUserAfterReg: IUserRes = await RegisterUserSchema.findOne({$or: [{ mail }]})
      // Create temp security token for user
      const token = jwt.sign({ userId: existingUserAfterReg._id }, secretKey, { expiresIn: '1h' }); // Expires in 1 hour
      return res.status(201).json(
        { 
          message: 'User registered successfully',
          token: token,
          data: {
            id: existingUserAfterReg._id,
            nick: existingUserAfterReg.nick,
            mail: existingUserAfterReg.mail,
            defaultAppHash: existingUserAfterReg.defaultAppHash,
            defaultAppId: existingUserAfterReg.defaultAppId,
            accountsManagerFolder: existingUserAfterReg.accountsManagerFolder,
            proxyManagerFolder: existingUserAfterReg.proxyManagerFolder,
            parsingManagerFolder: existingUserAfterReg.parsingManagerFolder,
            recentAutoregActivity: existingUserAfterReg.recentAutoregActivity,
            createdAt: existingUserAfterReg.createdAt,
            updatedAt: existingUserAfterReg.updatedAt,
            __v: existingUserAfterReg.__v
          }
        })
    } else {
      return res.status(400).json({ message: 'User with this email already exists' })
    }
  }

  // adding data about new User to MongoDB
  await CreateNewUser({
    nick, 
    mail, 
    password, 
    defaultAppHash,
    defaultAppId,
    accountsManagerFolder, 
    proxyManagerFolder, 
    parsingManagerFolder,
    recentAutoregActivity
  } as IRegisterUserSchema)
  const existingUserAfterReg: IUserRes = await RegisterUserSchema.findOne({$or: [{ mail }]})
  // Create temp security token for user
  const token = jwt.sign({ userId: existingUserAfterReg._id }, secretKey, { expiresIn: '1h' }); // Expires in 1 hour
  return res.status(201).json(
    { 
      message: 'User registered successfully',
      token: token,
      data: {
        id: existingUserAfterReg._id,
        nick: existingUserAfterReg.nick,
        mail: existingUserAfterReg.mail,
        defaultAppHash: existingUserAfterReg.defaultAppHash,
        defaultAppId: existingUserAfterReg.defaultAppId,
        accountsManagerFolder: existingUserAfterReg.accountsManagerFolder,
        proxyManagerFolder: existingUserAfterReg.proxyManagerFolder,
        parsingManagerFolder: existingUserAfterReg.parsingManagerFolder,
        recentAutoregActivity: existingUserAfterReg.recentAutoregActivity,
        createdAt: existingUserAfterReg.createdAt,
        updatedAt: existingUserAfterReg.updatedAt,
        __v: existingUserAfterReg.__v
      }
    })
})

export default router;