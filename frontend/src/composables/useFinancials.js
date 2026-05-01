import Big from 'big.js'

export function useFinancials() {
  /**
   * Calculates the total price including VAT (14%) using Big.js for precision
   * @param {number|string} price 
   * @returns {number}
   */
  const calculateTotalWithVat = (price) => {
    if (!price || Number(price) < 0) return 0
    
    try {
      const p = new Big(price)
      const vatRate = new Big(0.14)
      const vatAmount = p.times(vatRate)
      return Number(p.plus(vatAmount).toFixed(2))
    } catch (e) {
      return 0
    }
  }

  /**
   * Calculates the discount amount using Big.js for precision
   * @param {number|string} price 
   * @param {number|string} discountPercentage 
   * @returns {number}
   */
  const calculateDiscount = (price, discountPercentage) => {
    if (!price || !discountPercentage || Number(price) <= 0 || Number(discountPercentage) <= 0) return 0
    
    try {
      const p = new Big(price)
      const d = new Big(discountPercentage)
      
      if (d.gt(100)) return Number(p.toFixed(2))
      
      const discountAmount = p.times(d.div(100))
      return Number(discountAmount.toFixed(2))
    } catch (e) {
      return 0
    }
  }

  return {
    calculateTotalWithVat,
    calculateDiscount
  }
}
