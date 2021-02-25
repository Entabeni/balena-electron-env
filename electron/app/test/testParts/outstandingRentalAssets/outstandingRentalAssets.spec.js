// node_modules/.bin/wdio wdio.conf.js --spec ./tests/test/specs/outstandingRentalAssets/outstandingRentalAssets.spec.js

const { expect } = require('chai')
const OrderPage = require('../../pages/order.page')
const OutstandingAssetsPage = require('../../pages/outstandingAssets.page')

const OutstandingRentalAssetsTest = () => {
  describe('Open outstanding rental assets page and view details for 1 asset', () => {
    it('should get outstanding rental assets list', () => {
      browser.pause(2000)
      OrderPage.getNavElement('outstandingAssets').click()
    })

    it('should filter assets and open details modal', () => {
      browser.pause(2000)
      OutstandingAssetsPage.modalDetailsOutstandingRentalAsset.waitForDisplayed()
      const modalHeaderText = OutstandingAssetsPage.modalDetailsOutstandingRentalAsset.getText()
      expect(modalHeaderText).to.contains('Outstanding Rental Asset')
    })
  })
}

module.exports = OutstandingRentalAssetsTest
