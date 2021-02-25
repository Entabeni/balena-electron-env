const { Printer, Image } = require('escpos')
const USB = require('escpos-usb')
const fs = require('fs')

const receiptVendorId = process.env.RECEIPT_VENDOR_ID || '0x0483'
const receiptProductId = process.env.RECEIPT_PROCDUCT_ID || '0x5743'
const currency = '$'
const resortLogo = process.env.LOGO || 'cooper'
function addSpaces(str, strLength) {
  if (str.length < strLength) {
    const spaces = strLength - str.length
    for (var i = 1; i <= spaces; i++) {
      str = str + ' '
    }
  }
  return str
}
function getRounded(num) {
  //@ts-ignore
  return parseFloat(Math.round(num * 100) / 100).toFixed(2)
}

function printReceiptHeader(printer, image, data) {
  printer
    .align('CT')
    .size(0, 0)
    .style('NORMAL')

  // Resort logo
  if (image) {
    //@ts-ignore
    printer.raster(image).feed(2)
  }

  // Resort address
  if (data && data.resortInfo && data.resortInfo.addressLine1) {
    printer.println(data.resortInfo.addressLine1)
  }

  if (data && data.resortInfo && data.resortInfo.addressLine2) {
    printer.println(data.resortInfo.addressLine2)
  }

  if (data && data.resortInfo && data.resortInfo.addressLine3) {
    printer.print(data.resortInfo.addressLine3)
  }

  if (data && data.resortInfo && data.resortInfo.zipCode) {
    printer.println(', ' + data.resortInfo.zipCode)
  } else {
    printer.feed()
  }

  if (data && data.resortInfo && data.resortInfo.addressLine4) {
    printer.println(data.resortInfo.addressLine4)
  }

  printer.feed(2)
}
function printReceiptCashoutBody(printer, data) {
  // Sales info

  printer
    .println('Sales Cashout')
    .feed(2)
    .align('LT')

  if (data.printTerminal) {
    printer.println('Cashout for POS terminal: ' + data.printTerminal)
  }
  if (data.posSessionOpenedAtFormatted) {
    printer.println('POS Opened at: ' + data.posSessionOpenedAtFormatted)
  }
  if (data.posSessionClosedAtFormatted) {
    printer.println('POS Closed at: ' + data.posSessionClosedAtFormatted)
  }
  if (data.openingBalance) {
    printer.println('Opening Balance: ' + currency + data.openingBalance)
  }
  if (data.closingBalance) {
    printer.println('Closing Balance: ' + currency + data.closingBalance)
  }
  if (data.overShort) {
    printer.println('Over/Short:' + currency + data.overShort)
  }

  printer
    .feed()
    .println('------------------------------------------------')
    .feed()

  // Payment methods
  if (data.paymentMethods && data.paymentMethods.length) {
    printer
      .style('B')
      .println(addSpaces('Payment Method', 25) + addSpaces('Amount collected', 25))
      .style('NORMAL')

    data.paymentMethods.forEach(lineItem => {
      printer.println(
        addSpaces(`${lineItem.paymentMethodName}`, 25) + addSpaces(`${currency}${parseFloat(getRounded(parseFloat(lineItem.amountCollected))).toFixed(2)}`, 25)
      )
    })
  }

  // Separator;
  printer
    .feed()
    .println('------------------------------------------------')
    .feed()
  // Opening balances

  let grandTotal = 0
  printer
    .style('B')
    .println('Opening Balances')
    .feed(1)

  if (data.openingBalances && data.openingBalances.length) {
    printer
      .style('B')
      .println(addSpaces('Name', 10) + addSpaces('Value', 10) + addSpaces('QTY', 10) + addSpaces('Total', 10))
      .style('NORMAL')

    data.openingBalances.forEach(lineItem => {
      grandTotal = grandTotal + parseFloat(lineItem.total)
      printer.println(
        addSpaces(`${lineItem.denominationName}`, 10) +
          addSpaces(`${lineItem.denominationValue}`, 10) +
          addSpaces(`${lineItem.quantity}`, 10) +
          addSpaces(`${currency}${getRounded(parseFloat(lineItem.total))}`, 10)
      )
    })
  }

  printer
    .style('B')
    .feed(1)
    .println(addSpaces('Grand Total', 30) + addSpaces(`${currency}${getRounded(grandTotal)}`, 25))

  // Separator;
  printer
    .feed()
    .println('------------------------------------------------')
    .feed()
  // Closing balances
  let grandTotalClosing = 0
  printer
    .style('B')
    .println('Closing Balances')
    .feed(1)

  if (data.closingBalances && data.closingBalances.length) {
    printer
      .style('B')
      .println(addSpaces('Name', 10) + addSpaces('Value', 10) + addSpaces('QTY', 10) + addSpaces('Total', 10))
      .style('NORMAL')

    data.closingBalances.forEach(lineItem => {
      grandTotalClosing = grandTotalClosing + parseFloat(lineItem.total)
      printer.println(
        addSpaces(`${lineItem.denominationName}`, 10) +
          addSpaces(`${lineItem.denominationValue}`, 10) +
          addSpaces(`${lineItem.quantity}`, 10) +
          addSpaces(`${currency}${getRounded(parseFloat(lineItem.total))}`, 10)
      )
    })
  }

  printer
    .style('B')
    .feed(1)
    .println(addSpaces('Grand Total', 30) + addSpaces(`${currency}${getRounded(grandTotalClosing)}`, 25))
    .feed(2)
    .align('LT')
}
function printReceiptBody(printer, data) {
  if (data && data.sale) {
    // Sales info
    printer
      .println('Sales Receipt')
      .println('Sale Number: ' + data.sale.number)
      .println(data.sale.associateName ? data.sale.associateName : '')
      .println(data.sale.date)
      .feed(2)
      .align('LT')

    // Sales line items
    if (data.sale.lineItems && data.sale.lineItems.length) {
      printer
        .style('B')
        .println(addSpaces('Qty', 4) + addSpaces('Description', 36) + addSpaces('Amount', 7))
        .style('NORMAL')

      data.sale.lineItems.forEach(lineItem => {
        printer.println(
          addSpaces(`${lineItem.quantity}`, 4) + addSpaces(lineItem.name, 36) + addSpaces(`${currency}${parseFloat(lineItem.subTotal).toFixed(2)}`, 7)
        )
        if (lineItem.guest) {
          printer.println(addSpaces('', 10) + addSpaces(lineItem.guest, 25))
        }
        if (lineItem.discount && lineItem.discount.length) {
          lineItem.discount.map(discount => {
            printer.println(addSpaces('', 10) + addSpaces(discount.name, 25) + addSpaces(`(${currency}${parseFloat(discount.subTotal).toFixed(2)})`, 7))
          })
        }
      })
    }

    // Separator
    printer
      .feed()
      .println('------------------------------------------------')
      .feed()

    // Totals;
    printer.println(addSpaces('', 20) + addSpaces('Sub Total', 15) + addSpaces(`${currency}${parseFloat(data.sale.subTotal).toFixed(2)}`, 7))
    Object.entries(data.sale.taxTotals).forEach(([key, value]) => {
      printer.println(
        addSpaces('', 20) +
          addSpaces(key, 15) +
          //@ts-ignore
          addSpaces(value.toFixed(2), 7)
      )
    })
    printer.println(addSpaces('', 20) + addSpaces('Total', 15) + addSpaces(`${currency}${parseFloat(data.sale.total).toFixed(2)}`, 7))

    // Separator
    printer
      .feed()
      .println('------------------------------------------------')
      .feed()

    // Payments;
    if (data.sale.payments && data.sale.payments.length) {
      data.sale.payments.forEach(payment => {
        printer
          .println(addSpaces('Payment Method', 20) + addSpaces(payment.name || 'No payment name', 10))
          .println(addSpaces('Amount', 20) + addSpaces(`${currency}${parseFloat(payment.amount).toFixed(2)}`, 10))
      })
      printer.feed(2)
    }
  }
}

function beginPrinting(printJobData, printJobType) {
  const data = JSON.parse(printJobData)
  try {
    const device = new USB(receiptVendorId, receiptProductId)
    console.log('🚀333 ~ file:')
    const options = { encoding: 'GB18030', width: 28 }
    const printer = new Printer(device, options)
    const logo = __dirname + `/logos/logo-${resortLogo}.png`

    Image.load(logo, image => {
      device.open(() => {
        printer
          .font('a')
          .align('ct')
          .size(0, 0)
        printReceiptHeader(printer, image, data)
        if (printJobType === 'receipt') {
          printReceiptBody(printer, data)
        } else {
          printReceiptCashoutBody(printer, data)
        }
        printer
          .feed(3)
          .cut()
          .close()

        setTimeout(() => {
          console.log('Reciept printed')
        }, 300)
      })
    })
  } catch (e) {
    console.log('🚀 ~ file: receiptPrinter.js ~ line 281 ~ beginPrinting ~ e', e)
    setTimeout(() => {}, 3000)
  }
}
exports.default = beginPrinting
