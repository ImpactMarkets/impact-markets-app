import { Prisma } from '@prisma/client'

export function capitalize(string: string) {
  if (!string) return string
  return string[0].toUpperCase() + string.substring(1)
}

export function isCharacterALetter(char: string) {
  return /[a-zA-Z]/.test(char)
}

export function num(
  number: Prisma.Decimal,
  decimals: number | undefined = undefined
) {
  return number.toNumber().toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}
