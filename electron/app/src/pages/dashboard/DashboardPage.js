import React, { useState, useEffect, useContext } from 'react'
import { withApollo } from 'react-apollo'
import { withToastManager } from 'react-toast-notifications'
import { confirmAlert } from 'react-confirm-alert'

// Components
import {
  DashboardContainer,
  DashboardHeader,
  DashboardWrapperSingle,
  DashboardNavigation,
  DashboardFooter,
  BalancesModal,
  DarkModalLayout
} from 'es-components'

import { logoutHandler, errorHandler } from 'es-libs'

// Pages
import { OutstandingRentalAssets } from './OutstandingRentalAssets'
import { AllGuestsCheckinsPage } from './AllGuestsCheckinsPage'
import { OrdersPage } from './OrdersPage'
import SalesPage from './SalesPage'
import { GuestsPage } from './GuestsPage'

// GraphQL queries
import { CREATE_PRINT_JOB_MUTATION, CREATE_ORDER_MUTATION, ADD_ORDER_LINE_ITEMS_MUTATION } from './schema'

import { UPSERT_POS_SESSION, UPDATE_POS_SESSION } from '../auth/schema'

// Context
import { SiteGlobalContext } from 'es-context'
// Interceptor globals
import { interceptorGlobalKeyNames } from '../../components/modal/beforeLeavingInterceptor'
import { CurrentOrder } from './CurrentOrder'
import { updateCustomerFacingScreen } from 'es-libs'
const { ipcRenderer } = window.require('electron')
// Safe key name for storing the interceptor modal methods/values in a 'private' global value
const interceptorCashOutGKN = interceptorGlobalKeyNames.cashOut
const interceptorCashOutMethodGKN = interceptorGlobalKeyNames.cashOutMethod

