import React from 'react'
import { debounce } from 'debounce'
import styled from 'styled-components'
import { withToastManager } from 'react-toast-notifications'

import { displayDateFormat, formatCurrency } from 'es-libs'
import { Table, LazyTable, TableRow, TableCellData, SearchTextInput, H2, Par, ProductModal, ExistingSaleSelectionModal } from 'es-components'
import { UPDATE_CHECKIN, GET_SALE_DETAILS_BY_ID } from '../../../pages/dashboard/schema'

const ExistingSalesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 1.5rem;
  width: 100%;

  & > div {
    width: auto;
  }
`

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

// Existing sales modal table setup
const rowsToShow = 8

const existingSalesTableCols = [
  { leftAligned: true, text: 'Created' },
  'Number',
  { leftAligned: true, text: 'Purchaser' },
  'Status',
  { rightAligned: true, text: 'Total' }
]
const existingSalesCellCustomWidths = {}

// Sale Line Items modal table setup
const lineItemsTableCols = [{ leftAligned: true, text: 'Product Name' }, 'Quantity', { rightAligned: true, text: 'Total' }]
const lineItemsCellCustomWidths = { '1': 0.5, '2': 0.75 }

class SalesSelectModal extends React.Component {
  state = {
    selectedSale: null,
    currentCheckIn: null,
    checkInIndex: 0,
    searchText: '',
    completedCheckIns: [],
    confirmationModalOpen: false,
    selectedLineItem: null,
    salesLoading: true,
    sales: []
  }

  componentDidMount() {
    const { checkIns } = this.props
    const { checkInIndex } = this.state

    if (checkIns.length) {
      this.setState({ currentCheckIn: checkIns[checkInIndex] }, this.getSales)
    }
  }

  existingSalesBaseQueryConfig = () => {
    let filters = 'status:complete AND hasStaffUser:true'
    const previousSalesBaseQueryConfig = {
      noResultsMessage: 'There are not matching sales to show',
      indexesForLoad: [
        {
          indexName: 'sales',
          options: {
            attributesToRetrieve: 'objectID,guestName,created,number,status,total,',
            hitsPerPage: 20,
            filters
          }
        }
      ],
      type: 'algolia'
    }

    return previousSalesBaseQueryConfig
  }

  onCancelClick = () => {
    const { onCancelClick } = this.props

    if (onCancelClick) {
      onCancelClick()
    }
  }
  onSaleLineItemClick = item => {
    this.setState({ confirmationModalOpen: true, selectedLineItem: item })
  }

  onConfirmSelection = () => {
    const { client, checkIns, toastManager } = this.props
    const { currentCheckIn, checkInIndex, completedCheckIns, selectedLineItem } = this.state

    const newCheckInIndex = checkInIndex + 1
    const newCurrentCheckIn = checkIns[newCheckInIndex]
    completedCheckIns.push({ saleLineItemId: selectedLineItem.id, checkInId: currentCheckIn.id })

    if (completedCheckIns.length === checkIns.length) {
      completedCheckIns.forEach(completedCheckIn => {
        client
          .mutate({
            mutation: UPDATE_CHECKIN,
            variables: { id: completedCheckIn.checkInId, saleLineItemId: completedCheckIn.saleLineItemId }
          })
          .then(res => {
            if (res) {
              toastManager.add(`Check In for ${currentCheckIn.guest.fullName} was updated`, {
                appearance: 'success',
                autoDismissTimeout: 3000,
                autoDismiss: true
              })
            }
          })
      })
      this.setState({ selectedSale: null, confirmationModalOpen: false, selectedLineItem: null }, this.onCancelClick)
    } else {
      this.setState({
        checkInIndex: newCheckInIndex,
        currentCheckIn: newCurrentCheckIn,
        completedCheckIns,
        selectedSale: null,
        confirmationModalOpen: false,
        selectedLineItem: null
      })
    }
  }

  onSaleClick = saleId => {
    if (saleId) {
      const { client } = this.props

      client.query({ query: GET_SALE_DETAILS_BY_ID, variables: { id: saleId } }).then(result => {
        const { sale } = result.data.pos
        const { saleLineItems } = sale
        if (saleLineItems && saleLineItems[0]) {
          this.setState({ selectedSale: sale })
        }
      })
    }
  }

  renderExistingSales = data => {
    return data.map(sale => (
      <TableRow key={sale.objectID} className="clickable-row" onClickHandler={() => this.onSaleClick(sale.objectID)}>
        <TableCellData leftAligned>{displayDateFormat(sale.created)}</TableCellData>
        <TableCellData>{sale.number}</TableCellData>
        <TableCellData leftAligned>{sale.guestName ? `${sale.guestName}` : 'N/A'}</TableCellData>
        <TableCellData>{sale.status}</TableCellData>
        <TableCellData textAlign="right" paddingright="3rem">
          {formatCurrency(sale.total)}
        </TableCellData>
      </TableRow>
    ))
  }

  renderExistingSalesTable = () => {
    const { searchText } = this.state
    let variables = {}
    if (searchText !== '') {
      variables = { searchTerm: searchText }
    }
    return (
      <LazyTable
        lightTheme
        cellCustomWidths={existingSalesCellCustomWidths}
        headerData={existingSalesTableCols}
        onSuccess={data => this.renderExistingSales(data)}
        queryConfig={{ ...this.existingSalesBaseQueryConfig(), variables }}
        verticalScroll={rowsToShow}
      />
    )
  }

  onSearchChangeHandler = searchText => {
    this.setState({ searchText })
  }

  renderSales = () => {
    const { currentCheckIn } = this.state
    let guestName = ''
    if (currentCheckIn && currentCheckIn.guest) {
      const guest = currentCheckIn.guest
      guestName = guest.fullName
    }

    let title = `${guestName}'s sales`
    let subTitle = 'Scroll down the sales list and click any to review its details'

    const salesSelectModalCloseIconStyles = {
      right: '-2.5rem',
      top: '-2rem'
    }

    return (
      <ProductModal onCancelHandler={this.onCancelClick} lightLayout closeIcon closeIconStyles={salesSelectModalCloseIconStyles} noTitle withScrollableTable>
        <ExistingSalesHeader>
          <TitleWrapper>
            <H2 color="greyDark" size="2rem" marginBottom="0.25rem">
              {title}
            </H2>
            <Par color="greyDark" size="1rem" margin="0">
              {subTitle}
            </Par>
          </TitleWrapper>
          <SearchWrapper>
            <SearchTextInput
              onChangeHandler={debounce(this.onSearchChangeHandler, 1000)}
              searchTitle="Filter Sales..."
              bgColor="white"
              height="3.625rem"
              lineHeight="2.625rem"
              padding="1rem"
            />
          </SearchWrapper>
        </ExistingSalesHeader>
        {this.renderExistingSalesTable()}
      </ProductModal>
    )
  }

  onCancelLineItemSelection = () => {
    this.setState({ selectedSale: null })
  }

  renderSaleLineItemsBySale = () => {
    const { selectedSale, currentCheckIn } = this.state
    const { saleLineItems } = selectedSale
    let guestName = ''
    if (currentCheckIn && currentCheckIn.guest) {
      const guest = currentCheckIn.guest
      guestName = guest.fullName
    }

    let subTitle = `Select line item for ${guestName}`

    return (
      <ProductModal title={`Sale ${selectedSale.number} line items`} subTitle={subTitle} lightLayout closeIcon onCancelHandler={this.onCancelLineItemSelection}>
        <Table lightTheme cellCustomWidths={lineItemsCellCustomWidths} headerData={lineItemsTableCols} verticalScroll={rowsToShow}>
          {saleLineItems.map(item => (
            <TableRow key={item.id} className="clickable-row" onClickHandler={() => this.onSaleLineItemClick(item)}>
              <TableCellData leftAligned>{item.name}</TableCellData>
              <TableCellData>{item.quantity}</TableCellData>
              <TableCellData textAlign="right" paddingright="3rem">
                {formatCurrency(item.total)}
              </TableCellData>
            </TableRow>
          ))}
        </Table>
      </ProductModal>
    )
  }

  onCancelConfirmation = () => {
    this.setState({ confirmationModalOpen: false })
  }

  render() {
    const { selectedSale, confirmationModalOpen, selectedLineItem, currentCheckIn } = this.state

    let guestName = ''
    if (currentCheckIn && currentCheckIn.guest) {
      const guest = currentCheckIn.guest
      guestName = guest.fullName
    }

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
        label: 'Confirm',
        onClick: this.onConfirmSelection
      },
      {
        label: 'Cancel',
        onClick: this.onCancelConfirmation
      }
    ]

    return (
      <>
        {selectedSale == null ? this.renderSales() : this.renderSaleLineItemsBySale()}
        {confirmationModalOpen && selectedLineItem && (
          <ExistingSaleSelectionModal
            title="Confirm your selection"
            buttons={buttons}
            messageStyling={messageStyling}
            message={
              <React.Fragment>
                Please confirm you selected the item:
                <br />
                <b>{selectedLineItem.name}</b>
                <br />
                for guest:
                <br />
                <b>{guestName}</b>
              </React.Fragment>
            }
            sizing={modalSizing}
          />
        )}
      </>
    )
  }
}

export default withToastManager(SalesSelectModal)
