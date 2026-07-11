export const clamp = (
  number: number,
  boundOne: number,
  boundTwo?: number
): number => {
  if (boundTwo === undefined) {
    return Math.max(number, boundOne) === boundOne ? number : boundOne
  } else if (Math.min(number, boundOne) === number) {
    return boundOne
  } else if (Math.max(number, boundTwo) === number) {
    return boundTwo
  }
  return number
}
