import React, { useEffect, useContext } from 'react'
import styled, { css } from 'styled-components'
import { Prompt } from 'react-router-dom'

// Components
import { SpinLoader } from 'es-components'
import { OrderPanelHeader } from './OrderPanelHeader'
import { OrderPanelFooter } from './OrderPanelFooter'
import { OrderPaymentHeader } from './OrderPaymentHeader'
import { OrderPanelButtons } from './OrderPanelButtons'
import { OrderListItem } from './orderList/OrderListItem'
import { PaymentListItem } from './paymentList/PaymentListItem'
import { DiscountListItem } from './discountList/DiscountListItem'

// Context
import { SiteGlobalContext } from 'es-context'
// Interceptor globals
import { interceptorGlobalKeyNames } from '../modal/beforeLeavingInterceptor'
// Safe key name for storing the interceptor modal methods in a 'private' global value
const interceptorOrderCompleteGKN = interceptorGlobalKeyNames.orderComplete
const interceptorCashOutGKN = interceptorGlobalKeyNames.cashOut
const interceptorCashOutMethodGKN = interceptorGlobalKeyNames.cashOutMethod
const interceptorLogOutGKN = interceptorGlobalKeyNames.logOut
const interceptorLogOutMethodGKN = interceptorGlobalKeyNames.logOutMethod
const interceptorLogOutTriggerFlagGKN = interceptorGlobalKeyNames.logOutTriggerFlag

const OrderWrapper = styled.div`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 60px 1fr 105px 60px;
  ${props => props.noControls && 'height: 560px;'}
  margin: 0;
  ${props => !props.noControls && 'max-height: 100%;'}
  ${props => !props.noControls && 'min-height: 100%;'}
  overflow-y: ${props => (props.noControls ? 'none' : 'scroll')};
  padding: ${props => (props.noControls ? '60px 0 160px 0' : '0')};
  position: relative;
  width: calc(100% - 0.5em);

  &.with-payments {
    grid-template-rows: 60px 1fr 22px auto 105px 60px;

    &.multiple-payments {
      grid-template-rows: 60px 1fr 22px 0.5fr 105px 60px;
    }
  }

  .order-panel-spin-loader {
    background-color: rgba(255, 255, 255, 0.65);
    position: absolute;
    top: 0;
  }
`

const sharedSectionStyling = css`
  margin: 0;
  height: auto;
  width: 100%;
  display: block;
  background-color: ${props => props.theme.white};
  overflow-y: scroll;
  border-right: 1px solid ${props => props.theme.grey};
  border-left: 1px solid ${props => props.theme.grey};
`

const OrderSection = styled.div`
  ${sharedSectionStyling}
`

const PaymentSection = styled.div`
  ${sharedSectionStyling}
`

