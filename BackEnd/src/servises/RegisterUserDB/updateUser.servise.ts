import { IRegisterUserSchema, IUserRes, RegisterUserSchema } from "./registerUserSchema.servise";

/**
 *  Update user data. Find user for mail and parse data based on `IUserRes` interface,
 *  you can find own in `registerUserSchema.servise.ts`
 *
 * @param mail - user mail [string]
 * @param updateData - data you want to update [IRegisterUserSchema]
 * @returns updatedUser [new user DB field] || null in case of an error
 * 
 * @example 
 * updateUser('123@mail.ru', { nick: 'Oleg', password: 'newpassword' })
    .then((updatedUser) => {
      if (updatedUser) {
        console.log(updatedUser);
      } else {
        console.log('User not found');
      }
  });
 */
export const updateUser = async (mail: string, updateData: Partial<IRegisterUserSchema> | null) => {
  try {
    const updatedUser = await RegisterUserSchema.updateOne(
      { mail: mail },
      { $set: updateData }
    );
    return updatedUser
  } catch (error) {
    console.error(error)
    return null
  }
}
