import React from 'react'

import { Span, ProductModal, SpinLoader, SalePanelWrapper, EmailPanelWrapper, RefundPanelWrapper, ShippingOptionRefundModal } from 'es-components'

export class PreviousSaleModal extends React.Component {
  state = {
    openedModal: 'sales',
    emails: [],
    productsNeedAdditionalAction: [],
    lineItems: [],
    productIdsToRefund: [],
    refundShippingOption: false,
    shippingOptionRefundSelected: false,
    showShippingOptionModalRefund: false
  }

  onEmailButtonClick = () => {
    const { sale } = this.props
    const emails = []

    if (sale.purchaser) {
      emails.push({ id: sale.purchaser.id, fullName: sale.purchaser.fullName, email: sale.purchaser.email })
    }

    sale.saleLineItems.forEach(item => {
      if (item.guest) {
        emails.push({ id: item.guest.id, fullName: item.guest.fullName, email: item.guest.email })
      }
    })

    this.setState({ openedModal: 'email', emails })
  }

  onEmailCancel = () => {
    this.setState({ openedModal: 'sales' })
  }

  onMakeRefund = lineItems => {
    const finishedLineItems = this.state.lineItems
    finishedLineItems.push(...lineItems)
    this.props.onRefundClick(finishedLineItems, this.state.refundShippingOption)
  }

  onSendEmail = guestIds => {
    const { onEmailClick } = this.props

    if (onEmailClick) {
      onEmailClick(guestIds)
    }

    this.setState({ openedModal: 'sales' })
  }

  onShippingOptionRefund = refundShippingOption => {
    this.setState({ shippingOptionRefundSelected: true, refundShippingOption, showShippingOptionModalRefund: false }, () =>
      this.onRefundClick(this.state.productIdsToRefund)
    )
  }

  onRefundClick = productIds => {
    const { sale, onRefundClick } = this.props
    const { shippingOptionRefundSelected } = this.state
    if (productIds.length > 0 && sale.shippingOption && !shippingOptionRefundSelected) {
      this.setState({ productIdsToRefund: productIds, showShippingOptionModalRefund: true })
    } else {
      const productsNeedAdditionalAction = []
      const lineItems = []
      if (productIds && productIds.length) {
        sale.saleLineItems.forEach(item => {
          if (productIds.indexOf(item.id) > -1) {
            const guestLineItems = []
            if (item.guests && item.guests.length) {
              item.guests.forEach(guest => {
                guestLineItems.push({ guestId: guest.id, fullName: guest.fullName })
              })
            }

            if (item.quantity > 1) {
              if (guestLineItems.length > 1) {
                productsNeedAdditionalAction.push({
                  productId: item.productId,
                  productName: item.name,
                  actionToComplete: 'selectGuests',
                  allGuestLineItems: guestLineItems,
                  lineItem: {
                    originalSaleLineItemId: item.id,
                    forDate: item.forDate,
                    productId: item.productId,
                    events: item.events,
                    answers: item.answers
                  }
                })
              } else {
                productsNeedAdditionalAction.push({
                  productId: item.productId,
                  productName: item.name,
                  allGuestLineItems: guestLineItems.length ? guestLineItems : [],
                  actionToComplete: 'selectQuantity',
                  maxCount: item.quantity,
                  lineItem: {
                    originalSaleLineItemId: item.id,
                    forDate: item.forDate,
                    productId: item.productId,
                    events: item.events,
                    answers: item.answers
                  }
                })
              }
            } else {
              lineItems.push({
                originalSaleLineItemId: item.id,
                forDate: item.forDate,
                productId: item.productId,
                quantity: Number('-' + item.quantity),
                events: item.events,
                answers: item.answers,
                guestLineItems: guestLineItems.map(guest => {
                  return {
                    guestId: guest.guestId
                  }
                })
              })
            }
          }
        })

        if (productIds.length === lineItems.length) {
          onRefundClick(lineItems, this.state.refundShippingOption)
        } else {
          this.setState({ openedModal: 'refund', productsNeedAdditionalAction, lineItems })
        }
      }
    }
  }

  renderModalTitle = saleNumber => (
    <React.Fragment>
      Previous Sale{' '}
      <Span lineHeight="2.25rem" padding="0.25rem 1rem">
        {saleNumber.toString().padStart(10, '0')}
      </Span>
    </React.Fragment>
  )

  render() {
    const { sale, onCancelClick, receiptPrintLoading, onPrintReceiptClick, onPrintCardClick, saleSelectedLoading } = this.props
    const { openedModal, emails, productsNeedAdditionalAction } = this.state

    const modalSizing = {
      height: 'auto',
      maxHeight: 'unset',
      maxWidth: '560px',
      width: '40%'
    }
    const messageStyling = {
      lineHeight: '2.5rem',
      size: '1.5rem',
      textAlign: 'center'
    }
    const buttons = [
      {
        label: 'Yes',
        onClick: () => this.onShippingOptionRefund(true)
      },
      {
        label: 'No',
        onClick: () => this.onShippingOptionRefund(false)
      }
    ]

    return (
      <React.Fragment>
        <ProductModal
          title={saleSelectedLoading ? '' : this.renderModalTitle(sale.number)}
          subTitle={saleSelectedLoading ? '' : 'Select an action'}
          onCancelHandler={onCancelClick}
          lightLayout
          closeIcon
          withScrollableTable>
          {saleSelectedLoading && <SpinLoader withWrapper="350px" size="80px" color="primary" />}
          {!saleSelectedLoading && openedModal === 'sales' && (
            <SalePanelWrapper
              sale={sale}
              payments={[]}
              receiptPrintLoading={receiptPrintLoading}
              onRefundClick={this.onRefundClick}
              onPrintReceiptClick={onPrintReceiptClick}
              onPrintCardClick={onPrintCardClick}
              onEmailClick={this.onEmailButtonClick}
            />
          )}
          {!saleSelectedLoading && openedModal === 'email' && (
            <EmailPanelWrapper emails={emails} onCancel={this.onEmailCancel} onSendEmail={this.onSendEmail} />
          )}
          {!saleSelectedLoading && openedModal === 'refund' && productsNeedAdditionalAction.length && (
            <RefundPanelWrapper products={productsNeedAdditionalAction} onMakeRefund={this.onMakeRefund} />
          )}
        </ProductModal>
        {this.state.showShippingOptionModalRefund && (
          <ShippingOptionRefundModal
            title="Shipping costs refund"
            buttons={buttons}
            messageStyling={messageStyling}
            message={<React.Fragment>Do you want to refund shipping costs?</React.Fragment>}
            sizing={modalSizing}
          />
        )}
      </React.Fragment>
    )
  }
}
