export const formatPhoneNumber = (value: string): string => {
  const phoneNumbersOnly = value.replace(/[^\d]/g, '');
  const match = phoneNumbersOnly.match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
  }
  return value;
}