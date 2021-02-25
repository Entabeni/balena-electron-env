import React from 'react'
import styled from 'styled-components'

const ListItem = styled.div`
  height: auto;
  width: 100%;
  min-width: 350px;
  display: grid;
  align-content: center;
  box-sizing: border-box;
  grid-template-columns: 2fr 7fr 3fr;
  list-style: none;
  background-color: ${props => props.theme.primaryShade};
  border: 1px solid;
  border-color: ${props => props.theme.white};
  opacity: ${props => (props.disable ? '0.5' : '1')};
  border-radius: 6px;
  color: white;
  margin-top: 5px;
  text-align: center;

  .list_name {
    text-align: left;
    padding-top: 14px;
    padding-left: 10px;
  }

  .list_select {
    pointer-events: ${props => (props.disable ? 'none' : '')};
    padding-top: 14px;
    height: 50px;
    cursor: pointer;
    border-radius: 0 4px 4px 0;
    background-color: ${props => props.theme.secondary};
    border-color: ${props => props.theme.secondary};
  }

  .list_value {
    padding-top: 8px;
    font-size: 22px;
    font-weight: 700;
    border-right: 1px solid;
    border-color: white;
    p {
      font-size: 9px;
    }
  }
`

export class DiscountItem extends React.Component {
  onDiscountSelect = () => {
    const { onDiscountSelect, discountItem } = this.props
    if (onDiscountSelect) {
      onDiscountSelect(discountItem)
    }
  }

  render() {
    const { discountItem, selectedDiscount, index } = this.props
    const showPercentage = discountItem.discountType === 'percentage' ? '%' : ''
    const showFlat = discountItem.discountType === 'flat'
    let disable = false
    if (selectedDiscount) {
      disable = selectedDiscount.id !== discountItem.id
    }
    return (
      <ListItem disable={disable} id={`discount_${index}`}>
        <div className="list_value">
          {discountItem.discountValue + showPercentage}
          {showFlat && <p>FLAT</p>}
        </div>
        <div className="list_name">{discountItem.name}</div>
        <div className="list_select" onClick={this.onDiscountSelect}>
          Select
        </div>
      </ListItem>
    )
  }
}
