export const getFirstLetter = (str?: string) => {
  if (str && str.length > 0) {
    return str[0].toUpperCase()
  }
  return '?'
}
