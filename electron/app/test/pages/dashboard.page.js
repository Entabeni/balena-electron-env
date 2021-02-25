const Page = require('./page')
const globalSetup = require('../global-setup')
const app = globalSetup.app
class DashboardPage extends Page {
  // Page Elements

  get userImage() {
    return app.client.$(`//div[@id='guestFullName']`)
  }

  get printTermialInfo() {
    return app.client.$(`//h2[@id='settingsModal']`)
  }

  get departmentCheckBoxes() {
    return app.client.$(`//div[@id='departmentsList']/div[1]/input`)
  }

  get calendarDayResortEventsModal() {
    return app.client.$(`//div[@class='DayPicker-Day DayPicker-Day--activeSeason'][1]`)
  }

  selectDefaultPage(num) {
    return app.client.$(`//input[@id='defaultPageOption_${num}']`)
  }

  get alert() {
    return app.client.$(`//div[@class='react-toast-notifications__toast__content css-18gu508-Content']`)
  }

  get searchBox() {
    return app.client.$(`#search`)
  }

  get noProducts() {
    return app.client.$(`#noProducts`)
  }

  productByName(name) {
    return app.client.$(`//div[@class='title']//span[text()='${name}']`)
  }

  get logOutButton() {
    return app.client.$(`#logoutButton`)
  }
}

module.exports = new DashboardPage()
