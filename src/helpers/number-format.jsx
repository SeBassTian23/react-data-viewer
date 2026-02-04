/**
 * Format Number 
 * Provide a reasonable format for a number
 * @param {number} input - Number to format
 * @param {number} digits - Number of digits
 * @param {string} notation - 'auto', 'standard', 'scientific' (default: 'auto')
 * @returns {number} Formatted number
 */
export default function numberFormat(input, digits=3, notation='auto'){
  if(Number.isNaN(input) || input === null || input === undefined)
    return 'NaN'
  
  if( input === 0)
    return 0

  switch(notation){
    case 'auto':
      if(Number.isInteger(input) && Math.abs(input) <= 9999)
        return input
      if(Math.abs(input) > 9999 || Math.abs(input) < 0.0001)
        return input.toExponential(digits)
      return input.toFixed(digits)

    case 'standard':
      if(Number.isInteger(input))
        return input
      else
        return input.toFixed(digits)

    case 'scientific':
      return input.toExponential(digits)

    default:
      return input
  }
}