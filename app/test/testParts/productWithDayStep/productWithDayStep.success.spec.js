// node_modules/.bin/wdio wdio.conf.js --spec ./tests/test/specs/productWithDayStep/productWithDayStep.success.spec.js

const { expect } = require('chai')
const OrderPage = require('../../pages/order.page')
const ProductPage = require('../../pages/product.page')
const DashboardPage = require('../../pages/dashboard.page')
const Utils = require('../../pages/utils.page')

const ProductWithDayStepTest = () => {
  describe('Should filter product by category, add product with day step to cart and the delete it from cart', () => {
    let prodName

    it('should find product by filtering by category', () => {
      browser.pause(2500)
      Utils.getButton('Test Category').click()
      browser.pause(1500)
      DashboardPage.productByName('Test Day Product (Only 1 Day Availability)').click()
      ProductPage.productName.waitForDisplayed()
      prodName = ProductPage.productName.getText()
    })

    it('should add 1 guest', () => {
      addGuest(0, '06091970')
      browser.pause(1000)
      if (Utils.getButton('Continue').isEnabled()) Utils.getButton('Continue').click()
      browser.pause(1000)
    })

    it('should select day and add product to cart', () => {
      browser.pause(1000)
      ProductPage.selectDayInCalendar.waitForDisplayed()
      ProductPage.selectDayInCalendar.click()
      browser.pause(1000)
      if (Utils.getButton('Assign').isEnabled()) Utils.getButton('Assign').click()
      browser.pause(1000)
      if (Utils.getButton('Continue').isEnabled()) Utils.getButton('Continue').click()
    })

    it('should check product in cart', () => {
      OrderPage.productInCart(0).waitForDisplayed()
      expect(prodName).to.contain(OrderPage.productInCart(0).getText())
      browser.pause(2000)
    })

    it('should delete product from cart', () => {
      OrderPage.deleteProductFromCart(0).click()
      browser.pause(2000)
      Utils.getButton('Yes').waitForDisplayed()
      Utils.getButton('Yes').click()
      browser.pause(4000)
      Utils.getButton('Test Category').click()
      expect(OrderPage.totalSumOfOrder.getText()).to.equal('$0')
    })
  })
}

function addGuest(num, age) {
  ProductPage.getProductAllocationBtn(num).click()
  ProductPage.guestSearchBox.waitForDisplayed()
  ProductPage.guestSearchBox.setValue('TDD')
  ProductPage.guestRow.waitForDisplayed()
  for (let i = 0; i <= 10; i++) {
    if (ProductPage.addGuestBtn(i).isExisting()) {
      ProductPage.addGuestBtn(i).click()
      break
    }
  }
  browser.pause(2000)

  if (ProductPage.updateDOB.isExisting()) {
    ProductPage.updateDOB.setValue(age)
    Utils.getButton('Update').click()
  }

  browser.pause(2000)
}

module.exports = ProductWithDayStepTest
