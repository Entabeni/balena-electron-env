import React from 'react'
import styled from 'styled-components'

// Components
import { Bold, Table, SelectInput, Par } from 'es-components'
import { GuestListItem } from './GuestListItem'
import { RefundPanelButtonsWrapper } from './RefundPanelButtonsWrapper'

//Validations
import { displayDateFormat, validateRequired } from 'es-libs'

const RefundWrapper = styled.div`
  margin: 0;
  width: 100%;
  min-height: 100%;
  max-height: 500px;
  display: block;
  padding: 0;
  position: relative;
  box-sizing: border-box;
`

// Table SetUp
const rowsToShow = 5
const tableCols = [
  { celltype: 'select-cell', text: 'Select' },
  { leftAligned: true, text: 'Full Name' }
]
const cellCustomWidths = { '0': 0.35 }

export class RefundPanelWrapper extends React.Component {
  state = { lineItems: [], currentProduct: null, currentProductIndex: 0, selectedQnt: 1, selectedGuests: [] }

  componentWillMount() {
    const { products } = this.props
    const { currentProductIndex } = this.state
    if (products && products.length) {
      this.setState({ currentProduct: products[currentProductIndex] })
    }
  }

  onCheckBoxClick = (guest, checkBoxClicked) => {
    const { selectedGuests } = this.state
    if (checkBoxClicked) {
      selectedGuests.push(guest)
      this.setState({ selectedGuests })
    } else {
      let filteredGuests = selectedGuests.filter(selectedGuest => selectedGuest.guestId !== guest.guestId)
      this.setState({ selectedGuests: filteredGuests })
    }
  }

  onConfirmClick = () => {
    const { currentProductIndex, currentProduct, selectedQnt, selectedGuests, lineItems } = this.state
    const { products } = this.props
    let { actionToComplete, lineItem, allGuestLineItems } = currentProduct
    if (actionToComplete === 'selectGuests') {
      if (selectedGuests.length > 0) {
        lineItem['guestLineItems'] = selectedGuests.map(selectedGuest => {
          return {
            guestId: selectedGuest.guestId
          }
        })
        lineItem['quantity'] = Number('-' + selectedGuests.length)
      }
    }

    if (actionToComplete === 'selectQuantity') {
      if (allGuestLineItems.length === 1) {
        lineItem['guestLineItems'] = [{ guestId: allGuestLineItems[0].guestId }]
      }
      lineItem['quantity'] = Number('-' + selectedQnt)
    }

    lineItems.push(lineItem)
    let newCurrentProduct
    const newCurrentProductIndex = currentProductIndex + 1
    if (newCurrentProductIndex <= products.length) {
      newCurrentProduct = products[newCurrentProductIndex]
    }

    this.setState(
      { selectedQnt: 1, selectedGuests: [], lineItems, currentProductIndex: newCurrentProductIndex, currentProduct: newCurrentProduct },
      this.checkAndSend
    )
  }

  checkAndSend = () => {
    const { products, onMakeRefund } = this.props
    const { lineItems } = this.state
    if (products.length === lineItems.length) {
      onMakeRefund(lineItems)
    }
  }

  changeSelectorValue = e => {
    this.setState({ selectedQnt: e.value })
  }

  render() {
    const { currentProduct, selectedQnt, selectedGuests } = this.state
    const qntOptions = []
    let title = ''

    if (!currentProduct) {
      return null
    } else {
      if (currentProduct.actionToComplete === 'selectQuantity' && currentProduct.maxCount) {
        title = `Please, select quantity for refund for product `
        for (let i = 1; i <= currentProduct.maxCount; i++) {
          qntOptions.push({ value: i, label: i })
        }
      }

      if (currentProduct.actionToComplete === 'selectGuests') {
        title = `Please, select guests for whom you want to make refund for product `
      }
    }

    return (
      <RefundWrapper>
        <Par color="greyDark" margin="5px">
          {title}
          <Bold>
            {currentProduct.productName}
            {currentProduct.lineItem.forDate ? ` scheduled for ${displayDateFormat(currentProduct.lineItem.forDate)}` : null}
          </Bold>
        </Par>
        {currentProduct.actionToComplete === 'selectGuests' && currentProduct.allGuestLineItems && (
          <Table lightTheme headerData={tableCols} headerStyles={{ borderTop: true }} cellCustomWidths={cellCustomWidths} verticalScroll={rowsToShow}>
            {currentProduct.allGuestLineItems.map((guest, i) => (
              <GuestListItem
                key={`${guest.guestId}_${i}`}
                ident={`${guest.guestId}_${i}`}
                guest={guest}
                clearState={!selectedGuests.length}
                onCheckBoxClick={this.onCheckBoxClick}
              />
            ))}
          </Table>
        )}
        {currentProduct.actionToComplete === 'selectQuantity' && (
          <SelectInput
            placeholder="Select quantity"
            id="refundQuantity"
            field="refundQuantity"
            options={qntOptions}
            borderRadius="0 0 12px 0"
            value={selectedQnt}
            validate={validateRequired}
            onChange={e => this.changeSelectorValue(e)}
          />
        )}
        <RefundPanelButtonsWrapper disabled={currentProduct.actionToComplete === 'selectGuests' && !selectedGuests.length} onConfirm={this.onConfirmClick} />
      </RefundWrapper>
    )
  }
}
