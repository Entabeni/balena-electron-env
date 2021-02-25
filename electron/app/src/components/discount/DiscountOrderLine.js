import React from 'react'
import styled from 'styled-components'
import { FaTrashAlt } from 'react-icons/fa'

import { formatCurrency } from 'es-libs'

const DiscountRowItem = styled.div`
  height: 35px;
  width: 100%;
  display: grid;
  align-content: center;
  box-sizing: border-box;
  grid-template-columns: ${props => (props.layout === 'promo' ? '5fr 1fr 1fr 1fr 2fr 1fr' : '4fr 1fr 1fr 1fr 1fr')};
  list-style: none;
  text-align: center;
  background-color: ${props => props.theme.grey};

  div {
    padding: 0.5em;
  }

  .discount-name {
    text-align: left;
  }

  .remove-link {
    cursor: pointer;
    text-decoration: underline;
  }

  .number-col {
    margin-left: -10px;
  }
`

export class DiscountOrderLine extends React.Component {
  onRemoveDiscount = () => {
    const { orderLineItem, onRemoveDiscount } = this.props
    if (onRemoveDiscount) {
      onRemoveDiscount(orderLineItem.id)
    }
  }

  render() {
    const { discountItem, orderLineItem, existingDiscount, checkedRows, layout, index } = this.props
    let name, quantity, summ, totalSumm
    const checked = checkedRows.indexOf(orderLineItem.id) !== -1

    if (discountItem && checked) {
      name = discountItem.name
      quantity = orderLineItem.quantity
      summ =
        discountItem.discountType === 'percentage'
          ? Math.round(orderLineItem.price * (discountItem.discountValue / 100) * 100) / 100
          : discountItem.discountValue
      totalSumm = summ * orderLineItem.quantity
    } else {
      name = existingDiscount.name
      quantity = existingDiscount.quantity
      summ = existingDiscount.price
      totalSumm = existingDiscount.total
    }

    if (layout === 'promo') {
      return (
        <DiscountRowItem layout="promo">
          <div className="discount-name">{name}</div>
          <div className="number-col">{quantity}</div>
          <div className="number-col">{formatCurrency(summ)}</div>
          <div className="number-col">{formatCurrency(totalSumm)}</div>
          <div className="number-col">&nbsp;</div>
          <div id={`deleteDiscountButton_${index}`} className="remove-link" onClick={this.onRemoveDiscount}>
            <FaTrashAlt />
          </div>
        </DiscountRowItem>
      )
    }

    return (
      <DiscountRowItem>
        <div className="discount-name">{name}</div>
        <div className="remove-link" onClick={this.onRemoveDiscount}>
          <FaTrashAlt />
        </div>
        <div className="number-col">{quantity}</div>
        <div className="number-col">{formatCurrency(summ)}</div>
        <div className="number-col">{formatCurrency(totalSumm)}</div>
      </DiscountRowItem>
    )
  }
}
