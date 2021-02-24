// node_modules/.bin/wdio wdio.conf.js --spec ./tests/test/specs/productWithEventAndQuestionSteps/productWithEventAndQuestionSteps.success.spec.js

const { expect } = require('chai')
const OrderPage = require('../../pages/order.page')
const ProductPage = require('../../pages/product.page')
const DashboardPage = require('../../pages/dashboard.page')
const Utils = require('../../pages/utils.page')

const ProductWithEventAndQuestionStepsTest = () => {
  describe('Should search product andd add to cart product with 3 steps and upsell product, and then delete it', () => {
    let prodName

    it('should find product by filtering by category', () => {
      browser.pause(2500)
      DashboardPage.searchBox.setValue('Product with Event and Questions')
      browser.pause(1500)
      DashboardPage.productByName('Product with Event and Questions steps').click()
      ProductPage.productName.waitForDisplayed()
      prodName = ProductPage.productName.getText()
    })

    it('should try to create a guest and when select existed', () => {
      ProductPage.getProductAllocationBtn(0).click()
      Utils.getButton('Create Guest').waitForDisplayed()
      Utils.getButton('Create Guest').click()
      ProductPage.firstName.waitForDisplayed()
      ProductPage.firstName.setValue('TDD')
      ProductPage.lastName.setValue('test')
      ProductPage.email.setValue('arseniy@entabenisystems.com')
      browser.keys(['Tab', 'Tab', '12/12/1990'])

      Utils.getButton('Submit').click()
      Utils.getButton('Back To Form').waitForDisplayed()
      Utils.getButton('Back To Form').click()
      Utils.getButton('Submit').click()

      ProductPage.guestRow.waitForDisplayed()
      for (let i = 0; i <= 10; i++) {
        if (ProductPage.addGuestBtn(i).isExisting()) {
          ProductPage.addGuestBtn(i).click()
          break
        }
      }
    })

    it('should select day', () => {
      browser.pause(1000)
      ProductPage.selectDayInCalendar.waitForDisplayed()
      ProductPage.selectDayInCalendar.click()
      browser.pause(1000)
      if (Utils.getButton('Assign').isEnabled()) Utils.getButton('Assign').click()
    })

    it('should answer question', () => {
      Utils.getButton('Submit').waitForDisplayed()
      browser.keys(['Tab', '123'])
      browser.pause(1000)
      Utils.getButton('Submit').click()
      if (Utils.getButton('Continue').isEnabled()) Utils.getButton('Continue').click()
      browser.pause(1000)
    })

    it('should add upsell product and add it to order', () => {
      ProductPage.upsellProductSelect.waitForDisplayed()
      ProductPage.upsellProductSelect.click()
      Utils.getButton('Continue').waitForDisplayed()
      if (Utils.getButton('Continue').isEnabled()) Utils.getButton('Continue').click()
      Utils.getButton('Add Products').waitForDisplayed()
      Utils.getButton('Add Products').click()
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
      expect(OrderPage.totalSumOfOrder.getText()).to.equal('$0')
    })
  })
}

module.exports = ProductWithEventAndQuestionStepsTest
