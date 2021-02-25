const { expect } = require('chai')
const DashboardPage = require('../../pages/dashboard.page')
const OrderPage = require('../../pages/order.page')
const ProductPage = require('../../pages/product.page')
const RentalsPage = require('../../pages/rentals.page')
const PurchasePage = require('../../pages/purchase.page')
const Utils = require('../../pages/utils.page')

const RentalProductTest = () => {
  describe('Rental Order Flow', () => {
    let prodName = '',
      orderNumber,
      saleNumber

    it('should click on a product: Covid rental product', () => {
      orderNumber = OrderPage.orderNumber.getText()
      browser.pause(2500)
      DashboardPage.productByName('Covid rental product').click()
      ProductPage.productName.waitForDisplayed()
      prodName = ProductPage.productName.getText()
    })

    it('should add 1 guest and add product to cart', () => {
      addGuest(0, '06091970')
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
    })

    it('should select first guest to Purchase', () => {
      Utils.getButton('ADD PURCHASER').waitForEnabled()
      Utils.getButton('ADD PURCHASER').click()
      PurchasePage.guestToPurchase.waitForDisplayed()
      PurchasePage.guestToPurchase.click()
      browser.pause(2300)
      if (Utils.getButton('Continue').isEnabled()) Utils.getButton('Continue').click()
    })

    it('should complete payment in Cash method and verify payment in cart', () => {
      OrderPage.getPaymentMethod('Cash').waitForDisplayed()
      OrderPage.getPaymentMethod('Cash').click()
      Utils.getInputById('summ').waitForDisplayed()
      Utils.getInputById('summ').setValue('100')
      Utils.getButton('Continue').waitForEnabled()
      Utils.getButton('Continue').click()
      browser.pause(1000)
    })

    it('should finialize order and skip printing page', () => {
      Utils.getButton('COMPLETE').click()
      Utils.getButton('Next Step').waitForDisplayed()
      Utils.getButton('Next Step').click()
      OrderPage.printingPage.waitForDisplayed()
      saleNumber = OrderPage.printingPage.getAttribute('data')
      if (Utils.getButton('Complete').isEnabled()) {
        Utils.getButton('Complete').click()
      }
      browser.pause(3000)
      OrderPage.orderNumber.waitForDisplayed()
      expect(OrderPage.orderNumber.getText()).to.not.contain(orderNumber)
    })

    it('should navigate to rentals page, find just created rental and print a card', () => {
      browser.pause(2000)
      OrderPage.getNavElement('checkIns').click()
      Utils.getButton('Show Check-Ins').waitForDisplayed()
      Utils.getButton('Show Check-Ins').click()
      browser.pause(2000)
      RentalsPage.rentalsRow.waitForDisplayed()
      RentalsPage.searchBox.setValue(saleNumber)
      browser.pause(2000)
      RentalsPage.rentalsRow.waitForDisplayed()
      let foundSaleNumber = RentalsPage.rentalsRowSaleNumber.getAttribute('data')
      if (expect(foundSaleNumber).to.equal(saleNumber)) {
        RentalsPage.rentalsRow.click()
        RentalsPage.rentalDetailsRow.waitForDisplayed()
        RentalsPage.rentalPrintButton.click()
        Utils.getButton('Next Step').waitForDisplayed()
        Utils.getButton('Next Step').click()
        OrderPage.printingPage.waitForDisplayed()
        if (Utils.getButton('Complete').isEnabled()) {
          Utils.getButton('Complete').click()
        }
      }

      browser.pause(2000)
      Utils.mainPage.click()
    })
  })
}

function addGuest(num, age) {
  ProductPage.getProductAllocationBtn(num).click()
  ProductPage.guestSearchBox.waitForDisplayed()
  ProductPage.guestSearchBox.setValue('arseniy@entabenisystems.com')
  ProductPage.guestRow.waitForDisplayed()
  ProductPage.addGuestBtn(0).click()
  browser.pause(2000)
  ProductPage.updateRentals.waitForDisplayed()

  if (Utils.getButton('Update').isEnabled()) {
    Utils.getButton('Update').click()
  }

  if (ProductPage.updateDOB.isExisting()) {
    ProductPage.updateDOB.setValue(age)
    Utils.getButton('Update').click()
  }

  browser.pause(2000)
}

module.exports = RentalProductTest
