import type { MatcherFunction } from 'expect'

import { expect } from '@jest/globals'
import { test } from '@jest/globals'
import { Prisma } from '@prisma/client'

import { BondingCurve } from '../../../lib/auction'
import { TARGET_FRACTION } from '../../../lib/constants'
import '../../../testUtils/matchers/toBeCloseToDecimal'

const { calculus } = require('numbers')

const zero = new Prisma.Decimal(0)
const targetFracDecimal = new Prisma.Decimal(TARGET_FRACTION)

const curves: BondingCurve[] = [1, 1e2, 1e4, 1e5, 1e10, 654321].map(
  (target) => new BondingCurve(new Prisma.Decimal(target))
)

test('valuation and cost are 0 iff fraction is 0', () => {
  curves.forEach((curve) => {
    expect(curve.valuationAtFraction(zero)).toStrictEqual(zero)
    expect(curve.costAtFraction(zero)).toStrictEqual(zero)
    expect(curve.fractionAtValuation(zero)).toStrictEqual(zero)
    expect(curve.fractionAtCost(zero)).toStrictEqual(zero)
  })
})

test('cost is `target` iff fraction is `TARGET_FRACTION`', () => {
  curves.forEach((curve) => {
    expect(curve.costAtFraction(targetFracDecimal)).toBeCloseToDecimal(
      curve.target
    )
    expect(curve.fractionAtCost(curve.target)).toBeCloseToDecimal(
      targetFracDecimal
    )
  })
})

test('bonding curve is strictly increasing', () => {
  const begEndFracPairs: number[][] = [
    [0.01, 2.5],
    [3.0, 10.0],
  ]

  curves.forEach((curve) => {
    begEndFracPairs.forEach((pair) => {
      let [begFrac, endFrac] = pair

      for (
        let fracPointFloat = begFrac;
        fracPointFloat < endFrac;
        fracPointFloat += 0.01
      ) {
        const fracPoint = new Prisma.Decimal(fracPointFloat)
        const prevFracPoint = fracPoint.minus(0.01)

        // Valuation always increases.
        expect(
          curve.valuationAtFraction(prevFracPoint).toNumber()
        ).toBeLessThan(curve.valuationAtFraction(fracPoint).toNumber())

        // Cost always increases.
        expect(curve.costAtFraction(prevFracPoint).toNumber()).toBeLessThan(
          curve.costAtFraction(fracPoint).toNumber()
        )
      }
    })
  })
})

test('costs along subsegments add up to cost along full segment', () => {
  const fracPointSegments: number[][] = [
    [0.0, 0.1, 0.2, 0.3],
    [0.3, 0.5, 0.75, 1.23],
    [0.0, 0.1, 0.2, 0.3, 0.5, 0.75, 1.23],
  ]

  curves.forEach((curve) => {
    fracPointSegments.forEach((fracPointSegment) => {
      var fracPoints: Prisma.Decimal[] = fracPointSegment.map(
        (num) => new Prisma.Decimal(num)
      )

      var summedCost = new Prisma.Decimal(0)
      for (var i = 1; i < fracPoints.length; i++) {
        summedCost = summedCost.plus(
          curve.costBetweenFractions(fracPoints[i - 1], fracPoints[i])
        )
      }
      const fullCost = curve.costBetweenFractions(
        fracPoints[0],
        fracPoints[fracPoints.length - 1]
      )

      expect(summedCost).toBeCloseToDecimal(fullCost)
    })
  })
})

test('cost functions match numerical Riemann sums', () => {
  // A convenience function to wrap the bonding curve functions, which take and return Prisma.Decimal,
  // and make them take and return vanilla typescript (float) numbers.
  //
  // This is necessary to make the bonding curve functions work with calculus.Riemann.
  function floatWrap(
    decimalFn: (decimalArg: Prisma.Decimal) => Prisma.Decimal
  ) {
    function floatInputFn(floatArg: number) {
      return decimalFn(new Prisma.Decimal(floatArg)).toNumber()
    }
    return floatInputFn
  }

  const begEndFracPairs: number[][] = [
    [0.0, 1.0],
    [0.5, 0.86],
    [1.0, 1.5],
  ]

  // Calculate Riemann sums and compare to the closed-form integral function results.
  curves.forEach((curve) => {
    begEndFracPairs.forEach((pair) => {
      let [begFrac, endFrac] = pair

      const begVal = curve.valuationAtFraction(new Prisma.Decimal(begFrac))
      const fracSize = new Prisma.Decimal(endFrac - begFrac)

      // costAtFraction
      var exactIntegral = curve.costAtFraction(new Prisma.Decimal(endFrac))
      var riemannIntegral = calculus.Riemann(
        floatWrap(curve.valuationAtFraction),
        0,
        endFrac,
        5000
      )
      var exactVsRiemannQuotient = exactIntegral.toNumber() / riemannIntegral
      expect(exactVsRiemannQuotient).toBeCloseTo(1.0)

      // costBetweenFractions
      exactIntegral = curve.costBetweenFractions(
        new Prisma.Decimal(begFrac),
        new Prisma.Decimal(endFrac)
      )
      riemannIntegral = calculus.Riemann(
        floatWrap(curve.valuationAtFraction),
        begFrac,
        endFrac,
        5000
      )
      exactVsRiemannQuotient = exactIntegral.toNumber() / riemannIntegral
      expect(exactVsRiemannQuotient).toBeCloseTo(1.0)

      // costOfSize
      exactIntegral = curve.costOfSize(begVal, fracSize)
      riemannIntegral = calculus.Riemann(
        floatWrap(curve.valuationAtFraction),
        begFrac,
        endFrac,
        5000
      )
      exactVsRiemannQuotient = exactIntegral.toNumber() / riemannIntegral
      expect(exactVsRiemannQuotient).toBeCloseTo(1.0)
    })
  })
})

test('mutual inverse operations cancel each other out', () => {
  const fracs = [0, 0.5, 1.0, 1.5].map((num) => new Prisma.Decimal(num))
  const vals = [0, 10, 123.45, 65432].map((num) => new Prisma.Decimal(num))
  const costs = [0, 1235, 100001].map((num) => new Prisma.Decimal(num))
  const sizes = [0, 0.35, 0.8, 1.0].map((num) => new Prisma.Decimal(num))

  curves.forEach((curve) => {
    vals.forEach((val) => {
      expect(
        curve.valuationAtFraction(curve.fractionAtValuation(val))
      ).toBeCloseToDecimal(val)
    })

    fracs.forEach((frac) => {
      expect(
        curve.fractionAtValuation(curve.valuationAtFraction(frac))
      ).toBeCloseToDecimal(frac)
      expect(
        curve.fractionAtCost(curve.costAtFraction(frac))
      ).toBeCloseToDecimal(frac)
    })

    costs.forEach((cost) => {
      expect(
        curve.costAtFraction(curve.fractionAtCost(cost))
      ).toBeCloseToDecimal(cost)
    })

    vals.forEach((val) => {
      costs.forEach((cost) => {
        expect(
          curve.costOfSize(val, curve.sizeOfCost(val, cost))
        ).toBeCloseToDecimal(cost)
      })
      sizes.forEach((size) => {
        expect(
          curve.sizeOfCost(val, curve.costOfSize(val, size))
        ).toBeCloseToDecimal(size)
      })
    })
  })
})
