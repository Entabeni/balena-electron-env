import React from 'react'
import { debounce } from 'debounce'
import moment from 'moment-timezone'
import styled from 'styled-components'

import { H2, Par, MainPanelWrapper, RoundedCheckboxInput, SearchTextInput, LazyTable, TableRow, TableCellData, Button } from 'es-components'
import { GET_ACCOUNT_INFO } from './schema'
import { parseDateToFormat } from 'es-libs'
import { toastManager } from 'react-toast-notifications'

const PreviousOrdersHeader = styled.div`
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
  margin: 2rem 0 1.5rem;
  width: 100%;

  & > div {
    width: auto;
  }
`

const TitleWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const SearchWrapper = styled.div`
  align-items: flex-end;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const SearchParamsWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;

  & > p {
    margin-right: 1rem;
  }

  & > div {
    min-height: 1.75rem;

    > label:last-child {
      margin-top: 0;
    }

    &:last-of-type > label:last-child {
      padding-right: 0.25rem;
    }
  }
`

// Table SetUp
const rowsToShow = 10
const tableCols = [
  { leftAligned: true, text: 'Created' },
  'Number',
  { leftAligned: true, text: 'Purchaser' },
  'Status',
  'Total',
  { celltype: 'action-cell', text: '' }
]
const cellCustomWidths = { '0': 1.2, '2': 1.2, '5': 0.6 }

const originalSearchableAttributes = ['guestFullName', 'number', 'total']
const baseQueryConfig = {
  noResultsMessage: 'There are not orders to show',
  indexesForLoad: [
    {
      indexName: 'orders',
      options: {
        attributesToRetrieve: 'objectID,created,number,status,total,guestId,guestFullName',
        filters: `status: created AND createdUnix: ${moment().unix() - 2592000} TO ${moment().unix()} AND hasStaffUser: true`,
        restrictSearchableAttributes: []
      }
    }
  ],
  type: 'algolia'
}

export class OrdersPage extends React.Component {
  state = {
    searchText: '',
    account: null,
    isPurchaserIncludedInSearch: true,
    isNumberIncludedInSearch: true,
    isTotalIncludedInSearch: true,
    attributesToSearchFor: originalSearchableAttributes
  }

  handleSearchChange = searchText => {
    this.setState({ searchText })
  }

  componentDidMount = () => {
    const { client } = this.props
    try {
      client.query({ query: GET_ACCOUNT_INFO }).then(result => {
        if (!!result && result.data.pos.account) {
          this.setState({ account: result.data.pos.account })
        } else {
          throw new Error('There was an error with the response from the server.')
        }
      })
    } catch (error) {
      toastManager.add('The retrieval of the account info failed.', { appearance: 'error', autoDismiss: false })
    }
  }

  getOrders = data => {
    const { history } = this.props
    const { account } = this.state

    if (data) {
      return data.map((order, index) => (
        <TableRow id={`prevOrderRow_${index}`} key={order.objectID}>
          <TableCellData leftAligned>{parseDateToFormat(order.created, account)}</TableCellData>
          <TableCellData>{order.number}</TableCellData>
          <TableCellData leftAligned>{order.guestFullName ? `${order.guestFullName}` : 'N/A'}</TableCellData>
          <TableCellData>{order.status}</TableCellData>
          <TableCellData>{order.total}</TableCellData>
          <TableCellData celltype="action-cell">
            <Button
              id={`openPrevOrderButton_${index}`}
              kind="primary"
              hoverBgColor="red"
              icon="FaCashRegister"
              iconSize="1.25rem"
              onClickHandler={() => history.push(`/order/${order.objectID}`)}
            />
          </TableCellData>
        </TableRow>
      ))
    }
  }

  handleSearchParamsChange = (searchParam, isActive) => {
    const paramsMap = {
      Purchaser: 'guestFullName',
      Number: 'number',
      Total: 'total'
    }
    let modifiedAlgoliaAttributes

    if (!isActive) {
      modifiedAlgoliaAttributes = this.state.attributesToSearchFor.filter(attr => attr !== paramsMap[searchParam])
    } else {
      modifiedAlgoliaAttributes = this.state.attributesToSearchFor
      modifiedAlgoliaAttributes.push(paramsMap[searchParam])
    }

    this.setState({
      attributesToSearchFor: modifiedAlgoliaAttributes,
      [`is${searchParam}IncludedInSearch`]: isActive
    })
  }

  render() {
    const { attributesToSearchFor, searchText } = this.state

    let variables = {}
    if (searchText !== '') {
      variables = {
        restrictSearchableAttributes: attributesToSearchFor,
        searchTerm: searchText
      }
    }

    return (
      <MainPanelWrapper centeredLayout disableHeader>
        <PreviousOrdersHeader>
          <TitleWrapper>
            <H2 color="greyDark" size="2rem" marginBottom="0.25rem">
              Previous Orders
            </H2>
            <Par color="greyDark" size="1rem" margin="0">
              Scroll down the orders list and click any to review its details
            </Par>
          </TitleWrapper>
          <SearchWrapper>
            <SearchParamsWrapper>
              <Par>Search for</Par>
              <RoundedCheckboxInput
                className="filter-search-checkbox"
                id="purchaser-filter"
                label="Purchaser"
                checked={this.state.isPurchaserIncludedInSearch}
                onClickHandler={(fieldId, isChecked) => this.handleSearchParamsChange('Purchaser', isChecked)}
              />
              <RoundedCheckboxInput
                className="filter-search-checkbox"
                id="order-number-filter"
                label="Order Number"
                checked={this.state.isNumberIncludedInSearch}
                onClickHandler={(fieldId, isChecked) => this.handleSearchParamsChange('Number', isChecked)}
              />
              <RoundedCheckboxInput
                className="filter-search-checkbox"
                id="total-filter"
                label="Total"
                checked={this.state.isTotalIncludedInSearch}
                onClickHandler={(fieldId, isChecked) => this.handleSearchParamsChange('Total', isChecked)}
              />
            </SearchParamsWrapper>
            <SearchTextInput
              onChangeHandler={debounce(this.handleSearchChange, 1000)}
              searchTitle="Filter Orders..."
              bgColor="white"
              height="3.625rem"
              lineHeight="2.625rem"
              padding="1rem"
            />
          </SearchWrapper>
        </PreviousOrdersHeader>
        <LazyTable
          lightTheme
          cellCustomWidths={cellCustomWidths}
          headerData={tableCols}
          onSuccess={data => this.getOrders(data)}
          queryConfig={{ ...baseQueryConfig, variables }}
          verticalScroll={rowsToShow}
        />
      </MainPanelWrapper>
    )
  }
}
