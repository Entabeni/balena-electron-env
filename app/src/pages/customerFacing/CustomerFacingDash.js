import React, { useEffect, useState } from 'react'
import { withToastManager } from 'react-toast-notifications'
import { LogoScreen } from 'es-pages'
import { UPDATE_PRINT_TERMINAL_SUBSCRIPTION } from '../dashboard/schema'
import { withApollo, Subscription } from 'react-apollo'
import { CUSTOMER_WAIVER, GET_ORDER, GET_GUEST } from './schema'
import { LogoSpan, ProductCopyText, BreakLine, EntabeniIconLogo } from 'es-components'
import OrderScreen from './OrderScreen'
import WaiverScreen from './WaiverScreen'
import PhotoCaptureScreen from './PhotoCaptureScreen'
import styled from 'styled-components'
import { updateCustomerFacingScreen } from 'es-libs'
const { ipcRenderer } = window.require('electron')

export const ProductCopy = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0.5em;
  left: 0;
  right: 0;
  padding: 0 2em;

  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
`
export const LogoWrap = styled.div`
  width: auto;
  max-width: 75%;
  width: 75%;
  height: 100%;
  position: absolute;
  left: 50%;
  display: flex;
  align-items: center;
  padding: 30px;
  top: 50%;
  transform: translate(-50%, -50%);
  max-height: 85%;
  & img {
    margin: auto;
  }
`
export const LogoTopWrap = styled.div`
  width: auto;
  /* max-width: 300px; */
  z-index: 99;
  position: absolute;
  left: 50%;
  top: 60px;
  transform: translate(-50%, -50%);
  height: 83px;
`

export const Footer = ({ top = false }) => {
  return (
    <ProductCopy top={top}>
      <EntabeniIconLogo isCustomerFacing />
      <ProductCopyText isCustomerFacing>Product of Entabeni Systems</ProductCopyText>
      <BreakLine />
    </ProductCopy>
  )
}
const CustomerFacingDashInner = ({ client, cookies, toastManager, printTerminalData }) => {
  const [activeSection, setActiveSection] = useState(0)
  const [useCurrentScreen, setCurrentScreen] = useState('logo')
  const [currentSale, setCurrentSale] = useState({ total: 0, number: 0 })
  const [guestSelected, setGuestSelected] = useState(null)
  const [waiver, setWaiver] = useState(null)
  const updateScreen = ({ orderId }) => {
    setCurrentScreen('logo')
    updateCustomerFacingScreen({ screen: orderId ? 'presentOrder' : 'logo', orderId, toastManager, client, isCustomerFacing: true })
  }
  const [currentOrder, setCurrentOrder] = useState({ total: 0, taxTotal: 0, subTotal: 0, number: 0, orderLineItems: [] })
  useEffect(() => {
    document.body.style.overscrollBehavior = 'none'
    document.getElementsByTagName('html')[0].style.overscrollBehavior = 'none'
  }, [])
  useEffect(() => {
    const newScreen = printTerminalData && printTerminalData.screenSteps
    if (newScreen) {
      switch (newScreen) {
        case 'logo':
          setCurrentScreen('logo')
          setActiveSection(0)
          break
        case 'blankOrder':
          setCurrentScreen('logo')
          break
        case 'presentOrder':
          client.query({ query: GET_ORDER, variables: { id: printTerminalData && printTerminalData.orderId } }).then(res => {
            toastManager.add('Order updated', { appearance: 'success', autoDismissTimeout: 3000, autoDismiss: true })
            setCurrentOrder(res.data.customerFacingPos.order)
            setCurrentScreen(res.data.customerFacingPos.order.orderLineItems.length > 0 ? 'order' : 'logo')
          })
          break
        case 'waiver':
          client.query({ query: CUSTOMER_WAIVER, variables: { id: printTerminalData && printTerminalData.waiverId } }).then(res => {
            toastManager.add('Order updated', { appearance: 'success', autoDismissTimeout: 3000, autoDismiss: true })
            setWaiver(res.data.customerFacingPos.completedWaiver)
            setCurrentScreen('waiver')
          })
          break
        case 'photoCapture':
          client.query({ query: GET_GUEST, variables: { id: printTerminalData && printTerminalData.guestId } }).then(result => {
            const { guest } = result.data.customerFacingPos
            if (guest) {
              setGuestSelected(guest)
            }
            setCurrentScreen('photoCapture')
          })
          break
        default:
          setCurrentScreen('logo')
      }
    }
  }, [printTerminalData])
  const Inner = () => {
    switch (useCurrentScreen) {
      case 'logo':
        return (
          <LogoWrap>
            <LogoScreen />
          </LogoWrap>
        )
      case 'blankOrder':
      case 'order':
        return <OrderScreen currentSale={currentSale} currentOrder={currentOrder} />
      case 'waiver':
        return (
          <WaiverScreen
            activeSection={activeSection}
            updateScreen={updateScreen}
            setActiveSection={setActiveSection}
            setCurrentScreen={setCurrentScreen}
            toastManager={toastManager}
            waiver={waiver}
            client={client}
            orderId={currentOrder.id}
          />
        )
      case 'photoCapture':
        return <PhotoCaptureScreen orderId={currentOrder.id} toastManager={toastManager} client={client} guest={guestSelected} updateScreen={updateScreen} />
    }
  }

  return (
    <LogoSpan height={'100%'} width={'100%'} customerFacing>
      {useCurrentScreen !== 'logo' && (
        <LogoTopWrap>
          <LogoScreen isFullSize />
        </LogoTopWrap>
      )}
      <Inner />
      <Footer />
    </LogoSpan>
  )
}
const CustomerFacingDash = ({ client, cookies, toastManager }) => {
  const [useData, setData] = useState(null)
  ipcRenderer.on('message-from-customer-facing', (event, data) => {
    console.log('🚀 ~ file: CustomerFacingDash.js ~ line 163 ~ ipcRenderer.on ~ data', data)
    console.log('🚀 ~ file: CustomerFacingDash.js ~ line 163 ~ ipcRenderer.on ~ event', event)
    setData(data)
  })

  return <CustomerFacingDashInner client={client} cookies={cookies} toastManager={toastManager} printTerminalData={useData} />
}
export default withToastManager(withApollo(CustomerFacingDash))
