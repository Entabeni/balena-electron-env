const Page = require('./page')
const globalSetup = require('../global-setup')
const app = globalSetup.app
class SalesPage extends Page {
  // Page Elements
  //
  get salesSearchBox() {
    return app.client.$(`#searchInput`)
  }

  get salesRow() {
    return app.client.$(`//tr[@id='salesRow_0']`)
  }

  get showSalesInfoButtoun() {
    return app.client.$(`//button[@id='showSalesInfoButton_0']`)
  }

  getCheckBoxForSaleLineItem() {
    return app.client.$(`//tr[@id='saleLineItemRow_0']/td[1]/div`)
  }

  getCheckBoxForEmail() {
    return app.client.$(`//tr[@id='emailRow_0']/td[1]/div`)
  }

  get selectRefundCount() {
    return app.client.$(`//div[@class='css-1hwfws3 react-select__value-container react-select__value-container--has-value']`)
  }
}

module.exports = new SalesPage()
