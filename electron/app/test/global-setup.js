const { should, use } = require('chai')
const chaiAsPromised = require('chai-as-promised')
const Application = require('spectron').Application
const path = require('path')
global.before(() => {
  should()
  use(chaiAsPromised)
})

var app = new Application({
  path: path.join(__dirname, '..', 'node_modules', '.bin', 'electron' + (process.platform === 'win32' ? '.cmd' : '')),
  args: [path.join(__dirname, '..')],
  env: {
    ELECTRON_ENABLE_LOGGING: true,
    ELECTRON_ENABLE_STACK_DUMPING: true,
    NODE_ENV: 'test'
  },
  waitTimeout: 10e3,
  requireName: 'electronRequire',
  chromeDriverLogPath: '../chromedriverlog.txt',
  chromeDriverArgs: ['remote-debugging-port=9222']
})
exports.app = app
