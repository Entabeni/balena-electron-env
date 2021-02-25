import React, { useState, useEffect, useCallback } from 'react'
import { withApollo, Query } from 'react-apollo'
import { withToastManager } from 'react-toast-notifications'
import { confirmAlert } from 'react-confirm-alert'

// Components
import {
  DashboardWrapper,
  DashboardWrapperSingle,
  DashboardProgressBar,
  OrderPanelWrapper,
  AssignItemModal,
  AssignResortEventModal,
  DiscountModal,
  SelectPurchaserModal,
  AccessRecordPrintModal,
  SpinLoader,
  DarkModalLayout,
  AddUpsellItemModal
} from 'es-components'

import { algoliaSearch, updateCustomerFacingScreen } from 'es-libs'

// Pages
import { ProductsPage } from './ProductsPage'
import { WaiversPage } from './WaiversPage'
import { PaymentsPage } from './PaymentsPage'

// GraphQL queries
import {
  CREATE_ORDER_MUTATION,
  DELETE_ORDER_MUTATION,
  ADD_ORDER_LINE_ITEMS_MUTATION,
  ADD_PURCHASER_MUTATION,
  UPDATE_ORDER_STEP_MUTATION,
  DELETE_ORDER_LINE_ITEM_MUTATION,
  CREATE_PAYMENT_MUTATION,
  GET_DASHBOARD_QUERY,
  GET_PRODUCT_BY_ID,
  GET_CATEGORIES,
  GET_WAIVERS_QUERY
} from './schema'

// Context
// Interceptor globals

