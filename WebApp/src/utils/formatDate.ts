
/**
 * Returns formated date `dd month в hh:mm`
 */
export const formatDate = (date: Date | number): string => {
  const options: any = { month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return new Intl.DateTimeFormat('ru-US', options).format(new Date(date));
}
