import bcrypt from 'bcrypt'

/**
 * Compare unencrypted and encripted data
 * @returns `Promise<boolean>`
 */
export const customCompareDecription = async (pass: string, encryptedPass: string): Promise<boolean> => {
  return await bcrypt.compare(pass, encryptedPass)
}
