import type { MatcherFunction } from 'expect'

import { expect } from '@jest/globals'
import { Prisma } from '@prisma/client'

// A custom matcher to make jest support closeness comparisons on Prisma.Decimal objects.
// See https://jestjs.io/docs/expect#expectextendmatchers
const toBeCloseToDecimal: MatcherFunction<
  [expected: unknown, precision?: number]
> = function (received_, expected_, precision = 5) {
  if (
    received_ instanceof Prisma.Decimal ||
    expected_ instanceof Prisma.Decimal
  ) {
    throw new Error('Parameters received and expected must be of Decimal type')
  }
  const expected = expected_ as Prisma.Decimal
  const received = received_ as Prisma.Decimal

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
