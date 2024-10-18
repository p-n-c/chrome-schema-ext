import { sum } from '../../publish/content_scripts/utils.js'

describe('utils tests', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(2, 1)).toBe(3)
  })
})
