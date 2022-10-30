import { Prisma } from '@prisma/client'

const TARGET_FRACTION = 0.9

export class BondingCurve {
  target: Prisma.Decimal

  constructor(target: Prisma.Decimal) {
    this.target = target
  }

  /* A scale factor k based on the fundraising target (90% sold) */
  scaleFactor = () => this.target.times(3).dividedBy(TARGET_FRACTION ** 3)

  /* The basic shape of the bonding curve: f(x) = kx^2 */
  valuationAt = (fraction: Prisma.Decimal) =>
    this.scaleFactor().times(fraction.toPower(2))

  /* The integral of the bonding curve: F(x) = (1/3)k * x^3 */
  costAt = (fraction: Prisma.Decimal) =>
    this.scaleFactor().dividedBy(3).times(fraction.toPower(3))

  /* The inverse of the bonding curve: x = sqrt(y/k) */
  fractionAt = (valuation: Prisma.Decimal) =>
    valuation.dividedBy(this.scaleFactor()).squareRoot()

  /* Definite integral of the bonding curve between a calculated fraction that corresponds to the
     starting valuation and the sum of that fraction and the given fraction */
  costBetween = (valuation: Prisma.Decimal, fraction: Prisma.Decimal) =>
    this.costAt(this.fractionAt(valuation).plus(fraction)).minus(
      this.costAt(this.fractionAt(valuation))
    )
}
