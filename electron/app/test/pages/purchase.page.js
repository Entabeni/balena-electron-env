const Page = require('./page')
const globalSetup = require('../global-setup')
const app = globalSetup.app
class PurchasePage extends Page {
  // Page Elements

  get guestToPurchase() {
    return app.client.$(`//ul[1]/li[3]//input`)
  }
}

module.exports = new PurchasePage()
