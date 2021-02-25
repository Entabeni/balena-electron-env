const request = require('request')

const currentDate = new Date()
const dateString = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`
const timeString = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`

exports.config = {
  user: 'michaelwhelehan3',
  key: 'tUCnXNrx5GeFCfsG9H1M',

  updateJob: false,
  specs: ['./tests/test/specs/**/*.spec.js'],
  exclude: [],

  maxInstances: 2,

  capabilities: [
    {
      browser: 'chrome',
      'bstack:options': {
        resolution: '1920x1080',
        projectName: `POS`,
        buildName: `POS (${dateString}||${timeString})`
      }
    }
  ],

  logLevel: 'error',
  coloredLogs: true,
  screenshotPath: './errorShots/',
  baseUrl: '',
  waitforTimeout: 90000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  host: 'hub.browserstack.com',

  before: function() {
    var chai = require('chai')
    global.expect = chai.expect
    chai.Should()
  },
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 600000
  },
  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or spec.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   *
   * Replacing the SessionID with the name of the test on Browser Stack
   */
  beforeSession: function(config, capabilities, specs) {
    capabilities.name = (specs && specs[0].split('/').pop()) || undefined
  },
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {Number} result 0 - test pass, 1 - test fail
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   *
   * After each test has completed this after() method will
   * update the BrowserStack API with the result of the test ran
   */
  after: async function(result, capabilities, specs) {
    let sessionid = browser.sessionId

    function doRequest(url, testStatus) {
      return new Promise(function(resolve, reject) {
        request(
          {
            uri: url,
            method: 'PUT',
            form: { status: testStatus, reason: '' }
          },
          function(error, response, body) {
            if (!error && response.statusCode === 200) {
              resolve(body)
            } else {
              reject(error)
            }
          }
        )
      })
    }

    if (result === 0) {
      let res = await doRequest(`https://${this.user}:${this.key}@api.browserstack.com/automate/sessions/${sessionid}.json`, 'passed')
      console.log(res)
    } else {
      let res = await doRequest(`https://${this.user}:${this.key}@api.browserstack.com/automate/sessions/${sessionid}.json`, 'error')
      console.log(res)
    }
  }
}
