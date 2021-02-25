// node_modules/.bin/wdio wdio.conf.js --spec ./tests/test/specs/previousOrder/previousOrder.success.spec.js

const OrderPage = require('../../pages/order.page')
const PreviousOrderPage = require('../../pages/previousOrder.page')

const PreviousOrderTest = () => {
  describe('Previous Order', () => {
    it('should get previous orders list and search for order', () => {
      browser.pause(2000)
      OrderPage.getNavElement('orders').click()
    })

    it('should find and open sale number 99', () => {
      PreviousOrderPage.prevOrderRow.waitForDisplayed()
      PreviousOrderPage.prevOrderSearchBox.setValue('99')
      PreviousOrderPage.openPrevOrderButton.waitForDisplayed()
      PreviousOrderPage.openPrevOrderButton.click()
      OrderPage.orderNumber.waitForDisplayed()
    })
  })
}

module.exports = PreviousOrderTest
