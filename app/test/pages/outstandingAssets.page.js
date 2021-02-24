const Page = require('./page')
const globalSetup = require('../global-setup')
const app = globalSetup.app
class OutstandingAssetsPage extends Page {
  // Page Elements
  get pageHeader() {
    return app.client.$(`#outstandingAssetsPageHeader`)
  }

  get outstandingAssetsSearchBox() {
    return app.client.$(`#searchInput`)
  }

  get rentalAssetRow() {
    return app.client.$(`//tr[@id='rentalAssetRow_0']/td[2]`)
  }

  get modalDetailsOutstandingRentalAsset() {
    return app.client.$(`#outstandingAssetsPageHeader`)
  }

  get closeModalButton() {
    return app.client.$(`//div[@id='closeModalButton']`)
  }
}
module.exports = new OutstandingAssetsPage()