export const OrderPanelWrapper = ({
  order,
  sale,
  updateOrderStep,
  updatingOrderStep,
  updatingOrder,
  completingPayment,
  payments = [],
  newOrder,
  cancelOrder,
  canCompleteOrder,
  orderCompleted,
  completeOrder,
  addDiscount,
  removeOrderLineItem,
  removePaymentItem,
  completedAllWaivers,
  noControls
}) => {
  let outstandingSumm = order.total
  payments.forEach(payment => {
    outstandingSumm -= payment.amount
  })

  const paymentOutstanding = { name: 'Outstanding', amount: outstandingSumm }

  // Accessing the App's global shared context
  const { askBeforeLeaving, setAskBeforeLeaving } = useContext(SiteGlobalContext)

  // Updating the leaving modal flag according to order's status
  if (!canCompleteOrder) {
    setAskBeforeLeaving(false)
    delete window[interceptorOrderCompleteGKN]
    delete window[interceptorCashOutGKN]
    delete window[interceptorCashOutMethodGKN]
    delete window[interceptorLogOutGKN]
    delete window[interceptorLogOutMethodGKN]
  } else {
    setAskBeforeLeaving(true)
    // Creating a global store for sharing the interceptor modal methods for this specific order incomplete use case across the app
    window[interceptorOrderCompleteGKN] = {
      accept: () => {
        // This handler will be triggered upon the continue action on the info modal
        // Setting back the control flag to falsy in order to prevent the modal showing up
        setAskBeforeLeaving(false)
        // Handling the eventual cash out button click (given it is not being scoped due to not being a redirection)
        if (window[interceptorCashOutGKN]) {
          window[interceptorCashOutGKN] = false
          window[interceptorCashOutMethodGKN]()
        }
        // Handling the eventual logout button click (given it is not being scoped due to not being a redirection)
        if (window[interceptorLogOutGKN]) {
          canCompleteOrder = false
          window[interceptorLogOutGKN] = false
          window[interceptorLogOutTriggerFlagGKN] = true
          window[interceptorLogOutMethodGKN]()
        }
      },
      decline: () => {
        // Handling the eventual cash out button click (given it is not being scoped due to not being a redirection)
        if (window[interceptorCashOutGKN] !== undefined) {
          delete window[interceptorCashOutGKN]
          delete window[interceptorCashOutMethodGKN]
        }
        // Handling the eventual logout button click (given it is not being scoped due to not being a redirection)
        if (window[interceptorLogOutGKN] !== undefined) {
          delete window[interceptorLogOutGKN]
          delete window[interceptorLogOutMethodGKN]
        }
      }
    }
  }

  // Interceptor modal's basic custom config info
  const configStr = {
    customButtons: {
      accept: {
        callback: interceptorOrderCompleteGKN
      },
      decline: {
        callback: interceptorOrderCompleteGKN
      }
    },
    customTitle: 'Order Process Incomplete'
  }

  // Applying control flags updates during component's mounting & unmounting lifecycle
  useEffect(() => {
    // Upon unmounting component cleaning up the created globals and resetting the control flags to their default values
    return () => {
      canCompleteOrder = false
      setAskBeforeLeaving(false)
      delete window[interceptorOrderCompleteGKN]
      delete window[interceptorCashOutGKN]
      delete window[interceptorCashOutMethodGKN]
      delete window[interceptorLogOutGKN]
      delete window[interceptorLogOutMethodGKN]
      delete window[interceptorLogOutTriggerFlagGKN]
    }
  }, [])
  // console.log(order)
  return (
    <OrderWrapper className={payments.length ? `with-payments${payments.length > 2 ? ' multiple-payments' : ''}` : ''} noControls={noControls}>
      <OrderPanelHeader updateOrder={updateOrderStep} orderId={order.id} orderNumber={order.number} saleNumber={sale.number} />
      <OrderSection>
        {order.orderLineItems.map((orderLineItem, index) => {
          let discounts = orderLineItem.orderDiscountLineItems
          if (discounts.length > 0) {
            return (
              <div key={orderLineItem.id}>
                <OrderListItem noControls={noControls} id={`itemInOrder_${index}`} orderLineItem={orderLineItem} removeOrderLineItem={removeOrderLineItem} />
                {orderLineItem.upsellOrderLineItems.map((upsellOrderItem, upsellIndex) => {
                  return (
                    <OrderListItem
                      id={`upsellItemInOrder_${upsellIndex}`}
                      key={upsellOrderItem.id}
                      orderLineItem={upsellOrderItem}
                      removeOrderLineItem={removeOrderLineItem}
                      noControls={noControls}
                    />
                  )
                })}
                <DiscountListItem discountItem={discounts[0]} />
              </div>
            )
          }
          return (
            <div key={orderLineItem.id}>
              <OrderListItem noControls={noControls} id={`itemInOrder_${index}`} orderLineItem={orderLineItem} removeOrderLineItem={removeOrderLineItem} />
              {orderLineItem.upsellOrderLineItems.map((upsellOrderItem, upsellIndex) => {
                return (
                  <OrderListItem
                    noControls={noControls}
                    id={`upsellItemInOrder_${upsellIndex}`}
                    key={upsellOrderItem.id}
                    orderLineItem={upsellOrderItem}
                    removeOrderLineItem={removeOrderLineItem}
                  />
                )
              })}
            </div>
          )
        })}
      </OrderSection>
      {payments.length > 0 && (
        <>
          <OrderPaymentHeader />
          <PaymentSection>
            {payments.map((payment, index) => (
              <PaymentListItem key={payment.id + '-' + index} payment={payment} removePaymentItem={removePaymentItem} />
            ))}
            <PaymentListItem key="oustanding" payment={paymentOutstanding} />
          </PaymentSection>
        </>
      )}
      <OrderPanelFooter
        noControls={noControls}
        subTotal={order.subTotal}
        shippingOptionPrice={order.shippingOptionPrice}
        taxTotal={order.taxTotal}
        total={order.total}
      />
      {!noControls && (
        <OrderPanelButtons
          currentStep={order.currentStep}
          updateOrderStep={updateOrderStep}
          updatingOrderStep={updatingOrderStep}
          purchaserButtonDisabled={!order.orderLineItems.length || updatingOrder}
          completingPayment={completingPayment}
          completedAllWaivers={completedAllWaivers}
          newOrder={newOrder}
          orderCompleted={orderCompleted}
          addDiscount={addDiscount}
          cancelOrder={cancelOrder}
          canCompleteOrder={canCompleteOrder}
          completeOrder={completeOrder}
        />
      )}
      {(updatingOrder || updatingOrderStep) && <SpinLoader withWrapper wrapperClass="order-panel-spin-loader" size="80px" color="primary" />}
      <Prompt when={canCompleteOrder && !window[interceptorLogOutTriggerFlagGKN]} message={JSON.stringify(configStr)} />
    </OrderWrapper>
  )
}
