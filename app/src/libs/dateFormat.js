import dayjs from 'dayjs'
import moment from 'moment-timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export function getDateFormat() {
  return window.localStorage.getItem('dateFormat') || 'MM/DD/YYYY'
}

export function saveDateFormat(date) {
  const format = getDateFormat()
  return dayjs(date, format).format('YYYY/MM/DD')
}

export function getDobInputMask() {
  const format = getDateFormat()
  const exp = /[a-zA-Z]/
  const re = new RegExp(exp, 'g')
  return format.replace(re, '9')
}

export function filterDateFormat(date) {
  const formatString = window.localStorage.getItem('dateFormat') || 'MM/DD/YYYY'
  return moment(date).format(formatString)
}

export function parseDate(date) {
  if (date != null) {
    return dayjs(date, 'YYYY-MM-DD').toDate()
  }
  return dayjs('1970-01-10').toDate()
}

export function displayDateFormat(date) {
  const formatString = getDateFormat()
  const formattedDate = moment(date).format(formatString)
  return formattedDate === 'Invalid date' ? 'Not Set' : formattedDate
}

export function displayTimeFormat(time) {
  return dayjs(time, 'HH:mm').format('h:mm a')
}

export function getAge(dateOfBirth) {
  const ageDifMs = Date.now() - dateOfBirth.getTime()
  const ageDate = new Date(ageDifMs)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

export function reFormatTimeZone(timeZone) {
  if (timeZone.includes('Mountain Time')) {
    return 'America/Denver'
  } else if (timeZone.includes('Pacific Time')) {
    return 'America/Los_Angeles'
  } else if (timeZone.includes('Central Time')) {
    return 'America/Chicago'
  } else if (timeZone.includes('Eastern Time')) {
    return 'America/Atlanta'
  }
}

export function formatStandartDateForPicker(date) {
  const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
  const monthIndex = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
  const year = date.getFullYear()
  const dateFormat = getDateFormat()
  let separator = '/'
  if (dateFormat.indexOf('-') != -1) {
    separator = '-'
  } else if (dateFormat.indexOf('/') != -1) {
    separator = '/'
  }

  const exp = /[/-]/
  const dateFormatArray = dateFormat.split(exp)

  let value = ''
  dateFormatArray.forEach((part, i) => {
    if (part === 'MM') {
      value += `${monthIndex}`
    }
    if (part === 'DD') {
      value += `${day}`
    }
    if (part === 'YYYY') {
      value += `${year}`
    }
    if (i < 2) {
      value += `${separator}`
    }
  })

  return value
}

export function parseDateToFormat(date, account, withTime = true) {
  let newDateFormatString = `${getDateFormat()} `
  if (account && account.dateTimeFormat && withTime) {
    const format = account.dateTimeFormat.split('%')
    format.forEach(f => {
      if (f != null) {
        switch (f) {
          case 'I:':
            newDateFormatString += 'hh:'
            break
          case 'H:':
            newDateFormatString += 'HH:'
            break
          case 'M ':
            newDateFormatString += 'mm '
            break
          case 'M':
            newDateFormatString += 'mm'
            break
          case 'p':
            newDateFormatString += 'a'
            break
        }
      }
    })
  }

  if (account && account.timeZone) {
    return moment.tz(moment(date).format('YYYY-MM-DDTHH:mm:ss.SSSZZ'), reFormatTimeZone(account.timeZone)).format(newDateFormatString)
  } else {
    return moment(date).format(newDateFormatString)
  }
}

export const accountDateFormatMap = {
  '%m/%d/%Y': 'MM/DD/YYYY',
  '%d/%m/%Y': 'DD/MM/YYYY'
}
