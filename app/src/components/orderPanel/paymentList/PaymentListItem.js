import React from 'react'
import styled from 'styled-components'

// Components
import { Par, Bold } from 'es-components'
import { formatCurrency } from 'es-libs'
import { FaTrashAlt } from 'react-icons/fa'

const ListItem = styled.ul`
  height: auto;
  width: 100%;
  display: grid;
  box-sizing: border-box;
  grid-template-columns: 1fr 75px 20px;
  list-style: none;

  &:nth-child(odd) {
    background-color: ${props => props.theme.greyLight};
  }

  .list_item,
  .list_total {
    padding: 0.5em;
  }

  .list_total {
    text-align: right;
  }

  .list_delete {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
`

export const PaymentListItem = ({ payment, removePaymentItem }) => {
  return (
    <ListItem>
      <li className="list_item">
        <Par className="title_item" color="greyBlack" size="0.9rem">
          <Bold>{payment.name}</Bold>
        </Par>
      </li>
      <li className="list_total">
        <Par className="title_item" color="greyBlack" size="0.9rem">
          <Bold>{formatCurrency(parseFloat(payment.amount))}</Bold>
        </Par>
      </li>
      {removePaymentItem && payment.paymentType !== 'intergratedCreditCard' && !payment.previousPayment && (
        <li className="list_delete" onClick={() => payment.paymentType !== 'intergratedCreditCard' && removePaymentItem && removePaymentItem(payment.id)}>
          <Par className="title_item" color="greyBlack" size="1.2rem">
            <FaTrashAlt />
          </Par>
        </li>
      )}
    </ListItem>
  )
}
