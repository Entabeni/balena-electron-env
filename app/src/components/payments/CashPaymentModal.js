import React from 'react'
import styled from 'styled-components'

import { Button, ProductModal, BasicForm } from 'es-components'
import { formatCurrency } from 'es-libs'
import { CashPaymentRow } from './CashPaymentRow'

const OutstandingAmount = styled.article`
  position: absolute;
  bottom: 2%;
  right: 2%;
  font-weight: 500;
  font-size: 20px;
`

export class CashPaymentModal extends React.Component {
  state = {
    continueBtnDisabled: true,
    totalSumm: 0,
    payments: [],
    cashRowsCount: 1
  }

  handleFormValueChange = values => {
    const { paymentType } = this.props
    const orderAmount = paymentType.amount
    const { cashRowsCount } = this.state
    let continueBtnDisabled = true
    let payments = []
    let totalSumm = 0

    for (let i = 1; i <= cashRowsCount; i++) {
      const amount = values[`summ-${i}`]
      if (amount != null) {
        totalSumm += +amount
        const id = paymentType.id
        const name = paymentType.name
        payments.push({ id, name, amount })
      }
    }

    const outstanding = orderAmount - totalSumm
    if (outstanding === 0) {
      continueBtnDisabled = false
    }

    this.setState({ totalSumm, continueBtnDisabled, payments })
  }

  renderCashPaymentRows = () => {
    const { cashRowsCount } = this.state
    let rows = []
    for (let i = 1; i <= cashRowsCount; i++) {
      rows.push(<CashPaymentRow key={`cashPaymentRow-${i}`} counter={i} />)
    }

    return rows
  }

  onAddNewPayment = () => {
    const { cashRowsCount } = this.state
    this.setState({ cashRowsCount: cashRowsCount + 1 })
  }

  handleContinueClick = () => {
    const { payments } = this.state
    const { onContinueClick } = this.props

    if (onContinueClick) {
      onContinueClick(payments)
    }
  }

  onCancelClick = () => {
    const { onCancelClick } = this.props

    if (onCancelClick) {
      onCancelClick()
    }
  }

  render() {
    const { paymentType } = this.props
    const orderAmount = paymentType.amount
    const { continueBtnDisabled, totalSumm } = this.state
    const outstandingAmount = formatCurrency(orderAmount - totalSumm)

    return (
      <ProductModal
        title="Cash Payment"
        subTitle="Apply the payment over multiple cash methods."
        primaryBtnTitle="Continue"
        primaryBtnDisabled={continueBtnDisabled}
        onPrimaryBtnHandler={this.handleContinueClick}
        onCancelHandler={this.onCancelClick}>
        <BasicForm height="90%" light onValueChange={this.handleFormValueChange}>
          {this.renderCashPaymentRows()}
          <Button title="Add another payment" kind="primary" onClickHandler={this.onAddNewPayment} />
          <OutstandingAmount>
            <div>Amount outstanding: {outstandingAmount}</div>
          </OutstandingAmount>
        </BasicForm>
      </ProductModal>
    )
  }
}
