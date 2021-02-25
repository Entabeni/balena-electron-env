import React from 'react'
import styled from 'styled-components'

// Components
import { Table } from 'es-components'
import { SalePanelFooter } from './SalePanelFooter'
import { SalePanelButtons } from './SalePanelButtons'
import { SaleListItem } from './saleList/SaleListItem'
import { PaymentListItem } from './paymentList/PaymentListItem'
import { parseDate } from 'es-libs'

const SaleWrapper = styled.div`
  margin: 0;
  width: 100%;
  min-height: 100%;
  max-height: 600px;
  display: block;
  padding: 0;
  position: relative;
  box-sizing: border-box;
`

export class SalePanelWrapper extends React.Component {
  state = { productIds: [], saleLineItems: this.props.sale.saleLineItems }

  onCheckBoxClick = itemId => {
    const { productIds } = this.state
    if (productIds.indexOf(itemId) === -1) {
      productIds.push(itemId)
    } else {
      productIds.forEach((val, index) => {
        if (val === itemId) {
          productIds.splice(index, 1)
        }
      })
    }

    this.setState({ productIds })
  }

  onRefundBtnClick = () => {
    const { onRefundClick } = this.props
    const { productIds } = this.state

    if (onRefundClick) {
      onRefundClick(productIds)
    }
  }

  onPrintCardBtnClick = () => {
    const { onPrintCardClick } = this.props
    const { productIds } = this.state

    if (onPrintCardClick) {
      onPrintCardClick(productIds)
    }
  }

  onChangeSorting = (column, direction) => {
    let { saleLineItems } = this.state
    if (column === 'forDate') {
      if (direction === 'down') {
        saleLineItems = saleLineItems.sort((a, b) => parseDate(a.forDate).getTime() - parseDate(b.forDate).getTime())
      } else if (direction === 'up') {
        saleLineItems = saleLineItems.sort((a, b) => parseDate(b.forDate).getTime() - parseDate(a.forDate).getTime())
      }
    }

    this.setState({ saleLineItems })
  }

  displayForDateColumnCheck = () => {
    const { saleLineItems } = this.state
    let shouldShowDate = false
    if (saleLineItems && saleLineItems.length > 0) {
      saleLineItems.forEach(item => {
        if (item.forDate != null && !shouldShowDate) {
          shouldShowDate = true
        }
      })
    }
    return shouldShowDate
  }

  render() {
    const { sale, payments, onPrintReceiptClick, receiptPrintLoading, onEmailClick } = this.props
    const { saleLineItems } = this.state
    const shouldShowDate = this.displayForDateColumnCheck()

    // Table SetUp
    const rowsToShow = 5
    const tableCols = [
      { celltype: 'select-cell', text: 'Select' },
      { leftAligned: true, text: 'Item' },
      { leftAligned: true, text: 'Guest' },
      'Qty',
      'Subtotal'
    ]
    const cellCustomWidths = { '0': 0.6, '1': 1.5, '2': 1.5 }

    if (shouldShowDate) {
      tableCols.splice(2, 0, { id: 'forDate', sortable: true, text: 'For Date' })
      cellCustomWidths['2'] = 1
      cellCustomWidths['3'] = 1.5
    }

    return (
      <SaleWrapper>
        <Table
          lightTheme
          footerRenderedContent={<SalePanelFooter shippingOption={sale.shippingOption} subTotal={sale.subTotal} taxTotal={sale.taxTotal} total={sale.total} />}
          footerStyles={{ borderBottom: true }}
          headerData={tableCols}
          onChangeSorting={this.onChangeSorting}
          headerStyles={{ borderTop: true }}
          cellCustomWidths={cellCustomWidths}
          verticalScroll={rowsToShow}>
          {saleLineItems.map((saleLineItem, index) => {
            return (
              <SaleListItem
                key={saleLineItem.id}
                id={`saleLineItemRow_${index}`}
                saleLineItem={saleLineItem}
                shouldShowDate={shouldShowDate}
                onCheckBoxClick={this.onCheckBoxClick}
              />
            )
          })}
          {payments.map(payment => (
            <PaymentListItem key={payment.id} payment={payment} />
          ))}
        </Table>
        <SalePanelButtons
          sale={sale}
          onRefundClick={this.onRefundBtnClick}
          onPrintReceiptClick={onPrintReceiptClick}
          onPrintCardClick={this.onPrintCardBtnClick}
          receiptPrintLoading={receiptPrintLoading}
          onEmailClick={onEmailClick}
        />
      </SaleWrapper>
    )
  }
}
