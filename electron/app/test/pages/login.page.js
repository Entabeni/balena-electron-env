const Page = require('./page')
const Utils = require('./utils.page')
const globalSetup = require('../global-setup')

const app = globalSetup.app
const { expect } = require('chai')

class LoginPage extends Page {
  // Page Elements

  get accessCode() {
    return app.client.$('#login')
  }

  get password() {
    return app.client.$('#pin')
  }

  get loginBtn() {
    return app.client.$(`//button[text()='LOG IN']`)
  }

  get loginFailMsg() {
    return app.client.$(`//form[@class='sc-eLExRp WhvZl']/p`)
  }

  get loginFailAlert() {
    return app.client.$(`//div[@class='css-1ad3zal e1rce5zx1']`)
  }

  get printTerminal() {
    return app.client.$('#printTerminalSelect')
  }

  pwdOnPinpad(digit) {
    return app.client.$(`//button[text()='${digit}']`)
  }

  enterPin(arr) {
    for (let i = 0; i < arr.length; i++) {
      this.pwdOnPinpad(arr[i]).click()
      super.browserWait(750)
    }
  }

  async login(username, password) {
    await (await app.client.$('#login')).addValue(username ? username : '1834')
    await (await app.client.$('#pin')).addValue(password ? password : '9708102')
    await (await app.client.$('button[type="submit"]')).click()
  }

  reLogin(username, password) {
    super.browserWait(1000)
    this.accessCode.click()
    this.enterPin(username)
    super.browserWait(1000)
    this.password.click()
    this.enterPin(password)
    this.browserWait(2500)
    this.loginBtn.click()
  }

  openingSessionBalance(num) {
    return app.client.$(`//input[@id='balanceInput_${num}']`)
  }

  get darkModalHeader() {
    return app.client.$(`#darkModalHeader`)
  }

  get darkModalMessage() {
    return app.client.$(`#darkModalMessage`)
  }

  get totalOpeningSessionBalance() {
    return app.client.$(`#totalBalance`)
  }

  async completeOpeningSessionBalance(selector) {
    for (let i = 0; i <= 2; i++) {
      console.log('🚀 ~ file: login.page.js ~ line 82 ~ completeOpeningSessionBalance ~ Math.floor(Math.random() * 11)', Math.floor(Math.random() * 11))
      await (await this.openingSessionBalance(i)).addValue(Math.floor(Math.random() * 11))
    }
    Utils.getButton('Select and Submit').click()
    // this.darkModalMessage.waitForDisplayed()
    // expect(this.darkModalMessage.getText()).to.contain(totalBalance)
    Utils.getButton('Yes').click()
  }
}

module.exports = new LoginPage()
