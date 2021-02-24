const Page = require('./page')
const globalSetup = require('../global-setup')
const app = globalSetup.app
class UtilsPage extends Page {
  getRandomItem(arr) {
    let items = arr
    let randomitem = Math.floor(Math.random() * items.length)
    return items[randomitem]
  }

  async getButtonByClass(className) {
    return await app.client.$(`//button[@class='${className}']`)
  }

  async getButton(name) {
    return await app.client.$(`//button[text()='${name}']`)
  }

  async getInputByName(name) {
    return await app.client.$(`//input[@name='${name}']`)
  }

  async getDivByClassName(name) {
    return await app.client.$(`//div[@class='${name}']`)
  }

  async getDivById(id) {
    return await app.client.$(`//div[@id='${id}']`)
  }

  async getInputById(id) {
    return await app.client.$(`//input[@id='${id}']`)
  }

  async getcloseModalButton() {
    return await app.client.$(`//div[@id='closeModalButton']`)
  }

  async getmainPage() {
    return await app.client.$(`//nav[@id='navigationPanel']/div/a[@href='/order']`)
  }
}

module.exports = new UtilsPage()
