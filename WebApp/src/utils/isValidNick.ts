export const isValidNick = (nick: string): boolean => {
  const regex = /^[a-zA-Zа-яА-Я]*$/
  return regex.test(nick)
}