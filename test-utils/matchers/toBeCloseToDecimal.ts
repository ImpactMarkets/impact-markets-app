import type { MatcherFunction } from 'expect'

import { expect } from '@jest/globals'
import { Prisma } from '@prisma/client'

// A custom matcher to make jest support closeness comparisons on Prisma.Decimal objects.
// See https://jestjs.io/docs/expect#expectextendmatchers
const toBeCloseToDecimal: MatcherFunction<
  [expected: Prisma.Decimal, precision?: number]
> = function (
  received: Prisma.Decimal,
  expected: Prisma.Decimal,
  precision: number = 5
) {
  const options = {
    comment: 'Check if two Prisma.Decimal objects are close in value',
    isNot: this.isNot,
    promise: this.promise,
  }

  const receivedDiff = expected.minus(received).abs()
  const expectedDiff = Math.pow(10, -precision) / 2
  const pass = receivedDiff.lessThan(expectedDiff)

  const message = pass
    ? () =>
        // We return a message even in the pass case, in case the user has preceded the matcher with `.isNot`
        this.utils.matcherHint(
          'toBeCloseToDecimal',
          undefined,
          undefined,
          options
        ) +
        '\n\n' +
        `Expected: not ${this.utils.printExpected(expected)}\n` +
        `Received:     ${this.utils.printReceived(received)}\n`
    : () =>
        this.utils.matcherHint(
          'toBeCloseToDecimal',
          undefined,
          undefined,
          options
        ) +
        '\n\n' +
        `Expected: ${this.utils.printExpected(expected)}\n` +
        `Received: ${this.utils.printReceived(received)}\n` +
        '\n' +
        `Expected precision:    ${precision}\n` +
        `Expected difference: < ${expectedDiff}\n` +
        `Received difference:   ${receivedDiff}`
  return { message, pass }
}

expect.extend({
  toBeCloseToDecimal,
})

declare module 'expect' {
  interface AsymmetricMatchers {
    toBeCloseToDecimal(expected: Prisma.Decimal, precision?: number): void
  }
  interface Matchers<R> {
    toBeCloseToDecimal(expected: Prisma.Decimal, precision?: number): R
  }
}
