const LoginPage = require('../../../pages/login.page')
const OrderPage = require('../../../pages/order.page')
const Utils = require('../../../pages/utils.page')

const BlankOrderTest = require('../../../testParts/blankOrder/blankOrder.success.spec')
const CompleteOrderTest = require('../../../testParts/completeOrder/completeOrder.success.spec')
const DepartmentsTest = require('../../../testParts/departmentProducts/departmentProducts.success.spec')
const EmailSendingTest = require('../../../testParts/email/emailSending.success.spec')
const GuestTest = require('../../../testParts/guest/guest.CRUD.spec')
const OutstandingRentalAssetsTest = require('../../../testParts/outstandingRentalAssets/outstandingRentalAssets.spec')
const PreviousOrderTest = require('../../../testParts/previousOrder/previousOrder.success.spec')
const ProductWithDayStepTest = require('../../../testParts/productWithDayStep/productWithDayStep.success.spec')
const ProductWithEventAndQuestionStepsTest = require('../../../testParts/productWithEventAndQuestionSteps/productWithEventAndQuestionSteps.success.spec')
const RefundTest = require('../../../testParts/refund/refund.success.spec')
const UserClosingSessionBalanceTest = require('../../../testParts/userClosingSessionBalance/userClosingSessionBalance.success.spec')
const RentalProductTest = require('../../../testParts/rentalProduct/rentalProduct.success.spec')
const DefaultPageTest = require('../../../testParts/defaultPage/defaultPage.success.spec')
const ResortEventTest = require('../../../testParts/resortEvents/resortEvents.success.spec')

describe('Main Pages Functionality Test', () => {
  it('should login successfully', () => {
    LoginPage.login()
  })

  it('should select TDD print terminal', () => {
    LoginPage.printTerminal.waitForDisplayed()
    LoginPage.printTerminal.click()
    browser.keys(['TDD', 'Enter'])
    browser.pause(2000)
    Utils.getButton('Select and Submit').click()
  })

  it('should fill in Opening Session Balances', () => {
    LoginPage.completeOpeningSessionBalance(OrderPage.orderNumber)
  })

  describe('should check POS app pages flow', () => {
    DefaultPageTest()
    BlankOrderTest()
    EmailSendingTest()
    GuestTest()
    OutstandingRentalAssetsTest()
    PreviousOrderTest()
  })

  describe('should purchase and refund', () => {
    DepartmentsTest()
    CompleteOrderTest()
    ResortEventTest()
    RentalProductTest()
    ProductWithDayStepTest()
    ProductWithEventAndQuestionStepsTest()
    UserClosingSessionBalanceTest()
  })

  console.log(`Main Pages Functionality Test BrowserStack SessionId: ${browser.sessionId}`)
})