const DashboardPage = ({ match, history, client, toastManager }) => {
  const ctx = useContext(SiteGlobalContext)
  const reCheckOrderRanOutTime = (order, cb) => {
    ctx && ctx.checkForTimeOut(order)
    if (cb && typeof cb === 'function') {
      cb()
    }
  }
  const [useCashoutModalOpen, setCashoutModalOpen] = useState(false)
  const [useSessionId, setSessionId] = useState(null)
  const [useBalances, setBalances] = useState([])
  const [useCurrentOrderId, setCurrentOrderId] = useState(match.params.orderId || null)
  const orderId = match.params.orderId
  const [useProductSelected, setProductSelected] = useState(null)
  const [useQuantitySelected, setQuantitySelected] = useState(null)
  const [useUpdatingOrder, setUpdatingOrder] = useState(false)
  const [usePurchaserId, setPurchaserId] = useState(null)
  const [usePayments, setPayments] = useState([])
  const [useSale, setSale] = useState({})
  const [useCreatedPayments, setCreatedPayments] = useState([])
  const [useAllProducts, setAllProducts] = useState([])
  const [useCurrentCustomerFacingScreen, setCurrentCustomerFacingScreen] = useState('logo')
  const [useAllCategories, setAllCategories] = useState(null)
  const [useAccountFromRequest, setAccountFromRequest] = useState(null)
  const [useProductsLoading, setProductsLoading] = useState(false)
  // Subscribing this class component to the globally shared App's context
  useEffect(() => {
    if (orderId) {
      if (['orders', 'outstandingAssets', 'sales', 'checkIns', 'guests'].includes(orderId) && useCurrentCustomerFacingScreen !== 'logo') {
        setCurrentCustomerFacingScreen('logo')
        updateCustomerFacingScreen({ screen: 'logo', client, toastManager })
      }
    }
  }, [orderId])
  const handleCashoutClick = () => {
    const messageStyling = {
      lineHeight: '2.5rem',
      size: '1.5rem',
      textAlign: 'center'
    }
    const buttons = [
      {
        label: 'Yes',
        onClick: () => {
          const printTerminalId = window.localStorage.getItem('printTerminalId')
          sessionUpsert(
            printTerminalId,
            upsertPosSession => {
              setCashoutModalOpen(true)
              setSessionId(upsertPosSession.id)
              setBalances(upsertPosSession.closingSessionBalances)
            },
            error => {
              console.error(error)
            }
          )
        }
      },
      {
        label: 'No',
        onClick: () => {}
      }
    ]
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <DarkModalLayout
            buttons={buttons}
            className="custom-ui"
            message={
              <React.Fragment>
                Are you sure you want to cash out for the day?
                <br />
                This cannot be undone.
              </React.Fragment>
            }
            messageStyling={messageStyling}
            onClick={onClose}
            title="Cashout Request"
            titleHint="Confirm to continue"
          />
        )
      }
    })
  }

  const handleSubmittedClosingBalance = balanceObj => {
    if (balanceObj) {
      sessionUpdate(
        useSessionId,
        Object.keys(balanceObj).map(balanceId => ({ id: balanceId, quantity: +balanceObj[balanceId] })),
        () => {
          const printTerminalId = window.localStorage.getItem('printTerminalId')
          client
            .mutate({
              mutation: CREATE_PRINT_JOB_MUTATION,
              variables: {
                printJobType: 'cashout',
                printTerminalId,
                printData: JSON.stringify({ posSessionId: useSessionId })
              }
            })
            .then(res => {
              if (res.data.pos.createPrintJob.id) {
                console.log('🚀 ~ file: DashboardPage.js ~ line 146 ~ DashboardPage ~ res', res)
                toastManager.add('Success', { appearance: 'success', autoDismiss: true })
                if (res.data.pos.createPrintJob) {
                  console.log('🚀', res)
                  ipcRenderer.send('cashout-button', res.data.pos.createPrintJob.printData)
                }
                logoutHandler({ client, history, toastManager })
              }
            })
        },
        error => {
          console.error(error)
        }
      )
    }
  }

  const sessionUpsert = async (printTerminalId, successCB, errorCB) => {
    try {
      const result = await client.mutate({ mutation: UPSERT_POS_SESSION, variables: { printTerminalId } })
      if (!!result && result.data.pos.upsertPosSession) {
        const upsertPosSession = result.data.pos.upsertPosSession
        if (Object.keys(upsertPosSession).length > 0) {
          successCB(upsertPosSession)
        } else {
          throw new Error('There are not any sessions.')
        }
      } else {
        throw new Error('There was an error with the response from the server.')
      }
    } catch (error) {
      const currentError = errorHandler(error)
      toastManager.add('The retrieval of the session failed.', { appearance: 'error', autoDismiss: false })
      errorCB(currentError.message)
    }
  }

  const handleRefundAdded = (orderLineItems, purchaserId, refundShippingOption) => {
    setPurchaserId(purchaserId)
    setUpdatingOrder(true)
    setProductSelected(null)
    setQuantitySelected(null)
    client
      .mutate({
        mutation: CREATE_ORDER_MUTATION
      })
      .then(res => {
        const currentOrderId = res.data.pos.createOrder.id
        setPayments([])
        setCreatedPayments([])
        setSale({})
        setCurrentOrderId(currentOrderId)
        client
          .mutate({
            mutation: ADD_ORDER_LINE_ITEMS_MUTATION,
            variables: {
              id: currentOrderId,
              orderLineItems: orderLineItems,
              refundShippingOption: refundShippingOption
            }
          })
          .then(res => {
            reCheckOrderRanOutTime(res.data.pos.updateOrder)
            setUpdatingOrder(false)
            setCurrentCustomerFacingScreen('presentOrder')
            updateCustomerFacingScreen({ screen: 'presentOrder', orderId: currentOrderId, client, toastManager, match })
          })
          .catch(error => {
            toastManager.add(`An error occured ${error && error.message && ': ' + error.message}`, { appearance: 'error', autoDismiss: true })
            setUpdatingOrder(false)
          })
        history.push(`/order/${currentOrderId}`)
      })
  }

  const sessionUpdate = async (sessionId, sessionBalances, successCB, errorCB) => {
    try {
      const result = await client.mutate({ mutation: UPDATE_POS_SESSION, variables: { id: sessionId, sessionBalances, status: 'closed' } })
      if (!!result && result.data.pos.updatePosSession) {
        const updatePosSession = result.data.pos.updatePosSession
        if (Object.keys(updatePosSession).length > 0) {
          successCB(updatePosSession)
        } else {
          throw new Error('There are not any sessions.')
        }
      } else {
        throw new Error('There was an error with the response from the server.')
      }
    } catch (error) {
      const currentError = errorHandler(error)
      toastManager.add('The retrieval of the session failed.', { appearance: 'error', autoDismiss: false })
      errorCB(currentError.message)
    }
  }

  const renderPage = () => {
    if (match.params.orderId === 'orders') {
      return (
        <DashboardWrapperSingle>
          <OrdersPage history={history} account={useAccountFromRequest} client={client} />
        </DashboardWrapperSingle>
      )
    } else if (match.params.orderId === 'outstandingAssets') {
      return (
        <DashboardWrapperSingle>
          <OutstandingRentalAssets client={client} />
        </DashboardWrapperSingle>
      )
    } else if (match.params.orderId === 'sales') {
      return (
        <DashboardWrapperSingle>
          <SalesPage client={client} onCreateRefund={handleRefundAdded} currentOrderId={useCurrentOrderId} />
        </DashboardWrapperSingle>
      )
    } else if (match.params.orderId === 'checkIns') {
      return (
        <DashboardWrapperSingle>
          <AllGuestsCheckinsPage
            onRefreshProducts={() => setProductsLoading(true)}
            allProducts={useAllProducts}
            currentOrderId={useCurrentOrderId}
            allCategories={useAllCategories}
            client={client}
            accountFromRequest={useAccountFromRequest}
            productsLoading={useProductsLoading}
            history={history}
          />
        </DashboardWrapperSingle>
      )
    } else if (match.params.orderId === 'guests') {
      return (
        <DashboardWrapperSingle>
          <GuestsPage client={client} account={useAccountFromRequest} toastManager={toastManager} />
        </DashboardWrapperSingle>
      )
    } else {
      return (
        <CurrentOrder
          match={match}
          reCheckOrderRanOutTime={reCheckOrderRanOutTime}
          history={history}
          useCurrentOrderId={useCurrentOrderId}
          setCurrentOrderId={setCurrentOrderId}
          useProductSelected={useProductSelected}
          useQuantitySelected={useQuantitySelected}
          useUpdatingOrder={useUpdatingOrder}
          usePurchaserId={usePurchaserId}
          useAllCategories={useAllCategories}
          setCurrentCustomerFacingScreen={setCurrentCustomerFacingScreen}
          useCurrentCustomerFacingScreen={useCurrentCustomerFacingScreen}
          setAllCategories={setAllCategories}
          setAllProducts={setAllProducts}
          useAllProducts={useAllProducts}
          setAccountFromRequest={setAccountFromRequest}
          useAccountFromRequest={useAccountFromRequest}
          usePayments={usePayments}
          useSale={useSale}
          useCreatedPayments={useCreatedPayments}
          setPayments={setPayments}
          setSale={setSale}
          setCreatedPayments={setCreatedPayments}
          setQuantitySelected={setQuantitySelected}
          setUpdatingOrder={setUpdatingOrder}
          setProductSelected={setProductSelected}
        />
      )
    }
  }

  // Wrapper needed for validating if the flow requires any confirmation from any incomplete process started before
  const handleCashOutClickWrapperFn = e => {
    e.preventDefault()
    // Verifying no pending/incomplete process has been started before
    if (ctx && ctx.askBeforeLeaving) {
      window[interceptorCashOutGKN] = true
      // Setting an asynchronous callback due to modals closing/opening times between them
      window[interceptorCashOutMethodGKN] = () => setTimeout(this.handleCashoutClick.bind(this), 500)
      // Triggering the React Router customized prompt
      history.push(window.location.pathname)
      return null
    }
    // Using regular cashout flow
    handleCashoutClick()
  }

  return (
    <DashboardContainer dashbordNav>
      <DashboardHeader client={client} orderId={match.params.orderId} onClosePrintTerminalDetailsModal={() => setProductsLoading(true)} />
      <DashboardNavigation history={history} client={client} toastManager={toastManager} onCashoutClick={handleCashOutClickWrapperFn} />
      {renderPage()}
      <DashboardFooter />
      {useCashoutModalOpen && <BalancesModal title="Closing Session Balances" balances={useBalances} onPrimaryBtnHandler={handleSubmittedClosingBalance} />}
    </DashboardContainer>
  )
}

export default withToastManager(withApollo(DashboardPage))