export const CurrentOrder = withApollo(
  withToastManager(
    ({
      client,
      toastManager,
      match,
      history,
      useAllCategories,
      setAllCategories,
      setAllProducts,
      useAllProducts,
      useAccountFromRequest,
      setCurrentCustomerFacingScreen,
      useCurrentCustomerFacingScreen,
      reCheckOrderRanOutTime,
      setAccountFromRequest,
      useCurrentOrderId,
      setCurrentOrderId,
      setPayments,
      usePayments,
      useSale,
      setSale,
      setCreatedPayments,
      useCreatedPayments,
      setQuantitySelected,
      setUpdatingOrder,
      setProductSelected,
      useProductSelected,
      useUpdatingOrder,
      usePurchaserId,
      useQuantitySelected
    }) => {
      const [useAddDiscountModalOpen, setAddDiscountModalOpen] = useState(false)
      const [useResortEventProductSelected, setResortEventProductSelected] = useState(null)
      const [useLoadingProductModal, setLoadingProductModal] = useState(false)
      const [useResortEventDateSelected, setResortEventDateSelected] = useState(null)
      const [usePreviousPaymentsAdded, setPreviousPaymentsAdded] = useState(false)
      const [useUpdatingOrderStep, setUpdatingOrderStep] = useState(false)
      const [useCompletingPayment, setCompletingPayment] = useState(false)
      const [useCompletedAllWaivers, setCompletedAllWaivers] = useState(false)
      const [useCardData, setCardData] = useState([])
      const [useProductsLoading, setProductsLoading] = useState(false)
      const [useWaivers, setWaivers] = useState(null)
      const [useFilteredCategories, setFilteredCategories] = useState([])
      const [useCompletedWaiversCount, setCompletedWaiversCount] = useState(0)
      const [useWaiversLoading, setWaiversLoading] = useState(false)
      const [useResetBecauseOfTimeOut, setResetBecauseOfTimeOut] = useState(false)
      useEffect(() => {
        if (!useProductsLoading && useAllCategories && useAllProducts.length) {
          setFilteredCategories(
            useAllCategories.filter(category => {
              const categoryIdsUnique = []
              useAllProducts.forEach(product => {
                if (product.categoryIds && product.categoryIds.length) {
                  product.categoryIds.forEach(categoryId => {
                    if (!categoryIdsUnique.includes(categoryId)) {
                      categoryIdsUnique.push(categoryId)
                    }
                  })
                }
              })
              if (categoryIdsUnique.length) {
                return categoryIdsUnique.includes(category.id)
              }
              return true
            })
          )
        }
      }, [useAllCategories, useAllProducts, useProductsLoading])
      useEffect(() => {
        console.log('match.params.orderId', match.params.orderId)
        if (!match.params.orderId) {
          createOrder()
        } else if (match.params.orderId && !useCurrentOrderId) {
          // createOrder(true)
          loadProducts()
          setCurrentOrderId(match.params.orderId)
          // history.push(`/order/${match.params.orderId}`)
        } else if (useCurrentOrderId !== match.params.orderId) {
          setCurrentOrderId(match.params.orderId)
          // loadProducts()
          history.push(`/order/${match.params.orderId}`)
        } else if (useCurrentOrderId === match.params.orderId) {
          loadProducts()
        }
        return () => {
          setCurrentOrderId(null)
        }
      }, [match.params.orderId])

      const handleNewOrder = () => {
        createOrder()
      }

      const handleCancelOrder = () => {
        deleteOrder()
      }
      const deleteOrder = () => {
        client
          .mutate({
            mutation: DELETE_ORDER_MUTATION,
            variables: { id: match.params.orderId }
          })
          .then(res => {
            setPayments([])
            setCreatedPayments([])
            setSale({})
            history.push('/order')
            setCurrentCustomerFacingScreen('logo')
            if (useCurrentCustomerFacingScreen !== 'logo') {
              updateCustomerFacingScreen({ screen: 'logo', client, toastManager, match })
            }
          })
      }

      const createOrder = loadNewProducts => {
        client
          .mutate({
            mutation: CREATE_ORDER_MUTATION
          })
          .then(res => {
            const currentOrderId = res.data.pos.createOrder.id
            setCompletedAllWaivers(false)
            setPayments([])
            setCreatedPayments([])
            setSale({})
            setCurrentOrderId(currentOrderId)
            if (loadNewProducts) {
              loadProducts()
            }
            history.push(`/order/${currentOrderId}`)
          })
      }

      const makeProductsFilterString = () => {
        const departments = JSON.parse(window.localStorage.getItem('departments'))
        const departmentIds = []
        Object.keys(departments).forEach(key => {
          if (departments[key]) {
            departmentIds.push(key)
          }
        })
        let filter = null
        if (departmentIds && departmentIds.length) {
          filter = 'isUpsellProduct:false AND enabled:true AND ('
          departmentIds.forEach((id, i) => {
            if (i > 0) {
              filter = filter + ' OR '
            }

            filter = filter + `departmentIds:"${id}"`
          })

          filter = filter + ')'
        }

        return filter
      }

      const loadProducts = () => {
        const filters = makeProductsFilterString()
        setProductsLoading(true)
        if (filters) {
          const attributesToRetrieve = 'name,rank,imageUrl,categoryIds,ageVariants,showWarning,checkStockLevel,price,specialPrice,objectID,color,skus'
          algoliaSearch('products', { filters, attributesToRetrieve }, (err, allProducts) => {
            if (allProducts) {
              setAllProducts(allProducts)
              setProductsLoading(false)
              toastManager.add('Actual data displaying', { appearance: 'success', autoDismiss: true, productsLoading: false })
            }
          })
        } else {
          setAllProducts([])
        }

        client.query({ query: GET_CATEGORIES }).then(({ data }) => {
          const { allCategories, account } = data.pos
          setAllCategories(allCategories)
          if (!filters) {
            setProductsLoading(false)
          }
          setAccountFromRequest(account)
        })
      }

      const handlePurchaserAdded = (purchaser, orderSteps) => {
        setUpdatingOrderStep(true)
        client
          .mutate({
            mutation: ADD_PURCHASER_MUTATION,
            variables: { id: match.params.orderId, purchaserId: purchaser }
          })
          .then(res => {
            reCheckOrderRanOutTime(res.data.pos.updateOrder)
            if (orderSteps.findIndex(step => step === 'signWaivers') === -1) {
              updateOrderStep('addPayment')
            } else {
              loadWaivers()
            }
          })
      }

      const loadWaivers = () => {
        setWaiversLoading(true)
        setUpdatingOrderStep(true)
        client.query({ query: GET_WAIVERS_QUERY, variables: { orderId: match.params.orderId } }).then(({ data }) => {
          const { allCompletedWaivers } = data.pos
          let completedWaiversCount = 0
          const state = { waivers: allCompletedWaivers, waiversLoading: false }

          allCompletedWaivers.forEach(waiver => {
            if (waiver.status === 'completed') {
              completedWaiversCount++
            }
          })
          state['completedWaiversCount'] = completedWaiversCount
          if (allCompletedWaivers.length === completedWaiversCount) {
            state['completedAllWaivers'] = true
            updateOrderStep('addPayment')
          }
          setWaivers(allCompletedWaivers)
          setUpdatingOrderStep(false)
          setWaiversLoading(false)
          updateOrderStep('signWaivers')
        })
      }

      const handleGoBack = (currentStep, orderSteps) => {
        if (currentStep === 'addPurchaser') {
          updateOrderStep('addProducts')
        } else if (currentStep === 'signWaivers') {
          updateOrderStep('addPurchaser')
        } else if (currentStep === 'addPayment') {
          if (orderSteps.findIndex(step => step === 'signWaivers') === -1) {
            updateOrderStep('addPurchaser')
          } else {
            loadWaivers()
          }
        }
      }

      const updateOrderStep = (step, options) => {
        if (options && options.reset) {
          setResetBecauseOfTimeOut(true)
        }
        setUpdatingOrder(true)
        const vars = { id: match.params.orderId }
        if (step) {
          vars['step'] = step
        }
        client
          .mutate({
            mutation: UPDATE_ORDER_STEP_MUTATION,
            variables: vars
          })
          .then(res => {
            reCheckOrderRanOutTime(res.data.pos.updateOrder)
            if (options && options.cb && typeof options.cb === 'function') {
              options.cb()
            }
            if (options && options.reset) {
              updateOrderStep('addProducts')
              setCompletedAllWaivers(false)
              setPayments([])
              setCreatedPayments([])
              setSale({})
              const order = res.data.pos.updateOrder
              setUpdatingOrder(false)
              setUpdatingOrderStep(false)
              if (order.orderLineItems.length) {
                history.replace(`/order/${order.id}`)
                setResetBecauseOfTimeOut(false)
              } else {
                history.push('/order')
              }
            } else {
              setUpdatingOrder(false)
              setUpdatingOrderStep(false)
            }
          })
          .catch(error => {
            toastManager.add(`An error occured`, { appearance: 'error', autoDismiss: true })
            setUpdatingOrder(false)
            setUpdatingOrderStep(false)
          })
      }

      const handlePaymentAdded = (payment, cardData, type) => {
        let newPayments
        if (payment.length) {
          usePayments.forEach(payment => {
            payment['type'] = type || 'other'
          })
          newPayments = [...payment, ...usePayments]
        } else {
          newPayments = [payment, ...usePayments]
        }
        setPayments(newPayments)
        setCardData(cardData)
      }

      const completeSale = () => {
        setUpdatingOrderStep(true)
        client
          .mutate({
            mutation: UPDATE_ORDER_STEP_MUTATION,
            variables: { id: match.params.orderId, step: 'posOrderComplete' }
          })
          .then(res => {
            reCheckOrderRanOutTime(res.data.pos.updateOrder)
            setUpdatingOrderStep(false)
            setCompletingPayment(false)
            if (res.data.pos.updateOrder.sale && res.data.pos.updateOrder.sale.id) {
              toastManager.add('Payment Success', { appearance: 'success', autoDismiss: true })
              setSale(res.data.pos.updateOrder.sale)
              setPayments([])
              setCompletedWaiversCount(0)
            }
          })
      }

      const loopCreatePayments = (payments, paymentIndex) => {
        if (paymentIndex >= payments.length || !payments[paymentIndex].id) {
          return
        }
        const paymentCardData = useCardData && useCardData.find(({ paymentTypeId }) => paymentTypeId === payment.id)
        const printTerminalId = window.localStorage.getItem('printTerminalId')
        const noIntegratedPayments = payments.filter(payment => payment.paymentType !== 'intergratedCreditCard' && !payment.previousPayment)
        const payment = noIntegratedPayments[paymentIndex]
        const variables = {
          orderId: match.params.orderId,
          paymentTypeId: payment && payment.id,
          amount: payment && parseFloat(payment.amount),
          status: 'completed',
          printTerminalId
        }
        if (paymentCardData && paymentCardData.saveCard) {
          variables.transactions = [
            {
              saveCard: paymentCardData.saveCard
            }
          ]
        }
        if (noIntegratedPayments.length === 0) {
          completeSale()
        } else {
          client
            .mutate({
              mutation: CREATE_PAYMENT_MUTATION,
              variables
            })
            .then(res => {
              if (noIntegratedPayments.length - 1 === paymentIndex) {
                completeSale()
              } else {
                loopCreatePayments(noIntegratedPayments, paymentIndex + 1)
              }
            })
            .catch(err => {
              toastManager.add('Payment Failed, please try again.', { appearance: 'error', autoDismiss: true })
              setCompletingPayment(false)
            })
        }
      }

      const handleProductSelected = useCallback(
        (productSelected, quantitySelected, account) => {
          setLoadingProductModal(true)
          const currentOrderId = match.params.orderId
          client.query({ query: GET_PRODUCT_BY_ID, variables: { id: productSelected.id || productSelected.objectID } }).then(({ data }) => {
            const selectedproductDetails = data.pos.product
            if (selectedproductDetails.steps.length === 0 && selectedproductDetails.upsellProducts.length === 0) {
              const orderLineItems = [{ productId: selectedproductDetails.id, quantity: quantitySelected }]
              handleProductAdded(orderLineItems, currentOrderId)
            }

            if (selectedproductDetails.checkStockLevel) {
              setResortEventProductSelected(selectedproductDetails)
            } else {
              setProductSelected(selectedproductDetails)
              setQuantitySelected(quantitySelected)
            }
            setLoadingProductModal(false)
          })
        },
        [match.params.orderId]
      )

      const handleClosePrintModal = () => {
        const defaultPage = window.localStorage.getItem('defaultPage')
        setCurrentOrderId(null)
        history.push(`/${defaultPage}`)
      }
      const handleCompleteOrder = () => {
        setCompletingPayment(true)
        loopCreatePayments(usePayments, 0)
      }

      const handleRemoveOrderLineItem = orderLineItemId => {
        const messageStyling = {
          lineHeight: '2.5rem',
          size: '1.5rem',
          textAlign: 'center'
        }
        setUpdatingOrder(true)
        const buttons = [
          {
            label: 'Yes',
            onClick: async () => {
              try {
                const res = await client.mutate({
                  mutation: DELETE_ORDER_LINE_ITEM_MUTATION,
                  variables: { orderId: match.params.orderId, orderLineItemId }
                })
                reCheckOrderRanOutTime(res.data.pos.updateOrder)
                if (
                  res &&
                  res.data &&
                  res.data.pos &&
                  res.data.pos.updateOrder &&
                  res.data.pos.updateOrder.orderLineItems &&
                  res.data.pos.updateOrder.orderLineItems.length > 0
                ) {
                  setCurrentCustomerFacingScreen('logo')
                  updateCustomerFacingScreen({ screen: 'presentOrder', client, toastManager, match })
                } else {
                  setCurrentCustomerFacingScreen('logo')
                  if (useCurrentCustomerFacingScreen !== 'logo') {
                    updateCustomerFacingScreen({ screen: 'logo', client, toastManager, match })
                  }
                }
                setUpdatingOrder(false)
              } catch (err) {
                setUpdatingOrder(false)
                toastManager.add('Deleting order line item failed, please try again.', { appearance: 'error', autoDismiss: true })
              }
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
                    Are you sure you want to remove this line item?
                    <br />
                    This cannot be undone.
                  </React.Fragment>
                }
                messageStyling={messageStyling}
                onClick={onClose}
                title="Delete Request"
                titleHint="Confirm to continue"
              />
            )
          }
        })
      }

      const handleRemovePaymentItem = paymentId => {
        const messageStyling = {
          lineHeight: '2.5rem',
          size: '1.5rem',
          textAlign: 'center'
        }
        setUpdatingOrder(true)
        const buttons = [
          {
            label: 'Yes',
            onClick: () => {
              const filteredPayments = usePayments.filter(payment => payment.id !== paymentId)
              setUpdatingOrder(false)
              setPayments(filteredPayments)
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
                    Are you sure you want to remove this payment?
                    <br />
                    This cannot be undone.
                  </React.Fragment>
                }
                messageStyling={messageStyling}
                onClick={onClose}
                title="Delete"
                titleHint="Confirm to continue"
              />
            )
          }
        })
      }

      const onApplyDiscountButtonHandler = (orderLineItemsForDeletingDiscount, orderLineItemsForAddingDiscounts) => {
        if (orderLineItemsForDeletingDiscount.length === 0) {
          handleProductAdded(orderLineItemsForAddingDiscounts)
        }

        if (orderLineItemsForAddingDiscounts.length === 0) {
          handleProductAdded(orderLineItemsForDeletingDiscount)
        }

        if (orderLineItemsForAddingDiscounts.length > 0 && orderLineItemsForDeletingDiscount.length > 0) {
          handleProductAdded(orderLineItemsForDeletingDiscount)
          setTimeout(handleProductAdded, 1000, orderLineItemsForAddingDiscounts)
        }

        setAddDiscountModalOpen(false)
      }

      const onApplyPromoCodeButtonHandler = orderLineItemsForAddingPromos => {
        if (orderLineItemsForAddingPromos.length > 0) {
          return handlePromoProductAdded(orderLineItemsForAddingPromos)
        }

        setAddDiscountModalOpen(false)
      }

      const handleProductAdded = (orderLineItems, orderId) => {
        setUpdatingOrder(true)
        setProductSelected(null)
        setQuantitySelected(null)
        client
          .mutate({
            mutation: ADD_ORDER_LINE_ITEMS_MUTATION,
            variables: { id: orderId ? orderId : match.params.orderId, orderLineItems }
          })
          .then(res => {
            reCheckOrderRanOutTime(res.data.pos.updateOrder)
            setCurrentCustomerFacingScreen('presentOrder')
            updateCustomerFacingScreen({ screen: 'presentOrder', client, toastManager, match })
            setUpdatingOrder(false)
          })
          .catch(error => {
            toastManager.add(`An error occured`, { appearance: 'error', autoDismiss: true })
            setUpdatingOrder(false)
          })
      }

      const handleResortEventProductSelected = (dateSelected, quantitySelected) => {
        setResortEventProductSelected(null)
        setProductSelected(useResortEventProductSelected)
        setResortEventDateSelected(dateSelected)
        setQuantitySelected(quantitySelected)
      }

      const handleProductDeSelected = () => {
        setProductSelected(null)
        setResortEventProductSelected(null)
        setQuantitySelected(null)
      }

      const refreshProducts = useCallback(() => loadProducts(), [])

      const handlePromoProductAdded = orderLineItems => {
        return client
          .mutate({
            mutation: ADD_ORDER_LINE_ITEMS_MUTATION,
            variables: { id: match.params.orderId, orderLineItems }
          })
          .then(res => {
            setCurrentCustomerFacingScreen('presentOrder')
            updateCustomerFacingScreen({ screen: 'presentOrder', client, toastManager, match })
            reCheckOrderRanOutTime(res.data.pos.updateOrder)
            return res
          })
      }

      const showAssignItemModal =
        (useLoadingProductModal || (useProductSelected && useProductSelected.steps[0] === 'addGuests' && useQuantitySelected)) && !useResortEventProductSelected
      if (!match.params.orderId) {
        return (
          <DashboardWrapperSingle>
            <SpinLoader withWrapper="calc(100vh - 91px)" size="80px" color="primary" />
          </DashboardWrapperSingle>
        )
      }
      return (
        <Query query={GET_DASHBOARD_QUERY} variables={{ id: match.params.orderId || useCurrentOrderId }}>
          {({ loading, error, data }) => {
            if (loading)
              return (
                <DashboardWrapperSingle>
                  <SpinLoader withWrapper="calc(100vh - 91px)" size="80px" color="primary" />
                </DashboardWrapperSingle>
              )
            if (error) return `Error! ${error.message}`
            const { order, account } = data.pos

            if (order.payments && order.payments.length && !usePreviousPaymentsAdded) {
              setPreviousPaymentsAdded(true)
              const completedPayments = order.payments.filter(payment => payment.status === 'completed')
              const createdPayments = order.payments.filter(payment => payment.status === 'created')
              const uniqueCreatedPayments = createdPayments.filter((v, i, a) => a.findIndex(t => t.paymentTypeId === v.paymentTypeId) === i)
              if (createdPayments.length) {
                setCreatedPayments(
                  uniqueCreatedPayments.map(payment => ({
                    id: payment.paymentTypeId,
                    paymentId: payment.id,
                    name: payment.paymentTypeName,
                    previousPayment: true
                  }))
                )
              }
              if (completedPayments.length) {
                handlePaymentAdded(
                  completedPayments.map(payment => ({
                    id: payment.paymentTypeId,
                    name: payment.paymentTypeName,
                    amount: payment.amount,
                    previousPayment: true
                  }))
                )
              }
            }

            const canCompleteOrder =
              !useResetBecauseOfTimeOut && usePayments.length > 0 && usePayments.reduce((sum, payment) => +sum + +payment.amount, 0) === order.total

            return (
              <DashboardWrapper>
                <DashboardProgressBar currentStep={order.currentStep} />
                {(order.currentStep === 'addProducts' || order.currentStep === 'addPurchaser') &&
                  (useProductsLoading ? (
                    <SpinLoader withWrapper="calc(100vh - 200px)" size="80px" color="primary" />
                  ) : (
                    <ProductsPage
                      client={client}
                      setCurrentCustomerFacingScreen={setCurrentCustomerFacingScreen}
                      useCurrentCustomerFacingScreen={useCurrentCustomerFacingScreen}
                      order={order}
                      onRefreshProducts={refreshProducts}
                      allProducts={useAllProducts}
                      toastManager={toastManager}
                      orderId={useCurrentOrderId}
                      allCategories={useFilteredCategories}
                      account={account}
                      onProductSelected={handleProductSelected}
                    />
                  ))}
                {order.currentStep === 'signWaivers' &&
                  (useResetBecauseOfTimeOut ? (
                    <SpinLoader withWrapper="calc(100vh - 91px)" size="80px" color="primary" />
                  ) : (
                    <WaiversPage
                      completedAllWaivers={useCompletedAllWaivers}
                      waiversLoading={useUpdatingOrderStep}
                      waivers={useWaivers}
                      completedWaiversCount={useCompletedWaiversCount}
                      order={order}
                      onCompletedAllWaivers={() => {
                        setCompletedAllWaivers(true)
                      }}
                      onGoBack={() => handleGoBack(order.currentStep, order.steps)}
                    />
                  ))}
                {order.currentStep === 'addPayment' &&
                  (useResetBecauseOfTimeOut ? (
                    <SpinLoader withWrapper="calc(100vh - 91px)" size="80px" color="primary" />
                  ) : (
                    <PaymentsPage
                      canCompleteOrder={canCompleteOrder}
                      order={order}
                      onPaymentAdded={handlePaymentAdded}
                      onGoBack={() => handleGoBack(order.currentStep, order.steps)}
                      payments={usePayments}
                      createdPayments={useCreatedPayments}
                    />
                  ))}
                {/* {order.currentStep === 'posOrderComplete' && <CompletePage />} */}
                <OrderPanelWrapper
                  order={order}
                  updateOrderStep={updateOrderStep}
                  updatingOrderStep={useUpdatingOrderStep}
                  updatingOrder={useUpdatingOrder}
                  orderCompleted={order.currentStep === 'posOrderComplete'}
                  payments={usePayments}
                  completingPayment={useCompletingPayment}
                  canCompleteOrder={canCompleteOrder}
                  newOrder={handleNewOrder}
                  cancelOrder={handleCancelOrder}
                  completeOrder={handleCompleteOrder}
                  addDiscount={() => setAddDiscountModalOpen(true)}
                  removeOrderLineItem={handleRemoveOrderLineItem}
                  removePaymentItem={handleRemovePaymentItem}
                  completedAllWaivers={useCompletedAllWaivers}
                  sale={useSale}
                />
                {order.currentStep === 'addPurchaser' && (
                  <SelectPurchaserModal
                    order={order}
                    client={client}
                    primaryBtnLoading={useUpdatingOrderStep}
                    toastManager={toastManager}
                    purchaserId={usePurchaserId}
                    onPurchaserAdded={purchaser => handlePurchaserAdded(purchaser, order.steps)}
                    onGoBack={() => handleGoBack(order.currentStep, order.steps)}
                    account={account}
                  />
                )}

                {order.currentStep === 'posOrderComplete' && useSale && useSale.id && (
                  <AccessRecordPrintModal client={client} handleCloseModal={handleClosePrintModal} sale={useSale} />
                )}
                {useAddDiscountModalOpen && (
                  <DiscountModal
                    client={client}
                    onCancelBtnHandler={() => setAddDiscountModalOpen(false)}
                    onApplyBtnHandler={onApplyDiscountButtonHandler}
                    onApplyPromoBtnHandler={onApplyPromoCodeButtonHandler}
                    order={order}
                  />
                )}
                {showAssignItemModal && (
                  <AssignItemModal
                    productSelected={useProductSelected}
                    loadingProductModal={useLoadingProductModal}
                    orderId={match.params.orderId}
                    resortEventDateSelected={useResortEventDateSelected}
                    quantitySelected={useQuantitySelected}
                    onProductAdded={handleProductAdded}
                    onCancelClick={handleProductDeSelected}
                    account={useAccountFromRequest}
                  />
                )}
                {!useResortEventProductSelected &&
                  useProductSelected &&
                  useProductSelected.steps.length === 0 &&
                  useProductSelected.upsellProducts.length > 0 &&
                  useQuantitySelected && (
                    <AddUpsellItemModal
                      productSelected={useProductSelected}
                      quantitySelected={useQuantitySelected}
                      onCancelHandler={handleProductDeSelected}
                      onProductAdded={handleProductAdded}
                    />
                  )}
                {useResortEventProductSelected && (
                  <AssignResortEventModal
                    client={client}
                    productSelected={useResortEventProductSelected}
                    onDateQuantitySelected={handleResortEventProductSelected}
                    onCancelClick={handleProductDeSelected}
                  />
                )}
              </DashboardWrapper>
            )
          }}
        </Query>
      )
    }
  )
)
