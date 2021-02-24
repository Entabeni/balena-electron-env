import { saveDateFormat, getDateFormat } from './dateFormat'

export function validateAll(validationFuncs) {
  return (value, values) => {
    let result = undefined
    validationFuncs.forEach(func => {
      if (!result) {
        if (values && Object.keys(values).length === 0) {
          result = func(value)
        } else {
          result = func(value, values)
        }
      }
    })
    return result
  }
}

export function validateRequired(value) {
  const wysiwygValueUnix = '<p></p>\n'
  const wysiwygValueWin = '<p></p>\n\r'
  const emptyRTEValue = '<p><br></p>'

  if (
    value === null ||
    value === undefined ||
    value === '' ||
    value === false ||
    value === emptyRTEValue ||
    value === wysiwygValueUnix ||
    value === wysiwygValueWin
  ) {
    return 'This value is required.'
  }
  return undefined
}

export function validateEmail(value) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (value && !re.test(value)) {
    return 'Please enter a valid email address.'
  }
  return undefined
}

export function validatePositiveNumber(value) {
  if (0 > +value) {
    return 'This value must be positive number'
  }

  return undefined
}

export function validateContainsEmail(value) {
  var re = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/im
  if (re.test(value)) {
    return 'This cannot contain an email address.'
  }
  return undefined
}

export function validateContainsPhoneNumber(value) {
  var re = /[0](\d{9})|([0](\d{2})( |-)((\d{3}))( |-)(\d{4}))|[0](\d{2})( |-)(\d{7})/im
  if (re.test(value)) {
    return 'This cannot contain a phone number.'
  }
  return undefined
}

export function validateContainsURL(value) {
  var re = /[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/im
  if (re.test(value)) {
    return 'This cannot contain a url.'
  }
  return undefined
}

export function validateIDNumber(value) {
  var re = /^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))$/
  if (re.test(value)) {
    return undefined
  }
  return 'This is not a valid ID number.'
}

export function validatePassportNumber(value) {
  var re = /^(?!^0+$)[a-zA-Z0-9]{6,9}$/
  if (re.test(value)) {
    return undefined
  }
  return 'This is not a valid Passport number.'
}

export function validateBankAccountNumber(value) {
  var re = /^[0-9]{9,11}$/
  if (re.test(value)) {
    return undefined
  }
  return 'This is not a valid Bank Account number.'
}

export function validateBranchCode(value) {
  var re = /^[0-9]{5,6}$/
  if (re.test(value)) {
    return undefined
  }
  return 'This is not a valid Branch Code.'
}

export function validatePhoneNumber(value) {
  var re = /^(\+\d{1,3}[- ]?)?\d{10}$/
  if (re.test(value)) {
    return undefined
  }
  return 'This is not a valid Phone number.'
}

export function validateSamePassword(values) {
  if (values && values.password === values.passwordConfirmation) {
    return undefined
  }
  return 'Passwords do not match.'
}

export function validatePassword(value) {
  var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/
  if (re.test(value)) {
    return undefined
  }
  return 'Please make sure your password contains at least one uppercase letter, one lowercase letter, and 1 number.'
}

export function validateMinChars(number) {
  if (!number) number = 0
  return value => {
    if (value.length < number) {
      return `This must be at least ${number} characters long.`
    }
    return undefined
  }
}

export function validateMaxChars(number) {
  if (!number) number = 0
  return value => {
    if (value.length > number) {
      return `This must be less than ${number} characters long.`
    }
    return undefined
  }
}

export function validateMaxOptions(number) {
  if (!number) number = 0
  return value => {
    if (!value) value = ''
    value = value.split(',')
    if (value.length > number) {
      return `Please only choose ${number} options.`
    }
    return undefined
  }
}

export function validateAgetoSelectProductAge(value) {
  const format = getDateFormat()
  const exp = /[/-]/
  const dateFormatArray = format.split(exp)
  let dateFormatExp = ''

  dateFormatArray.forEach((part, i) => {
    if (part === 'MM') {
      dateFormatExp += '(0[1-9]|1[012])'
    }
    if (part === 'DD') {
      dateFormatExp += '(0[1-9]|[12][0-9]|3[01])'
    }
    if (part === 'YYYY') {
      dateFormatExp += '\\d{4}'
    }
    if (i < 2) {
      dateFormatExp += '[/-]'
    }
  })

  let result = undefined
  if (value.search(dateFormatExp) === 0) {
    let now = new Date()
    let currentYear = now.getFullYear()
    let birthDate = new Date(saveDateFormat(value))
    let birthYear = birthDate.getFullYear()
    let age = currentYear - birthYear

    if (now < new Date(birthDate.setFullYear(currentYear))) {
      age = age - 1 // Calc for leap years
    }
    result = age
  }

  return result
}

