// node_modules/.bin/wdio wdio.conf.js --spec ./tests/test/specs/departmentProducts/departmentProducts.success.spec.js

const { expect } = require('chai')
const DashboardPage = require('../../pages/dashboard.page')
const Utils = require('../../pages/utils.page')

const DepartmentsTest = () => {
  describe('Should check departments functionality', () => {
    it('should click on logged in user image', () => {
      browser.pause(4000)
      DashboardPage.userImage.waitForDisplayed()
      DashboardPage.userImage.click()
      DashboardPage.printTermialInfo.waitForDisplayed()
    })

    it('should unselect a department to filter Products', () => {
      DashboardPage.departmentCheckBoxes.waitForDisplayed()
      DashboardPage.departmentCheckBoxes.click()
      Utils.getButton('Submit').click()
    })

    it('should find text "No Products"', () => {
      DashboardPage.noProducts.waitForDisplayed()
      const noProducts = DashboardPage.noProducts.getText()
      expect(noProducts).to.equal('No products')
    })

    it('should select a department to filter Products', () => {
      browser.pause(3000)
      DashboardPage.userImage.waitForDisplayed()
      DashboardPage.userImage.click()
      DashboardPage.printTermialInfo.waitForDisplayed()
      DashboardPage.departmentCheckBoxes.waitForDisplayed()
      DashboardPage.departmentCheckBoxes.click()
      Utils.getButton('Submit').click()
    })

    it('should search filtered by department product ', () => {
      const productName = '2 HR Group Lesson Package - Ski'
      DashboardPage.searchBox.setValue(productName)
      DashboardPage.productByName(productName).waitForDisplayed()
      expect(productName).to.contain(DashboardPage.productByName(productName).getText())
    })
  })
}

module.exports = DepartmentsTest
