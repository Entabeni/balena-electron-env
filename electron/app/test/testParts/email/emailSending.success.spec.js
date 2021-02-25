// node_modules/.bin/wdio wdio.conf.js --spec ./tests/test/specs/email/emailSending.success.spec.js

const OrderPage = require('../../pages/order.page')
const SalesPage = require('../../pages/sales.page')
const Utils = require('../../pages/utils.page')

const EmailSendingTest = () => {
  describe('Email sending for sale number 1', () => {
    it('should get sales list and search for sale', () => {
      browser.pause(2000)
      OrderPage.getNavElement('sales').click()
      SalesPage.salesRow.waitForDisplayed()
      SalesPage.salesSearchBox.setValue('1')
    })

    it('should open sale details modal and send email for selected user', () => {
      browser.pause(4000)
      SalesPage.showSalesInfoButtoun.waitForDisplayed()
      SalesPage.showSalesInfoButtoun.click()
      browser.pause(1000)
      Utils.getButton('EMAIL').click()
      browser.pause(2000)
      SalesPage.getCheckBoxForEmail().waitForDisplayed()
      SalesPage.getCheckBoxForEmail().click()
      Utils.getButton('Send Email').click()
      Utils.getButton('EMAIL').waitForDisplayed()
      Utils.closeModalButton.waitForDisplayed()
      Utils.closeModalButton.click()
      browser.pause(2000)
      Utils.mainPage.click()
    })
  })
}

module.exports = EmailSendingTest
