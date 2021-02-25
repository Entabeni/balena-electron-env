// node_modules/.bin/wdio wdio.conf.js --spec ./tests/test/specs/blankOrder/blankOrder.success.spec.js

const { expect } = require('chai')
const DashboardPage = require('../../pages/dashboard.page')
const Utils = require('../../pages/utils.page')

const BlankOrderTest = () => {
  describe('Order Page: Blank Order Validation', () => {
    it('should expect Add Purchaser button to be disabled', () => {
      browser.pause(5000)
      DashboardPage.productByName('1st Timer - Snowboard 4 HR ').waitForDisplayed()
      expect(Utils.getButton('ADD PURCHASER').isEnabled()).to.be.false
    })
  })
}

module.exports = BlankOrderTest
