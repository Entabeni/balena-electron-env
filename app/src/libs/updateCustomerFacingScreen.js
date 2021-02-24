const { ipcRenderer } = window.require('electron')
const noCfSceen = process.env.CLIENT_FACING === '2'

export const updateCustomerFacingScreen = ({ screen, orderId, waiverId, client, toastManager, match, guestId, isCustomerFacing }) => {
  if (!noCfSceen) {
    const customerFacingPrintTerminal = window.localStorage.getItem('customerFacingPrintTerminal')
    var screenSentence = screen.replace(/([A-Z])/g, ' $1')
    // if (customerFacingPrintTerminal) {
    return new Promise((resolve, reject) => {
      let currentOrderId
      if (!orderId) {
        currentOrderId = match && match.params.orderId
      } else {
        currentOrderId = orderId
      }
      ipcRenderer.send(`update-${!isCustomerFacing ? 'customer' : 'cashier'}-facing-screen`, {
        id: customerFacingPrintTerminal,
        screenSteps: screen,
        waiverId,
        orderId: currentOrderId,
        guestId
      })
      if (!isCustomerFacing) {
        toastManager.add(`Customer screen showing ${screenSentence}.`, { appearance: 'success', autoDismiss: true, autoDismissTimeout: 3000 })
      }
      resolve()
    })
  }
}
