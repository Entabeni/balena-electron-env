const Page = require('./page')
const globalSetup = require('../global-setup')
const app = globalSetup.app
class RentalsPage extends Page {
  // Page Elements
  //
  get searchBox() {
    return app.client.$(`#searchInput`)
  }

  get rentalsRow() {
    return app.client.$(`//article[@id='rentalRow_0']`)
  }

  get rentalsRowSaleNumber() {
    return app.client.$(`//h2[@id='rentalRowSaleNumber_0']`)
  }

  get rentalDetailsRow() {
    return app.client.$(`//tr[@id='rentalDetailsRow_0']`)
  }

  get rentalPrintButton() {
    return app.client.$(`//button[@id='rentalPrintButton_0']`)
  }
}

module.exports = new RentalsPage()
