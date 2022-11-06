import { Prisma } from '@prisma/client'

const TARGET_FRACTION = 0.9

export class BondingCurve {
  target: Prisma.Decimal

  constructor(target: Prisma.Decimal) {
    this.target = target
  }

  /* A scale factor k based on the fundraising target (90% sold) */
  scaleFactor = () => this.target.times(3).dividedBy(TARGET_FRACTION ** 3)

  /* The basic shape of the bonding curve: f(x) = kx^2.
     Note that the implied starting valuation here is 0. */
  valuationAt = (fraction: Prisma.Decimal) =>
    this.scaleFactor().times(fraction.toPower(2))

  /* The integral of the bonding curve: F(x) = (1/3)k * x^3.
     Note again that the implied starting valuation here is 0. */
  costAt = (fraction: Prisma.Decimal) =>
    this.scaleFactor().dividedBy(3).times(fraction.toPower(3))

  /* The inverse of the bonding curve: x = sqrt(y/k) */
  fractionAt = (valuation: Prisma.Decimal) =>
    valuation.dividedBy(this.scaleFactor()).squareRoot()

  /* Definite integral of the bonding curve between two fractions */
  costBetween = (fractionLow: Prisma.Decimal, fractionHigh: Prisma.Decimal) =>
    this.costAt(fractionHigh).minus(this.costAt(fractionLow))

  /* Convenience function for calculating the maximum valuation from a given size at a given
     starting valuation (e.g., a size of 0.5 could move the valuation from fraction 0.9 to 1.4 on
     the bonding curve) */
  valuationOfSize = (valuation: Prisma.Decimal, size: Prisma.Decimal) => {
    const fraction = this.fractionAt(valuation)
    return this.valuationAt(fraction.plus(size))
  }

  /* Convenience function for calculating the maximum fundraise from a given size at a given
     starting valuation (e.g., a size of 0.5 could move the valuation from fraction 0.9 to 1.4 on
     the bonding curve) */
  costOfSize = (
    valuation: Prisma.Decimal,
    size: Prisma.Decimal,
    offset: Prisma.Decimal = new Prisma.Decimal(0)
  ) => {
    const fractionLow = this.fractionAt(valuation).plus(offset)
    return this.costBetween(fractionLow, fractionLow.plus(size))
  }
}
