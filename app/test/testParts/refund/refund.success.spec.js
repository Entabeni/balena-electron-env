// node_modules/.bin/wdio wdio.conf.js --spec ./tests/test/specs/refund/refund.success.spec.js

const OrderPage = require('../../pages/order.page')
const SalesPage = require('../../pages/sales.page')
const Utils = require('../../pages/utils.page')

const RefundTest = () => {
  describe('Refund for sale number 49', () => {
    it('should get sales list and search for sale number 49', () => {
      browser.pause(4000)
      OrderPage.getNavElement('sales').click()
      SalesPage.salesRow.waitForDisplayed()
      SalesPage.salesSearchBox.setValue('49')
    })

    it('should open sale details modal and select items for refund', () => {
      browser.pause(4000)
      SalesPage.salesRow.waitForDisplayed()
      SalesPage.showSalesInfoButtoun.waitForDisplayed()
      SalesPage.showSalesInfoButtoun.click()
      browser.pause(1000)
      SalesPage.getCheckBoxForSaleLineItem(1).click()
      browser.pause(1000)
      Utils.getButton('REFUND').click()
      browser.pause(2000)
      if (SalesPage.selectRefundCount.isDisplayed()) {
        Utils.getButton('Continue').click()
      }
      browser.pause(4000)
    })

    describe('Completing Order', () => {
      it('should select first guest to Purchase', () => {
        Utils.getButton('ADD PURCHASER').click()
        browser.pause(2300)
        if (Utils.getButton('Continue').isEnabled()) Utils.getButton('Continue').click()
      })

      it('should complete payment in Cash method and verify payment in cart', () => {
        OrderPage.getPaymentMethod('Cash').waitForDisplayed()
        OrderPage.getPaymentMethod('Cash').click()
        Utils.getInputById('summ').waitForDisplayed()
        Utils.getInputById('summ').setValue('-100')
        Utils.getButton('Continue').waitForEnabled()
        Utils.getButton('Continue').click()
        browser.pause(1000)
      })

      it('should finialize order and skip printing page', () => {
        Utils.getButton('COMPLETE').click()
        /*Utils.getButton('Next Step').waitForDisplayed()
        Utils.getButton('Next Step').click()*/
        OrderPage.printingPage.waitForDisplayed()
        if (Utils.getButton('Complete').isEnabled()) {
          Utils.getButton('Complete').click()
        }
        OrderPage.orderNumber.waitForDisplayed()
      })
    })
  })
}

module.exports = RefundTest
