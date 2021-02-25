const Page = require('./page')
const globalSetup = require('../global-setup')
const app = globalSetup.app
class GuestPage extends Page {
  // Page Elements

  get guestSearchBox() {
    return app.client.$(`#searchInput`)
  }

  get guestRow() {
    return app.client.$(`//tr[@id='guestRow_0'][1]/td`)
  }

  get closeModalButton() {
    return app.client.$(`//div[@id='closeModalButton']`)
  }
}

module.exports = new GuestPage()
