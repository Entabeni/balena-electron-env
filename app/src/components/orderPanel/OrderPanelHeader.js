import React, { useContext } from 'react'
import styled from 'styled-components'

// Contexts
import { SiteGlobalContext } from 'es-context'

// Components
import { Bold, CountDownTimer, Par } from 'es-components'

const Header = styled.header`
  height: 60px;
  background-color: ${props => props.theme.white};
  display: flex;
  flex-direction: column;
  padding: 0;
  position: realtive;
  border: 1px solid ${props => props.theme.grey};
`

const OrderNumberSection = styled.section`
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 2px 1em 0;
  border-bottom: 1px solid ${props => props.theme.grey};
`

const OrderTitleSection = styled.section`
  height: 20px;
  width: 100%;
  display: grid;
  box-sizing: border-box;
  grid-template-columns: 1fr 40px 80px 80px 20px;
  align-items: center;

  .title_item {
    padding: 2px 0.5em 0;
  }

  .title_qty,
  .title_price,
  .title_total,
  .title_delete {
    padding: 2px 0.45em 0;
    text-align: right;
  }
`

export function OrderPanelHeader({ orderNumber, saleNumber, updateOrder }) {
  const { hasTimeOut: orderHasTimeOut, orderID, timeOutDate } = useContext(SiteGlobalContext)
  return (
    <Header>
      <OrderNumberSection>
        {orderHasTimeOut && (
          <CountDownTimer
            customTimeUpMssg="We're sorry but the time for this reservation is up"
            onTimeOut={() => updateOrder(undefined, { reset: true })}
            timeOut={timeOutDate}
            timerID={orderID}
            timerMssg="Items reserved for"
            timerType="ORDER"
          />
        )}
        <Par id="currentOrderNumber" color="greyBlack" size="0.9rem">
          <Bold bolder color="primary">
            {saleNumber ? 'SALE' : 'ORDER'}
          </Bold>{' '}
          {saleNumber ? saleNumber.toString().padStart(10, '0') : orderNumber.toString().padStart(10, '0')}
        </Par>
      </OrderNumberSection>
      <OrderTitleSection>
        <Par className="title_item" color="greyBlack" size="0.9rem">
          Item
        </Par>
        <Par className="title_qty" color="greyBlack" size="0.9rem">
          Qty
        </Par>
        <Par className="title_price" color="greyBlack" size="0.9rem">
          Price
        </Par>
        <Par className="title_total" color="greyBlack" size="0.9rem">
          Subtotal
        </Par>
        <Par className="title_delete" color="greyBlack" size="0.9rem">
          &nbsp;
        </Par>
      </OrderTitleSection>
    </Header>
  )
}