export function validateDOB(value) {
  let result = undefined
  if (value) {
    const guestsAge = validateAgetoSelectProductAge(value)
    if (guestsAge === undefined || guestsAge < 0 || guestsAge > 100) {
      result = `Provide a valid date ${getDateFormat()}`
    }
  }
  return result
}

function getBirthDate(value) {
  return new Date(saveDateFormat(value))
}

export function validateForEndOfWinterSeasonMonth(minAge, maxAge, value, ageCalculationMethod, endOfWinterSeasonMonth, ageCalculationDate, ageOfMajority) {
  let now = new Date()
  let birthDate = getBirthDate(value)
  let dateToCheck

  if (ageCalculationMethod === 'dateOfTransaction' || ageOfMajority) {
    dateToCheck = now
  } else if (ageCalculationMethod === 'onGivenDate') {
    dateToCheck = new Date(ageCalculationDate)
  } else {
    let endOfWinterSeasonDate = new Date(new Date().getFullYear(), endOfWinterSeasonMonth, 0)
    if (now <= endOfWinterSeasonDate) {
      dateToCheck = new Date(new Date().getFullYear() - 1, 12, 0)
    } else {
      dateToCheck = new Date(new Date().getFullYear(), 12, 0)
    }
  }

  const ageDifMs = dateToCheck.getTime() - birthDate.getTime() - 86400000
  let ageDate = new Date(ageDifMs)
  let age = Math.abs(ageDate.getUTCFullYear() - 1970)

  if (ageOfMajority) {
    return age < parseInt(ageOfMajority, 10)
  }

  return age < minAge || age > maxAge
}

export function validatePurhaserAge(account) {
  return value => {
    const { ageOfMajority } = account
    const maskFormat = /(_{2})/
    const trimValue = !!value ? value : ''
    let result = null
    if (!maskFormat.test(value) && trimValue.trim().length === 10) {
      const guestsAge = validateAgetoSelectProductAge(value)

      if (!guestsAge) {
        result = `Please provide a valid date ${getDateFormat()}`
      } else if (ageOfMajority) {
        const dateToCheck = new Date()
        const birthDate = getBirthDate(value)
        const ageDifMs = dateToCheck.getTime() - birthDate.getTime()
        const ageDate = new Date(ageDifMs)
        const age = Math.abs(ageDate.getUTCFullYear() - 1970)

        if (age < parseInt(ageOfMajority, 10)) {
          result = 'Must be of legal age to sign waiver'
        }
      }
    }

    if (result === null) {
      result = undefined
    }

    return result
  }
}

export function validateAgeVar(ageVars, ageCalculationMethod, endOfWinterSeasonMonth, ageCalculationDate, ageOfMajority) {
  return value => {
    const maskFormat = /(_{2})/
    const trimValue = !!value ? value : ''
    let result = null

    if (!maskFormat.test(value) && trimValue.trim().length === 10) {
      const guestsAge = validateAgetoSelectProductAge(value)

      if (guestsAge == null || guestsAge < 0) {
        result = `Please provide a valid date ${getDateFormat()}`
      } else if (ageVars) {
        const minAge = ageVars.ageFrom
        const maxAge = ageVars.ageTo

        if (validateForEndOfWinterSeasonMonth(minAge, maxAge, value, ageCalculationMethod, endOfWinterSeasonMonth, ageCalculationDate, ageOfMajority)) {
          if (ageOfMajority) {
            result = 'Must be of legal age to sign waiver'
          } else {
            result = 'Age does not fall in the required range for this product'
          }
        }
      }
    }

    if (result === null) {
      result = undefined
    }

    return result
  }
}

export function validateCreditCardExpiryDate(dateValue) {
  const expMonthOptions = Array(12)
    .fill()
    .map((_, i) => {
      return (i + 1).toString().padStart(2, '0')
    })
  let currentYear = new Date().getFullYear() - 1 - 2000
  const expYearOptions = Array(10)
    .fill()
    .map((_, i) => {
      currentYear++
      return currentYear.toString()
    })
  if (dateValue.indexOf('_') === -1) {
    const dateValueMonth = dateValue.split('/')[0]
    const dateValueYear = dateValue.split('/')[1]

    if (expMonthOptions.includes(dateValueMonth) && expYearOptions.includes(dateValueYear)) {
      return undefined
    }
    return 'Date must be within 10 years in the future'
  }
  return 'Not a valid expiry date'
}
