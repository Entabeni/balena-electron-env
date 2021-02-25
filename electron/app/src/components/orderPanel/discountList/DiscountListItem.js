import React from 'react'
import styled from 'styled-components'

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
  .list_total {
    padding: 0.5em;
  }

  .list_item {
    padding: 0.5em;
  }

  .list_qty,
  .list_price,
  .list_total,
  .list_delete {
    text-align: right;
  }
`

export const DiscountListItem = ({ discountItem }) => (
  <ListItem>
    <li className="list_item">
      <Par className="title_item" color="greyBlack" size="0.9rem">
        {discountItem.name}
      </Par>
    </li>
    <li className="list_qty">
      <Par className="title_item" color="greyBlack" size="0.9rem">
        1
      </Par>
    </li>
    <li className="list_price">
      <Par className="title_item" color="greyBlack" size="0.9rem">
        {formatCurrency(discountItem.price)}
      </Par>
    </li>
    <li className="list_total">
      <Par className="title_item" color="greyBlack" size="0.9rem">
        {formatCurrency(-1 * discountItem.subTotal)}
      </Par>
    </li>
    <li className="list_delete">&nbsp;</li>
  </ListItem>
)
