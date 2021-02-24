// node_modules/.bin/wdio wdio.conf.js --spec ./tests/test/specs/userClosingSessionBalance/userClosingSessionBalance.success.spec.js

const { expect } = require('chai')
const OrderPage = require('../../pages/order.page')
const Utils = require('../../pages/utils.page')

const UserClosingSessionBalanceTest = () => {
  describe('Closing Session Balance modal using', () => {
    it('should close session balance', () => {
      OrderPage.openCashoutModal.waitForDisplayed()
      OrderPage.openCashoutModal.click()
      Utils.getButton('Yes').waitForDisplayed()
      Utils.getButton('Yes').click()
      browser.pause(5000)
      OrderPage.darkModalHeader.waitForDisplayed()
      expect(OrderPage.darkModalHeader.getText()).to.equal('CLOSING SESSION BALANCES')
      for (let i = 0; i <= 10; i++) {
        if (OrderPage.getBalanceInput(i).isExisting()) {
          OrderPage.getBalanceInput(i).setValue(Math.floor(Math.random() * 11))
          browser.pause(700)
        }
      }
      browser.pause(700)
      let totalBalance = OrderPage.totalClosingSessionBalance.getText()
      Utils.getButton('Select and Submit').click()
      OrderPage.darkModalMessage.waitForDisplayed()
      expect(OrderPage.darkModalMessage.getText()).to.contain(totalBalance)
      Utils.getButton('Yes').click()
      browser.pause(3000)
    })
  })
}

module.exports = UserClosingSessionBalanceTest
