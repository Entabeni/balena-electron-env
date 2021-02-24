const Page = require('./page')
const globalSetup = require('../global-setup')
const app = globalSetup.app
class DiscountPage extends Page {
  // Page Elements

  get ItemRow() {
    return app.client.$(`//ul[@id='orderItemForDiscount_0']`)
  }

  get allCheckbox() {
    return app.client.$(`//input[@id='listHeaderCheckBox']`)
  }

  get discountName() {
    return app.client.$(`//div[@id='discount_2']/div[@class='list_name']`)
  }

  get selectDiscount() {
    return app.client.$(`//div[@id='discount_2']/div[@class='list_select']`)
  }

  locateDiscount(name) {
    return app.client.$(`//p[text()='${name}']`)
  }
}

module.exports = new DiscountPage()
