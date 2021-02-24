import React from 'react'
import styled from 'styled-components'
import { TextInput } from 'es-components'

import { Button, ProductModal, BasicForm } from 'es-components'
import { formatCurrency } from 'es-libs'

const BottomText = styled.article`
  position: relative;
  bottom: 2%;
  left: 0;
  font-weight: 500;
  font-size: 20px;
`
const SplitPaymentRowWrapper = styled.article`
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 1em;

  & input {
    padding-top: 0;
  }
`

const CashPayment = () => {
  return (
    <SplitPaymentRowWrapper>
      <TextInput pattern="[0-9*]" type="number" id={`summ`} field={`summ`} placeholder="Enter an amount" autoComplete="off" />
    </SplitPaymentRowWrapper>
  )
}

export class CashChangeModal extends React.Component {
  state = {
    continueBtnDisabled: true,
    totalSumm: 0,
    payments: []
  }

  handleFormValueChange = values => {
    const { paymentType, outstandingSumm } = this.props
    const orderAmount = outstandingSumm ? outstandingSumm : paymentType.amount
    let continueBtnDisabled = true
    let payments = []
    let totalSumm = 0

    const amount = values[`summ`]
    if (amount != null) {
      totalSumm += +amount
      const id = paymentType.id
      const name = paymentType.name
      payments.push({ id, name, amount: orderAmount })
    }

    const outstanding = Math.abs(orderAmount) - Math.abs(totalSumm)
    if (outstanding <= 0) {
      continueBtnDisabled = false
    }

    this.setState({ totalSumm, continueBtnDisabled, payments })
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
    const { paymentType, outstandingSumm } = this.props
    const orderAmount = paymentType.amount
    const { continueBtnDisabled, totalSumm } = this.state
    const change = Math.abs(totalSumm) - Math.abs(orderAmount)

    return (
      <ProductModal
        title="Cash Payment"
        lightLayout
        subTitle="Please input payment greater or equal to order amount"
        primaryBtnTitle="Continue"
        primaryBtnDisabled={continueBtnDisabled}
        onPrimaryBtnHandler={this.handleContinueClick}
        onCancelHandler={this.onCancelClick}>
        <BasicForm height="80%" light onValueChange={this.handleFormValueChange}>
          <CashPayment />
          <BottomText>
            {change >= 0 ? <div>Change: {formatCurrency(change)}</div> : <div>Change: N/A</div>}
            <div>
              <div>
                {outstandingSumm ? 'Outstanding' : 'Order'} Amount: {formatCurrency(outstandingSumm ? outstandingSumm : orderAmount)}
              </div>
            </div>
          </BottomText>
        </BasicForm>
      </ProductModal>
    )
  }
}
