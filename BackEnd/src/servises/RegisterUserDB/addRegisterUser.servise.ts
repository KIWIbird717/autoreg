import { RegisterUserSchema, IRegisterUserSchema } from './registerUserSchema.servise'
import { customEncryption } from '../../utils/hooks/customEncryption.util'

/**
 * New `User` DB schema 
 * 
 * @description
 * Registrate new user in application
 */
const CreateNewUser = async (props: IRegisterUserSchema): Promise<IRegisterUserSchema> => {
  const post = new RegisterUserSchema({ 
    nick: props.nick,
    mail: props.mail, 
    password: customEncryption(props.password),
    defaultAppHash: props.defaultAppHash,
    defaultAppId: props.defaultAppId,
    accountsManagerFolder: props.accountsManagerFolder,
    proxyManagerFolder: props.proxyManagerFolder,
    parsingManagerFolder: props.parsingManagerFolder,
    recentAutoregActivity: props.recentAutoregActivity
  })
  const savePost = await post.save()

  return savePost
}

export default CreateNewUser