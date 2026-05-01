import { describe, it, expect } from 'vitest'
import { useFinancials } from './useFinancials'

describe('useFinancials', () => {
  const { calculateTotalWithVat, calculateDiscount } = useFinancials()

  describe('calculateTotalWithVat', () => {
    it('should calculate 14% VAT correctly', () => {
      expect(calculateTotalWithVat(100)).toBe(114)
    })

    it('should handle zero price', () => {
      expect(calculateTotalWithVat(0)).toBe(0)
    })

    it('should return 0 for negative price', () => {
      expect(calculateTotalWithVat(-100)).toBe(0)
    })

    it('should handle decimal numbers correctly', () => {
      expect(calculateTotalWithVat(99.99)).toBe(113.99)
    })
  })

  describe('calculateDiscount', () => {
    it('should calculate discount amount correctly', () => {
      expect(calculateDiscount(100, 10)).toBe(10)
    })

    it('should handle 100% discount', () => {
      expect(calculateDiscount(100, 100)).toBe(100)
    })

    it('should not allow discount higher than 100%', () => {
      expect(calculateDiscount(100, 110)).toBe(100)
    })

    it('should return 0 for zero or negative discount', () => {
      expect(calculateDiscount(100, 0)).toBe(0)
      expect(calculateDiscount(100, -5)).toBe(0)
    })
  })
})
