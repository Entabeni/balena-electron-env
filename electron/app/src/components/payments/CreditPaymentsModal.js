import React, { Component } from 'react'

// elements
import { ProductModal } from 'es-components'
import styled from 'styled-components'

const PaymentWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -300px;
  margin-top: -250px;
  width: 600px;
  height: 300px;
`

export class CreditPaymentsModal extends Component {
  componentDidMount() {
    const { paymentAmount } = this.props
    // console.log(document.getElementById('ets'))
    // console.log(window)
    window.$('#ets').hp({
      promptForAvs: true,
      // promptForAvs    bool    Specifies whether or not the form asks for billing information. This includes billing address, zip, city and state.
      // saveCustomer: true,
      // saveCustomer    bool    When set to true, the plugin will tokenize the provided payment instrument.
      // Note * - This option is not yet available for Hosted Transvault (the Cloud Terminal feature).
      successCallback: this.handlePaymentSuccess,
      errorCallback: this.handlePaymentError
    })
    setTimeout(() => {
      const amount = parseFloat(Math.abs(paymentAmount)).toFixed(2)
      const apiKey = 'ECCE8B67-FC5B-4544-9FD8-BCCE4D1AC91D'
      const paymentType = paymentAmount < 0 ? 'REFUND' : 'CHARGE'
      const terminalId = '1001'
      const correlationId = ''

      window.hp.Utils.reset({
        amount,
        apiKey,
        paymentType,
        terminalId,
        correlationId
      })
    }, 1000)
  }

  onCancelClick = () => {
    const { onCancelClick } = this.props

    if (onCancelClick) {
      onCancelClick()
    }
  }

  handlePaymentSuccess = response => {
    const { onAddCreditPayments, paymentType, paymentAmount } = this.props
    // console.log(response, paymentType)
    onAddCreditPayments({ id: paymentType.id, name: paymentType.name, amount: paymentAmount }, response)
  }

  handlePaymentError = response => {
    console.error(response)
    if (response.status === 'Error' && response.message === 'Transaction cancelled.') {
      this.onCancelClick()
    }
  }

  render() {
    return (
      <ProductModal title="Credit Payment" onCancelHandler={this.onCancelClick}>
        <PaymentWrapper>
          <div
            id="ets"
            data-ets-key=""
            data-amount="10.00"
            data-allow-avs-skip="true"
            data-payment-type-order="3, 0, 1, 2"
            data-terminal-id=""
            data-payment-type="charge"
            data-avs-street=""
            data-avs-zip=""
            data-correlation-id=""
            prompt-for-avs="true"
          />
        </PaymentWrapper>
      </ProductModal>
    )
  }
}
