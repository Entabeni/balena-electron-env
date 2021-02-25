import React from 'react'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'

import {
  MainPanelWrapper,
  H4,
  Par,
  Button,
  SpinLoader,
  SplitPaymentsModal,
  CreditPaymentsModal,
  CashPaymentModal,
  CashChangeModal,
  IntegratedCreditPaymentsModal
} from 'es-components'

const GET_PAYMENT_TYPES_QUERY = gql`
  query GetPaymentTypes {
    pos {
      allPaymentTypes {
        id
        name
        enabled
        creditCard
        paymentType
      }
    }
  }
`

const PaymentsWrapper = styled.article`
  margin: 0;
  padding: 0 0.5em 0.5em 0.5em;
`

const ListWrapper = styled.article`
  margin: 0;
  padding: 0.5em 0 0.5em 0.5em;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
`

export class PaymentsPage extends React.Component {
  state = {
    splitPaymentModalOpen: false,
    creditCardPayModalOpen: false,
    cashPaymentModalOpen: false,
    creditPaymentType: null,
    localSinglePaymentId: null,
    integratedCreditCardModalOpen: false,
    splitPayments: null,
    intergratedCreditCardRequestOpen: false
  }

  toggleSplitPaymentsModal = () => {
    this.setState({ splitPaymentModalOpen: !this.state.splitPaymentModalOpen })
  }

  toggleCashPaymentsModal = () => {
    this.setState({ cashPaymentModalOpen: !this.state.cashPaymentModalOpen })
  }

  toggleCashChangeModal = () => {
    this.setState({ cashChangeModalOpen: !this.state.cashChangeModalOpen })
  }

  toggleCreditCardPayModal = () => {
    this.setState({ creditCardPayModalOpen: !this.state.creditCardPayModalOpen })
  }

  setIntegratedCreditCardRequestOpen = isCancelled => {
    this.setState({ intergratedCreditCardRequestOpen: isCancelled })
  }

  toggleIntegratedCreditCardPayModal = () => {
    this.setState({ integratedCreditCardModalOpen: !this.state.integratedCreditCardModalOpen })
  }

  toggleSplitPaymentIntegratedCreditCardPayModal = intergratedPayments => {
    const createdPayments = this.props.createdPayments
    let integratedPaymentsWithPaymentIds = intergratedPayments.map(t1 => ({ ...t1, ...createdPayments.find(t2 => t2.id === t1.id) }))
    this.setState({
      integratedCreditCardModalOpen: !this.state.integratedCreditCardModalOpen,
      splitPayments: integratedPaymentsWithPaymentIds ? integratedPaymentsWithPaymentIds : null
    })
  }
  toggleSplitPaymentCashChangeModal = cashPayment => {
    this.setState({
      cashChangeModalOpen: !this.state.cashChangeModalOpen,
      cashPayment: cashPayment ? cashPayment : null
    })
  }

  addCreditPaymentsHandler = (payments, response) => {
    // check response status
    const { onPaymentAdded } = this.props
    if (onPaymentAdded) {
      onPaymentAdded(payments, null, 'card')
    }
    this.toggleCreditCardPayModal()
  }

  setSplitPayments = newMultiplePaynents => {
    this.setState({ splitPayments: newMultiplePaynents, localSinglePaymentId: newMultiplePaynents[0].paymentId })
  }

  addIntegratedCreditPaymentsHandler = (payments, response, cardData) => {
    // check response status
    const { cashPayments } = this.state
    const { onPaymentAdded } = this.props
    if (onPaymentAdded) {
      onPaymentAdded(payments, cardData, 'card')
    }
    this.setState({ cashPaymentModalOpen: cashPayments, integratedCreditCardModalOpen: false, splitPayments: null })

    this.toggleIntegratedCreditCardPayModal()
  }

  addCashPaymentHandler = payments => {
    const { onPaymentAdded } = this.props
    this.setState({ cashPayments: null })
    if (onPaymentAdded) {
      onPaymentAdded(payments, null, 'cash')
    }
    this.toggleCashPaymentsModal()
  }

  addCashChangeHandler = payments => {
    const { onPaymentAdded } = this.props
    this.setState({ cashPayments: null })
    if (onPaymentAdded) {
      onPaymentAdded(payments, null, 'cash')
    }
    this.toggleCashChangeModal()
  }

  loopCardModalPayments = intergratedPayments => {
    this.toggleSplitPaymentIntegratedCreditCardPayModal(intergratedPayments)
  }

  loopCashModalPayments = cashPayment => {
    this.toggleSplitPaymentCashChangeModal(cashPayment)
  }

  splitPaymentModalHandler = payments => {
    const intergratedPayments = payments.filter(payment => payment.paymentType === 'intergratedCreditCard')
    intergratedPayments.length && this.loopCardModalPayments(intergratedPayments)
    const cashPayment = payments.find(payment => payment.type === 'cash')
    cashPayment && this.loopCashModalPayments(cashPayment)
    const { onPaymentAdded } = this.props
    if (onPaymentAdded) {
      const filteredPayments = payments.filter(payment => {
        return payment.type !== 'intergratedCreditCard' && payment.type !== 'cash'
      })
      filteredPayments.length && onPaymentAdded(filteredPayments)
    }
    this.toggleSplitPaymentsModal()
  }

