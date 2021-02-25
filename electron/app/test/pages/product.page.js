const Page = require('./page')
const globalSetup = require('../global-setup')
const app = globalSetup.app
class ProductPage extends Page {
  // Page Elements

  get productName() {
    return app.client.$(`//div/h2[@id='productModalTitle']`)
  }

  get firstName() {
    return app.client.$('#firstName')
  }

  get lastName() {
    return app.client.$('#lastName')
  }

  get email() {
    return app.client.$('#email')
  }

  get phone() {
    return app.client.$('#phone')
  }

  get dateOfBirth() {
    return app.client.$(`#dateOfBirth`)
  }

  get guestSearchBox() {
    return app.client.$(`//input[@id='searchInput']`)
  }

  get updateRentals() {
    return app.client.$(`//section[@id='rentalDetailsModal']`)
  }

  get updateDOB() {
    return app.client.$(`//section[@id='dobModal']/div/input`)
  }

  get guestRow() {
    return app.client.$(`//ul[@id='guestItem_0']`)
  }

  getProductAllocationBtn(num) {
    return app.client.$(`//article[@id='productStepsBlock_${num}']/div[@id='stepsButtons']/button`)
  }

  addGuestBtn(num) {
    return app.client.$(`//button[@id='addGuestItem_${num}']`)
  }

  get selectDayInCalendar() {
    return app.client.$(`//div[@class='DayPicker-Day DayPicker-Day--today']`)
  }

  get upsellProductSelect() {
    return app.client.$(`//div[@id='upsellProductItem_0']`)
  }
}

module.exports = new ProductPage()
