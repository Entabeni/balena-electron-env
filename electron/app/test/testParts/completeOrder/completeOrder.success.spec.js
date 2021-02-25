// node_modules/.bin/wdio wdio.conf.js --spec ./tests/test/specs/completeOrder/completeOrder.success.spec.js

const { expect } = require('chai')
const DashboardPage = require('../../pages/dashboard.page')
const OrderPage = require('../../pages/order.page')
const ProductPage = require('../../pages/product.page')
const DiscountPage = require('../../pages/discount.page')
const PurchasePage = require('../../pages/purchase.page')
const Utils = require('../../pages/utils.page')

const CompleteOrderTest = () => {
  describe('Complete Order Flow', () => {
    let prodName = '',
      orderNumber

    it('should click on a product: 2 HR Group Lesson Package - Ski', () => {
      orderNumber = OrderPage.orderNumber.getText()
      browser.pause(2500)
      DashboardPage.productByName('2 HR Group Lesson Package - Ski').click()
      ProductPage.productName.waitForDisplayed()
      prodName = ProductPage.productName.getText()
    })

    it('should add 1 guest and add product to cart', () => {
      addGuest(0, '06091970')
      browser.pause(1000)
      if (Utils.getButton('Continue').isEnabled()) Utils.getButton('Continue').click()
      browser.pause(1000)
      if (Utils.getButton('Skip & Add').isExisting()) Utils.getButton('Skip & Add').click()
    })

    it('should check product in cart', () => {
      OrderPage.productInCart(0).waitForDisplayed()
      expect(prodName).to.contain(OrderPage.productInCart(0).getText())
    })

    it('should add a discount to product and checking discount in cart', () => {
      Utils.getButton('ADD DISCOUNT').click()
      DiscountPage.ItemRow.waitForDisplayed()
      DiscountPage.allCheckbox.click()
      browser.pause(2000)
      let discountName = DiscountPage.discountName.getText()
      DiscountPage.selectDiscount.click()
      browser.pause(2000)
      Utils.getButton('Apply').waitForDisplayed()
      Utils.getButton('Apply').click()
      browser.pause(2000)
      DiscountPage.locateDiscount(discountName).waitForDisplayed()
      expect(discountName).to.contain(DiscountPage.locateDiscount(discountName).getText())
    })

    it('should delete just added discount', () => {
      Utils.getButton('ADD DISCOUNT').click()
      DiscountPage.ItemRow.waitForDisplayed()
      browser.pause(2000)
      Utils.getDivByClassName('remove-link').waitForDisplayed()
      Utils.getDivByClassName('remove-link').click()
      browser.pause(2000)
      Utils.getButton('Apply').waitForDisplayed()
      Utils.getButton('Apply').click()
    })

    describe('Completing Order', () => {
      it('should select first guest to Purchase', () => {
        Utils.getButton('ADD PURCHASER').waitForEnabled()
        Utils.getButton('ADD PURCHASER').click()
        PurchasePage.guestToPurchase.waitForDisplayed()
        PurchasePage.guestToPurchase.click()
        browser.pause(2300)
        if (Utils.getButton('Continue').isEnabled()) Utils.getButton('Continue').click()
      })

      it('should sign waiver', () => {
        OrderPage.waiverHeading.waitForDisplayed()
        const pageHeader = OrderPage.waiverHeading.getText()
        if (expect(pageHeader).to.equal('Agreements')) {
          Utils.getButton('Manually Signed').waitForDisplayed()
          Utils.getButton('Manually Signed').click()
          Utils.getButton('PAY').waitForEnabled()
          Utils.getButton('PAY').click()
        }
      })

      it('should complete payment in Cash method and verify payment in cart', () => {
        OrderPage.getPaymentMethod('Cash').waitForDisplayed()
        OrderPage.getPaymentMethod('Cash').click()
        Utils.getInputById('summ').waitForDisplayed()
        Utils.getInputById('summ').setValue('50')
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
        browser.pause(3000)
        OrderPage.orderNumber.waitForDisplayed()
        expect(OrderPage.orderNumber.getText()).to.not.contain(orderNumber)
      })
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

module.exports = CompleteOrderTest
