
export const dateToFormat = (date: Date): string => {
  const daatet = new Date(date)
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  } as Intl.DateTimeFormatOptions; // define the date format options
  const formattedDate = daatet.toLocaleDateString('ru-RU', options)

  return formattedDate
}