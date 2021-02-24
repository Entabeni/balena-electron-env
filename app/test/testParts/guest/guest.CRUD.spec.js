// node_modules/.bin/wdio wdio.conf.js --spec ./tests/test/specs/guest/guest.CRUD.spec.js

const OrderPage = require('../../pages/order.page')
const GuestPage = require('../../pages/guest.page')
const Utils = require('../../pages/utils.page')

const currentDate = new Date()
const dateString = (currentDate.getMonth() + 1).toString() + currentDate.getDate().toString() + currentDate.getFullYear().toString()

const GuestTest = () => {
  describe('CRU guest', () => {
    it('should get guests list', () => {
      browser.pause(2000)
      OrderPage.getNavElement('guests').click()
    })

    it.skip('should create a guest', () => {
      Utils.getButton('Create Guest').click()
      Utils.getInputByName('firstName').setValue(`FirstNamePOS${dateString}`)
      Utils.getInputByName('lastName').setValue(`LastNamePOS${dateString}`)
      Utils.getInputByName('dateOfBirth').setValue(`12/12/1988`)
      Utils.getInputByName('email').setValue(`testEmail@entabeny.com`)
      Utils.getButton('Submit').click()
      browser.pause(3000)
    })

    it('should search guest and update it', () => {
      GuestPage.guestSearchBox.setValue('testuser@tdd.com')
      browser.pause(5000)
      GuestPage.guestRow.waitForDisplayed()
      GuestPage.guestRow.click()
      browser.pause(1000)
      Utils.getButton('Edit').click()
      browser.pause(1000)
      Utils.getInputByName('firstName').clearValue()
      Utils.getInputByName('firstName').setValue(`FirstName${dateString}`)
      Utils.getButton('Submit').click()
      browser.pause(2000)
      GuestPage.closeModalButton.click()
    })

    it.skip('should search updated guest', () => {
      browser.pause(3000)
      GuestPage.guestSearchBox.setValue(`FirstName${dateString}`)
      GuestPage.guestRow.waitForDisplayed()
      GuestPage.guestRow.click()
      Utils.closeModalButton.waitForDisplayed()
      Utils.closeModalButton.click()
      browser.pause(2000)
      Utils.mainPage.click()
    })
  })
}

module.exports = GuestTest
