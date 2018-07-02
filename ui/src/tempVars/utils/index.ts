export const trimAndRemoveQuotes = elt => {
  const trimmed = elt.trim()
  const dequoted = trimmed.replace(/(^")|("$)/g, '')

  return dequoted
}