  paymentButtonHandler = (paymentType, order) => {
    const { payments } = this.props

    let outstandingSumm = order.total
    payments.forEach(payment => {
      outstandingSumm -= payment.amount
    })
    const { onPaymentAdded } = this.props
    if (paymentType.creditCard && paymentType.paymentType === 'intergratedCreditCard') {
      this.setState({ integratedCreditCardModalOpen: true, creditPaymentType: paymentType })
    } else if (paymentType.paymentType === 'cash') {
      this.setState({ cashChangeModalOpen: true, cashPayment: { amount: outstandingSumm, ...paymentType } })
    } else {
      onPaymentAdded([{ id: paymentType.id, name: paymentType.name, amount: outstandingSumm }])
    }
  }

  render() {
    const { order, onGoBack, canCompleteOrder, payments } = this.props
    const {
      splitPaymentModalOpen,
      cashPayment,
      creditCardPayModalOpen,
      cashChangeModalOpen,
      creditPaymentType,
      cashPaymentModalOpen,
      integratedCreditCardModalOpen,
      splitPayments,
      localSinglePaymentId,
      intergratedCreditCardRequestOpen
    } = this.state
    let outstandingSumm = order.total
    payments.forEach(payment => {
      outstandingSumm -= payment.amount
    })
    let paymentId = null
    if (this.props.createdPayments.length > 0) {
      paymentId = this.props.createdPayments[0].paymentId
    }
    if (localSinglePaymentId) {
      paymentId = localSinglePaymentId
    }
    return (
      <MainPanelWrapper>
        <PaymentsWrapper>
          <Query query={GET_PAYMENT_TYPES_QUERY}>
            {({ loading, error, data }) => {
              if (loading) return <SpinLoader size="80px" color="primary" />
              if (error) return `Error! ${error.message}`

              const { allPaymentTypes } = data.pos
              const paymentOptions = allPaymentTypes.map(payment => {
                return { value: payment.id, label: payment.name, type: payment.paymentType }
              })

              return (
                <>
                  <H4>Split Payments</H4>
                  <Par margin="0.5em 0 1em 0" padding="0 0 1em 0" underline>
                    Allows the guest to pay over multiple payment methods
                  </Par>
                  <ListWrapper>
                    <Button
                      disabled={canCompleteOrder}
                      title="Split Payments"
                      kind="secondary"
                      iconSize="2em"
                      icon="IoIosBook"
                      sizeH="tall"
                      sizeW="100%"
                      onClickHandler={this.toggleSplitPaymentsModal}
                    />
                  </ListWrapper>
                  <H4 margin="1em 0 0 0">Payment Methods</H4>
                  <Par margin="0.5em 0 1em 0" padding="0 0 1em 0" underline>
                    Allows the guest to pay by different types
                  </Par>
                  <ListWrapper>
                    {allPaymentTypes.map(paymentType => (
                      <Button
                        key={paymentType.id}
                        title={paymentType.name}
                        kind="primary"
                        iconSize="2em"
                        disabled={canCompleteOrder}
                        icon={paymentType.creditCard ? 'IoMdCard' : 'IoMdCash'}
                        sizeH="tall"
                        sizeW="100%"
                        onClickHandler={() => this.paymentButtonHandler(paymentType, order)}
                      />
                    ))}
                  </ListWrapper>
                  {splitPaymentModalOpen && (
                    <SplitPaymentsModal
                      paymentOptions={paymentOptions}
                      orderAmount={outstandingSumm}
                      onCancelClick={this.toggleSplitPaymentsModal}
                      onContinueClick={this.splitPaymentModalHandler}
                    />
                  )}
                  {cashPaymentModalOpen && (
                    <CashPaymentModal
                      outstandingSumm={outstandingSumm}
                      paymentType={cashPayment ? cashPayment : { amount: outstandingSumm, ...creditPaymentType }}
                      onCancelClick={this.toggleCashPaymentsModal}
                      onContinueClick={this.addCashPaymentHandler}
                    />
                  )}
                  {cashChangeModalOpen && (
                    <CashChangeModal
                      outstandingSumm={outstandingSumm}
                      paymentType={cashPayment ? cashPayment : { amount: outstandingSumm, ...creditPaymentType }}
                      onCancelClick={this.toggleCashChangeModal}
                      onContinueClick={this.addCashChangeHandler}
                    />
                  )}
                  {creditCardPayModalOpen && creditPaymentType && (
                    <CreditPaymentsModal
                      paymentType={creditPaymentType}
                      paymentAmount={outstandingSumm}
                      onCancelClick={this.toggleCreditCardPayModal}
                      onAddCreditPayments={this.addCreditPaymentsHandler}
                    />
                  )}
                  {integratedCreditCardModalOpen && ((order && outstandingSumm) || splitPayments) && (
                    <IntegratedCreditPaymentsModal
                      onAddCreditPayments={this.addIntegratedCreditPaymentsHandler}
                      orderId={order.id}
                      setMultiplePayments={spl => {
                        this.setSplitPayments(spl)
                      }}
                      hasPurchaser={order && order.purchaser && order.purchaser.id}
                      multiplePayments={
                        splitPayments
                          ? splitPayments
                          : [
                              {
                                amount: outstandingSumm,
                                ...creditPaymentType,
                                paymentId
                              }
                            ]
                      }
                      onCancelClick={this.toggleIntegratedCreditCardPayModal}
                      isRequestOpen={intergratedCreditCardRequestOpen}
                      setRequestOpen={this.setIntegratedCreditCardRequestOpen}
                    />
                  )}
                </>
              )
            }}
          </Query>
          <Button title="Back" kind="greyOutline" rounded onClickHandler={onGoBack} margin="1rem 0 0 0" />
        </PaymentsWrapper>
      </MainPanelWrapper>
    )
  }
}
