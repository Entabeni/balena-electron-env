import React from 'react'
import styled from 'styled-components'

// Components
import { Par, Bold } from 'es-components'

const ListItem = styled.ul`
  height: auto;
  width: 100%;
  display: grid;
  box-sizing: border-box;
  grid-template-columns: 1fr 40px 80px;
  list-style: none;

  &:nth-child(odd) {
    background-color: ${props => props.theme.greyLight};
  }

  .list_item,
  .list_qty,
  .list_total {
    padding: 0.5em;
  }

  .list_item {
    padding: 0.5em;
  }

  .list_qty,
  .list_total {
    text-align: right;
  }
`

export const PaymentListItem = ({ payment }) => (
  <ListItem>
    <li className="list_item">
      <Par className="title_item" color="greyBlack" size="0.9rem">
        <Bold>{`Payment - ${payment.name}`}</Bold>
      </Par>
    </li>
    <li className="list_qty">
      <Par className="title_item" color="greyBlack" size="0.9rem">
        &nbsp;
      </Par>
    </li>
    <li className="list_total">
      <Par className="title_item" color="greyBlack" size="0.9rem">
        <Bold>{payment.amount}</Bold>
      </Par>
    </li>
  </ListItem>
)
