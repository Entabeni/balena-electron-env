const globalSetup = require('../global-setup')

const app = globalSetup.app
class Page {
  constructor() {
    this.title = 'My Page'
    this.url = 'https://pos-test.entabeni.tech/'
    //this.url = 'http://localhost:3000/'
  }

  open() {
    // app.url(this.url)
    // app.maximizeWindow()
  }

  sendKey(keys) {
    app.keys(keys)
  }

  browserWait(time) {
    app.pause(time)
  }
}

module.exports = Page
