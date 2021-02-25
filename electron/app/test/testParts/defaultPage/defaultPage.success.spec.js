const { expect } = require('chai')
const DashboardPage = require('../../pages/dashboard.page')
const Utils = require('../../pages/utils.page')
const OutstandingAssetsPage = require('../../pages/outstandingAssets.page')

const DefaultPageTest = () => {
  describe('Should check default page functionality', () => {
    it('should click on logged in user image, select outstanding rental assets page as default', () => {
      browser.pause(4000)
      DashboardPage.userImage.waitForDisplayed()
      DashboardPage.userImage.click()
      DashboardPage.printTermialInfo.waitForDisplayed()
      DashboardPage.selectDefaultPage(4).waitForDisplayed()
      DashboardPage.selectDefaultPage(4).click()
      Utils.getButton('Submit').click()
      browser.pause(1000)
    })

    it('system should automatically open outstanding assets page as a default', () => {
      browser.pause(2000)
      OutstandingAssetsPage.modalDetailsOutstandingRentalAsset.waitForDisplayed()
      const modalHeaderText = OutstandingAssetsPage.modalDetailsOutstandingRentalAsset.getText()
      expect(modalHeaderText).to.contains('Outstanding Rental Asset')
    })

    it('should open settings modal and select main page as default', () => {
      DashboardPage.userImage.waitForDisplayed()
      DashboardPage.userImage.click()
      DashboardPage.printTermialInfo.waitForDisplayed()
      DashboardPage.selectDefaultPage(0).waitForDisplayed()
      DashboardPage.selectDefaultPage(0).click()
      Utils.getButton('Submit').click()
      browser.pause(3000)
      DashboardPage.productByName('1st Timer - Snowboard 4 HR ').waitForDisplayed()
    })
  })
}

module.exports = DefaultPageTest
