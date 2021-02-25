const Page = require('./page')

class PreviousOrderPage extends Page {
  // Page Elements
  //
  get prevOrderSearchBox() {
    return $(`#searchInput`)
  }

  get prevOrderRow() {
    return $(`//tr[@id='prevOrderRow_0']`)
  }

  get openPrevOrderButton() {
    return $(`//button[@id='openPrevOrderButton_0']`)
  }

  get orderNumber() {
    return $(`//tr[@id='prevOrderRow_0']/td[2]`)
  }
}

module.exports = new PreviousOrderPage()
