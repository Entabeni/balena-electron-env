const Page = require('./page')
const globalSetup = require('../global-setup')
const app = globalSetup.app
class OrderPage extends Page {
  // Page Elements

  get orderNumber() {
    return app.client.$(`//p[@id='orderNumber']`)
  }

  get waiverHeading() {
    return app.client.$(`//h3[@id='mainHeader']`)
  }

  get printingPage() {
    return app.client.$(`//h2[@id='printModalTitle']`)
  }

  productInCart(num) {
    return app.client.$(`//ul[@id='itemInOrder_${num}']/li[@class='list_item']/p`)
  }

  deleteProductFromCart(num) {
    return app.client.$(`//ul[@id='itemInOrder_${num}']/li[@class='list_delete']/p`)
  }

  getPaymentMethod(name) {
    return app.client.$(`//button[text()='${name}']`)
  }

  get mainPage() {
    return app.client.$(`//nav[@id='navigationPanel']/div/a[@href='/order']`)
  }

  getNavElement(name) {
    return app.client.$(`//nav[@id='navigationPanel']/div/a[@href='/order/${name}']`)
  }

  get openCashoutModal() {
    return app.client.$(`//nav[@id='navigationPanel']/div/a[@href='/cashout']`)
  }

  get darkModalHeader() {
    return app.client.$(`#darkModalHeader`)
  }

  get darkModalMessage() {
    return app.client.$(`#darkModalMessage`)
  }

  get totalClosingSessionBalance() {
    return app.client.$(`#totalBalance`)
  }

  get totalSumOfOrder() {
    return app.client.$(`//li[@class='footer_total']/h3[2]`)
  }

  getBalanceInput(num) {
    return app.client.$(`//input[@id='balanceInput_${num}']`)
  }
}

module.exports = new OrderPage()
