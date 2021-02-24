import React from 'react'
import styled from 'styled-components'

import { Button, ProductModal, BasicForm } from 'es-components'
import { SplitPaymentRow } from './SplitPaymentRow'
import { formatCurrency } from 'es-libs'

const OutstandingAmount = styled.article`
  position: absolute;
  bottom: 2%;
  right: 2%;
  font-weight: 500;
  font-size: 20px;
`

export class SplitPaymentsModal extends React.Component {
  state = {
    continueBtnDisabled: true,
    totalSumm: 0,
    payments: [],
    splitPaymentRowsCount: 1,
    filteredPaymentOptions: null
  }

  componentWillMount() {
    if (!this.state.filteredPaymentOptions) {
      this.setState({ filteredPaymentOptions: this.props.paymentOptions })
    }
  }

  handleFormValueChange = values => {
    const { orderAmount } = this.props
    const { splitPaymentRowsCount } = this.state
    let continueBtnDisabled = true
    let payments = []
    let totalSumm = 0
    this.setState({ filteredPaymentOptions: this.props.paymentOptions })
    for (let i = 1; i <= splitPaymentRowsCount; i++) {
      const paymentMethod = values[`paymentType-${i}`]
      const amount = values[`summ-${i}`]
      if (paymentMethod != null && amount != null) {
        const id = paymentMethod.value
        const name = paymentMethod.label
        const type = paymentMethod.type
        totalSumm += +amount
        payments.push({ id, name, amount, type, paymentType: type })
      }
    }

    const outstanding = orderAmount - totalSumm
    if (outstanding === 0) {
      continueBtnDisabled = false
    }

    this.setState({ totalSumm, continueBtnDisabled, payments })
  }

  renderSplitPaymentRows = filteredPaymentOptions => {
    const { splitPaymentRowsCount } = this.state
    let rows = []
    for (let i = 1; i <= splitPaymentRowsCount; i++) {
      rows.push(<SplitPaymentRow key={`splitPaymentRow-${i}`} filteredPaymentOptions={filteredPaymentOptions} counter={i} />)
    }

    return rows
  }

  onAddNewPayment = () => {
    const { splitPaymentRowsCount } = this.state
    this.setState({ splitPaymentRowsCount: splitPaymentRowsCount + 1 })
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
    const { orderAmount } = this.props
    const { continueBtnDisabled, filteredPaymentOptions, totalSumm } = this.state
    const outstandingAmount = formatCurrency(orderAmount - totalSumm)

    return (
      <ProductModal
        title="Split Payment"
        subTitle="Apply the payment over multiple methods."
        primaryBtnTitle="Continue"
        lightLayout
        primaryBtnDisabled={continueBtnDisabled}
        onPrimaryBtnHandler={this.handleContinueClick}
        onCancelHandler={this.onCancelClick}>
        <BasicForm height="90%" light onValueChange={this.handleFormValueChange}>
          {this.renderSplitPaymentRows(filteredPaymentOptions)}
          <Button title="Add another payment" kind="primary" onClickHandler={this.onAddNewPayment} />
          <OutstandingAmount>
            <div>Amount outstanding: {outstandingAmount}</div>
          </OutstandingAmount>
        </BasicForm>
      </ProductModal>
    )
  }
}
