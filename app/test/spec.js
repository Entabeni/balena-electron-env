const { should, use } = require('chai')
const chaiAsPromised = require('chai-as-promised')
const Application = require('spectron').Application
const globalSetup = require('./global-setup')
const app = globalSetup.app
const LoginPage = require('./pages/login.page')
const OrderPage = require('./pages/order.page')
const Utils = require('./pages/utils.page')

const BlankOrderTest = require('./testParts/blankOrder/blankOrder.success.spec')
const CompleteOrderTest = require('./testParts/completeOrder/completeOrder.success.spec')
const DepartmentsTest = require('./testParts/departmentProducts/departmentProducts.success.spec')
const EmailSendingTest = require('./testParts/email/emailSending.success.spec')
const GuestTest = require('./testParts/guest/guest.CRUD.spec')
const OutstandingRentalAssetsTest = require('./testParts/outstandingRentalAssets/outstandingRentalAssets.spec')
const PreviousOrderTest = require('./testParts/previousOrder/previousOrder.success.spec')
const ProductWithDayStepTest = require('./testParts/productWithDayStep/productWithDayStep.success.spec')
const ProductWithEventAndQuestionStepsTest = require('./testParts/productWithEventAndQuestionSteps/productWithEventAndQuestionSteps.success.spec')
const RefundTest = require('./testParts/refund/refund.success.spec')
const UserClosingSessionBalanceTest = require('./testParts/userClosingSessionBalance/userClosingSessionBalance.success.spec')
const RentalProductTest = require('./testParts/rentalProduct/rentalProduct.success.spec')
const DefaultPageTest = require('./testParts/defaultPage/defaultPage.success.spec')
const ResortEventTest = require('./testParts/resortEvents/resortEvents.success.spec')

describe('Main Pages Functionality Test', function() {
  this.timeout(20000)

  beforeEach(function(done) {
    app.start().then(function() {
      done()
    })
  })

  afterEach(function(done) {
    app.stop().then(function() {
      done()
    })
  })
  describe('Main Pages Functionality Test Inner', function() {
    it('should login successfully and select TDD print terminal', async () => {
      app.client.waitUntilWindowLoaded(10000)
      await LoginPage.login()
      await (await app.client.$('#printTerminalSelect')).click()
      await app.client.keys(['test2', 'Enter'])
      await (await app.client.$(`//button[text()='Select and Submit']`)).click()
      await LoginPage.completeOpeningSessionBalance(OrderPage.orderNumber)

      return app.client.$('#asdf').should.eventually.exist
    })
  })
})
