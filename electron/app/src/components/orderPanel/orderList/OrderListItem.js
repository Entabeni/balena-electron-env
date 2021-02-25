import React, { Fragment } from 'react'
import styled from 'styled-components'
import { FaTrashAlt } from 'react-icons/fa'

// Components
import { Par } from 'es-components'
import { formatCurrency } from 'es-libs'

const ListItem = styled.ul`
  height: auto;
  width: 100%;
  display: grid;
  box-sizing: border-box;
  grid-template-columns: 1fr 40px 80px 80px 20px;
  list-style: none;

  &:nth-child(odd) {
    background-color: ${props => props.theme.greyLight};
  }

  .list_item,
  .list_qty,
  .list_price,
  .list_subtotal {
    padding: 0.5em;
  }

  .list_item {
    padding: 0.5em;
  }

  .list_qty,
  .list_price,
  .list_subtotal,
  .list_delete {
    text-align: right;
  }

  .list_delete {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
`

export const OrderListItem = ({ orderLineItem, removeOrderLineItem, id, noControls = false, isUpsell = false }) => (
  <ListItem id={id}>
    <li className="list_item">
      <Par className="title_item" color="greyBlack" size="0.9rem">
        {orderLineItem.name}
      </Par>
    </li>
    <li className="list_qty">
      <Par className="title_item" color="greyBlack" size="0.9rem">
        {orderLineItem.quantity}
      </Par>
    </li>
    <li className="list_price">
      <Par className="title_item" color="greyBlack" size="0.9rem">
        {formatCurrency(orderLineItem.price)}
      </Par>
    </li>
    <li className="list_subtotal">
      <Par className="title_item" color="greyBlack" size="0.9rem">
        {formatCurrency(orderLineItem.subTotal)}
      </Par>
    </li>
    <li className="list_delete" onClick={() => !noControls && removeOrderLineItem && removeOrderLineItem(orderLineItem.id)}>
      <Par className="title_item" color="greyBlack" size="1.2rem">
        {!noControls && <FaTrashAlt />}
      </Par>
    </li>
    {(!isUpsell || (orderLineItem.productAddOn && orderLineItem.productAddOn.requireGuest)) &&
    orderLineItem.guestLineItems &&
    orderLineItem.guestLineItems.length
      ? orderLineItem.guestLineItems.map(guestLineItem => (
          <Fragment key={guestLineItem.id}>
            <li className="list_item">
              <Par className="title_item" color="greyBlack" size="0.9rem">
                &nbsp;&nbsp;{guestLineItem.guest ? `${guestLineItem.guest.firstName} ${guestLineItem.guest.lastName}` : ''}
              </Par>
            </li>
            <li className="list_qty">&nbsp;</li>
            <li className="list_price">&nbsp;</li>
            <li className="list_subtotal">&nbsp;</li>
            <li className="list_delete">&nbsp;</li>
          </Fragment>
        ))
      : null}
  </ListItem>
)
