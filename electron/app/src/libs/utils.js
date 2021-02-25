import { Common } from '../commons'

export function getCurrentFrontEndUrl() {
  const { protocol, host, href } = window.location
  const FRONT_END_URL = process.env.FRONT_END_URL

  // from settings
  let urlFromEnvVar
  if (FRONT_END_URL != null) {
    urlFromEnvVar = Common.FRONT_END_URLS[FRONT_END_URL]
  }

  // from url line
  let currentUrl = protocol + '//' + host + '/'
  if (href.indexOf('localhost') > -1) {
    currentUrl = Common.FRONT_END_URLS.ENTABENI
  }

  return urlFromEnvVar || currentUrl
}

export function formatCurrency(number) {
  number = +number
  return `${number < 0 ? '- ' : ''}$${number
    .toFixed(Number.isInteger(number) ? 0 : 2)
    .toString()
    .substring(number < 0 ? 1 : 0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

export function unique(arr, keyProps) {
  const kvArray = arr.map(entry => {
    const key = keyProps.map(k => entry[k]).join('|')
    return [key, entry]
  })
  const map = new Map(kvArray)
  return Array.from(map.values())
}

export function getProductPrice(specialPrice, price, qty = 1) {
  if (specialPrice === null || specialPrice === price) {
    return formatCurrency(price * qty)
  }
  return `${formatCurrency(specialPrice * qty)} (Save ${formatCurrency((price - specialPrice) * qty)})`
}

export function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
}

export function roundit(num) {
  if (num != null && num !== 0) {
    return (Math.round(num * 100) / 100).toFixed(2)
  }
  return null
}

export function cloneObject(object) {
  return JSON.parse(JSON.stringify(object))
}

export function getFloat(num) {
  return parseFloat(roundit(num))
}

export function debounce(fn, time) {
  let timeout

  return function() {
    const functionCall = () => fn.apply(this, arguments)

    clearTimeout(timeout)
    timeout = setTimeout(functionCall, time)
  }
}

export function uniqueId() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }

  return s4() + s4() + s4() + s4()
}

export function cmToFeetInches(n) {
  if (n != null && n !== 0) {
    const realFeet = (n * 0.3937) / 12
    const feet = parseInt(realFeet.toFixed(4))
    const inches = +((realFeet - feet) * 12).toFixed()
    return [feet, Math.abs(inches)]
  }
  return [null, null]
}

export function kgToLbs(n) {
  if (n != null && n !== 0) {
    return roundit(n * 2.2046)
  }
  return null
}

export function feetInchesToCm(f, i) {
  const feetCm = f * 30.48
  const inchesCm = i * 2.54
  return feetCm + inchesCm
}

export function lbsToKg(n) {
  return parseFloat((n / 2.2046).toString())
}

/**
 * Helper method to process and convert a HEX color code
 * @param   {string} HEXColorCode   - A HEX color code to convert to base-16 Hexadecimal values
 * @returns {object} An object containing regular RGB based values
 */
function convertHEXColorCodeToBase16(HEXColorCode) {
  if (HEXColorCode == null) {
    return null
  }

  if (HEXColorCode[0] === '#') {
    HEXColorCode = HEXColorCode.slice(1)
  }

  const b16OverallColorValue = parseInt(HEXColorCode, 16)
  const b16ColorValues = {
    r: b16OverallColorValue >> 16,
    g: (b16OverallColorValue >> 8) & 0x00ff,
    b: b16OverallColorValue & 0x0000ff
  }

  return b16ColorValues
}

/**
 * Helper method for verifying the luminosity of a color against a fixed threshold and determine
 * if it needs white colored elements above it in order to guarantee optimal contrast accessibility
 * Formulas and suggested approach from W3C guidelines at https://www.w3.org/TR/WCAG20/#relativeluminancedef
 * @param   {string}  bgColor   - The background color to check the luminosity
 * @returns {boolean} The flag to decide whether to use white or darker color above the in-here processed background color
 */
function checkContrast(bgColor) {
  let b16ColorValues = convertHEXColorCodeToBase16(bgColor)

  Object.keys(b16ColorValues).forEach(colorKey => {
    let color = b16ColorValues[colorKey] / 255
    b16ColorValues[colorKey] = color <= 0.03928 ? color / 12.92 : Math.pow((color + 0.055) / 1.055, 2.4)
  })

  b16ColorValues.r *= 0.2126
  b16ColorValues.g *= 0.7152
  b16ColorValues.b *= 0.0722

  // W3C's minimal and optimal threshold value for contrast accessibility
  return b16ColorValues.r + b16ColorValues.g + b16ColorValues.b > 0.179
}

/**
 * Helper method for ligthen/darken HEX color codes according to a relative percenteage
 * @param   {number} percentage     - An integer from -100 to 100. Negative numbers darken the color, positive numbers lighten it.
 * @param   {string} color          - A HEX color code to lighten or darken accordingly
 * @param   {string} onBackground   - A HEX color code which would be the eventual background for the previous color argument
 *                                    (Used for contrast purposes when the color param is gonna be used as foreground above this one)
 * @returns {string} Processed new lightened/darkened HEX color code
 */
export function shadeColor(percentage, color, onBackground) {
  if (color == null) {
    return null
  }

  // Verifiying the background color has enough luminosity to allow the use of the darkened foreground version of it
  // Otherwise use plain white as the ouput of this method in order to ensure optimal contrast accessibility (according to W3C guidelines)
  if (onBackground && !checkContrast(onBackground)) {
    return '#ffffff'
  }

  const b16ColorValues = convertHEXColorCodeToBase16(color)

  Object.keys(b16ColorValues).forEach(colorKey => {
    let colorPlusShadeValue = b16ColorValues[colorKey] + percentage

    if (colorPlusShadeValue > 255) {
      colorPlusShadeValue = 255
    } else if (colorPlusShadeValue < 0) {
      colorPlusShadeValue = 0
    }

    b16ColorValues[colorKey] = colorPlusShadeValue
  })

  // Fix for preventing empty color units on the resulting HEX color code and therefore generating an invalid color code
  let safeColorString = `000000${(b16ColorValues.b | (b16ColorValues.g << 8) | (b16ColorValues.r << 16)).toString(16)}`
  return `#${safeColorString.substr(safeColorString.length - 6)}`
}
