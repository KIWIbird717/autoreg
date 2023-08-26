import bcrypt from 'bcrypt'

/**
 * Using a hashing algorithm to securely store the user's data in the database. 
 * Library: `bcrypt`, salt rounds: `10`
 */
export const customEncryption = (data: string): string => {
  const saltRounds: number = 10
  const salt: string = bcrypt.genSaltSync(saltRounds)

  return bcrypt.hashSync(data, salt)
}