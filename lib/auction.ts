import { Prisma } from '@prisma/client'

import { TARGET_FRACTION } from './constants'

export class BondingCurve {
  target: Prisma.Decimal

  constructor(target: Prisma.Decimal) {
    this.target = target
  }

  /* A scale factor k based on the fundraising target (90% sold) */
  scaleFactor = () => this.target.times(3).dividedBy(TARGET_FRACTION ** 3)

  /* The main functions */

  /* The basic shape of the bonding curve: f(x) = kx^2.
     Note that the implied starting valuation here is 0. */
  valuationAtFraction = (fraction: Prisma.Decimal) =>
    this.scaleFactor().times(fraction.toPower(2))

  /* The inverse of the bonding curve: x = sqrt(y/k) */
  fractionAtValuation = (valuation: Prisma.Decimal) =>
    valuation.dividedBy(this.scaleFactor()).squareRoot()

  /* The indefinite integral */

  /* The integral of the bonding curve: F(x) = (1/3)k * x^3.
     Note again that the implied starting valuation here is 0. */
  costAtFraction = (fraction: Prisma.Decimal) =>
    this.scaleFactor().dividedBy(3).times(fraction.toPower(3))

  /* The integral of the bonding curve solved for x: x = (3y/k)^(1/3) */
  fractionAtCost = (cost: Prisma.Decimal) =>
    cost
      .dividedBy(this.scaleFactor())
      .times(3)
      .toPower(1 / 3)

  /* The definite integral */

  /* Definite integral of the bonding curve between two fractions */
  costBetweenFractions = (
    fractionLow: Prisma.Decimal,
    fractionHigh: Prisma.Decimal
  ) => this.costAtFraction(fractionHigh).minus(this.costAtFraction(fractionLow))

  /* Definite integral of the inverted bonding curve between two costs */
  sizeBetweenCosts = (costLow: Prisma.Decimal, costHigh: Prisma.Decimal) =>
    this.fractionAtCost(costHigh).minus(this.fractionAtCost(costLow))

  /* Other stuff */

  /* Convenience function for calculating the maximum valuation from a given size at a given
     starting valuation (e.g., a size of 0.5 could move the valuation from fraction 0.9 to 1.4 on
     the bonding curve) */
  valuationOfSize = (valuation: Prisma.Decimal, size: Prisma.Decimal) => {
    const fraction = this.fractionAtValuation(valuation)
    return this.valuationAtFraction(fraction.plus(size))
  }

  /* Convenience function for calculating the maximum fundraise from a given size at a given
     starting valuation (e.g., a size of 0.5 could move the valuation from fraction 0.9 to 1.4 on
     the bonding curve) */
  costOfSize = (
    valuation: Prisma.Decimal,
    size: Prisma.Decimal,
    offset: Prisma.Decimal = new Prisma.Decimal(0)
  ) => {
    const fractionLow = this.fractionAtValuation(valuation).plus(offset)
    return this.costBetweenFractions(fractionLow, fractionLow.plus(size))
  }

  /* Convenience function for calculating the maximum fundraise from a given size at a given
     starting valuation (e.g., a size of 0.5 could move the valuation from fraction 0.9 to 1.4 on
     the bonding curve) */
  sizeOfCost = (
    valuation: Prisma.Decimal,
    cost: Prisma.Decimal,
    offset: Prisma.Decimal = new Prisma.Decimal(0)
  ) => {
    const fractionLow = this.fractionAtValuation(valuation).plus(offset)
    const costLow = this.costAtFraction(fractionLow)
    const costHigh = costLow.plus(cost)
    return this.sizeBetweenCosts(costLow, costHigh)
  }
}
