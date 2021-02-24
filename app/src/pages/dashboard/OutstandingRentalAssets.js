import React from 'react'
import { debounce } from 'debounce'
import styled, { css } from 'styled-components'
import moment from 'moment-timezone'
import { H2, MainPanelWrapper, SearchTextInput, RentalAssetModal, LazyTable, TableRow, TableCellData, Button, MaskedFromToInput } from 'es-components'
import { displayDateFormat, unique, reFormatTimeZone } from 'es-libs'
import { toastManager } from 'react-toast-notifications'
import { GET_ACCOUNT_INFO } from './schema'

const OutstandingAssetsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: ${props => (props.margin ? `${props.margin}` : '2rem 0 1.5rem')};
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

const TableWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
`

const Filters = styled.div`
  width: 280px;
  margin: 10px 10px 10px -40px;
  ${props => {
    return props.isFirefox
      ? css`
          position: absolute;
          right: 0;
        `
      : null
  }}
`

// Table SetUp
const rowsToShow = 10
const minUnix = 1
const maxUnix = 999999999999
const tableCols = ['Asset Number', 'Serial 1', 'Serial 2', 'Due Date', 'Size', { leftAligned: true, text: 'Asset Class' }, { leftAligned: true, text: 'Guest' }]
const cellCustomWidths = { '4': 1.25, '5': 1.25 }

export class OutstandingRentalAssets extends React.Component {
  state = {
    searchText: '',
    rentalAssetModalOpen: false,
    rentalAsset: null,
    filters: 'outstanding:true',
    fromDateFilter: null,
    toDateFilter: null,
    totalItems: undefined,
    totalGuests: undefined,
    account: undefined,
    guestsWithOutstandingAssets: []
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

  onSearchChangeHandler = searchText => {
    this.setState({ searchText })
  }

  setRentalAssetSelected = rentalAsset => {
    this.setState({ rentalAsset, rentalAssetModalOpen: true })
  }

  handleOnCloseModal = evt => {
    this.setState({ rentalAsset: null, rentalAssetModalOpen: false })
  }

  getBaseQueryConfig = () => {
    const { filters } = this.state
    const rentalAssetsBaseQueryConfig = {
      noResultsMessage: 'There are no outstanding rental assets to show',
      indexesForLoad: [
        {
          indexName: 'rentalAssets',
          options: {
            attributesToRetrieve: 'objectID,serial1,serial2,serial3,serial4,assetNumber,dueDate,size,assetClassName,outstandingGuest',
            filters
          }
        }
      ],
      type: 'algolia'
    }

    return rentalAssetsBaseQueryConfig
  }

  setTotalsAndGuestAssets = data => {
    const { filters, totalItems, totalGuests, guestsWithOutstandingAssets } = this.state

    let guests = []
    const newGuestsWithOutstandingAssets = []
    data.forEach(item => {
      if (item.outstandingGuest) {
        guests.push(item.outstandingGuest)
      }
    })
    guests = unique(guests, ['id'])

    if (totalItems !== data.length || totalGuests !== guests.length) {
      if (filters.length < 20 && !guestsWithOutstandingAssets.length) {
        guests.forEach(guest => {
          const outstandingAssets = data.filter(item => item.outstandingGuest && item.outstandingGuest.id === guest.id)
          newGuestsWithOutstandingAssets.push({ guest, outstandingAssets })
        })

        this.setState({ totalItems: data.length, totalGuests: guests.length, guestsWithOutstandingAssets: newGuestsWithOutstandingAssets })
      } else {
        this.setState({ totalItems: data.length, totalGuests: guests.length })
      }
    }
  }

  getOutstandingAssets = data => {
    if (data) {
      this.setTotalsAndGuestAssets(data)

      return data.map((asset, index) => (
        <TableRow id={`rentalAssetRow_${index}`} key={asset.objectID} className="clickable-row" onClickHandler={() => this.setRentalAssetSelected(asset)}>
          <TableCellData>{asset.assetNumber || 'N/A'}</TableCellData>
          <TableCellData>{asset.serial1 || 'N/A'}</TableCellData>
          <TableCellData>{asset.serial2 || 'N/A'}</TableCellData>
          <TableCellData>{asset.dueDate ? displayDateFormat(asset.dueDate) : 'N/A'}</TableCellData>
          <TableCellData>{asset.size || 'N/A'}</TableCellData>
          <TableCellData leftAligned>{asset.assetClassName || 'N/A'}</TableCellData>
          <TableCellData leftAligned>{asset.outstandingGuest ? asset.outstandingGuest.fullName : 'N/A'}</TableCellData>
        </TableRow>
      ))
    }
  }

  handleClearFilter = () => {
    this.setState({ filters: 'outstanding:true', fromDateFilter: null, toDateFilter: null })
  }

  changeDateRangeInput = (fromDate, toDate) => {
    let { filters, account } = this.state
    let { timeZone } = account
    timeZone = reFormatTimeZone(timeZone)
    fromDate = moment.tz(fromDate, timeZone).startOf('day') / 1000 + 1000
    toDate = moment.tz(toDate, timeZone).endOf('day') / 1000 + 1000
    filters = 'outstanding:true'
    let dueDateFilterString = ''
    if (fromDate && toDate) {
      dueDateFilterString = ` AND dueDateUnix:${fromDate} TO ${toDate}`
    } else if (fromDate && !toDate) {
      dueDateFilterString = ` AND dueDateUnix:${fromDate} TO ${maxUnix}`
    } else if (!fromDate && toDate) {
      dueDateFilterString = ` AND dueDateUnix:${minUnix} TO ${toDate}`
    }
    filters += dueDateFilterString
    this.setState({ filters, fromDateFilter: fromDate, toDateFilter: toDate })
  }

  render() {
    const { searchText, totalItems, totalGuests, guestsWithOutstandingAssets } = this.state

    let variables = {}
    if (searchText !== '') {
      variables = { searchTerm: searchText }
    }

    let isFirefox = typeof InstallTrigger !== 'undefined'

    return (
      <TableWrapper>
        <MainPanelWrapper centeredLayout disableHeader withFilters isFirefox={isFirefox}>
          <OutstandingAssetsHeader>
            <TitleWrapper>
              <H2 id="outstandingAssetsPageHeader" color="greyDark" size="2rem" marginBottom="0.25rem">
                {`${totalItems ? totalItems : ''} Outstanding Rental Assets ${totalGuests ? `From ${totalGuests} Guests` : ''} `}
              </H2>
            </TitleWrapper>
            <SearchWrapper>
              <SearchTextInput
                onChangeHandler={debounce(this.onSearchChangeHandler, 1000)}
                searchTitle="Filter Rental Assets..."
                bgColor="white"
                height="3.625rem"
                lineHeight="2.625rem"
                padding="1rem"
              />
            </SearchWrapper>
          </OutstandingAssetsHeader>
          <LazyTable
            lightTheme
            cellCustomWidths={cellCustomWidths}
            headerData={tableCols}
            onSuccess={data => this.getOutstandingAssets(data)}
            queryConfig={{ ...this.getBaseQueryConfig(), variables }}
            verticalScroll={rowsToShow}
            minHeight="auto"
          />
        </MainPanelWrapper>
        <Filters isFirefox={isFirefox}>
          <OutstandingAssetsHeader margin="7.5rem 5rem 1.5rem">
            <TitleWrapper>
              <H2 color="greyDark" size="2rem" marginBottom="0.25rem">
                Filters
              </H2>
            </TitleWrapper>
          </OutstandingAssetsHeader>
          <MaskedFromToInput
            fromDateValue={this.state.fromDateFilter}
            toDateValue={this.state.toDateFilter}
            id="date"
            field="date"
            dateToPlaceholder="Due Date To"
            dateFromPlaceholder="Due Date From"
            label="Due Date filter"
            autoComplete="off"
            onCheckButtonAvailability={this.changeDateRangeInput}
          />
          <Button
            onClickHandler={this.handleClearFilter}
            key={'clearFilters'}
            title={'Clear Filters'}
            kind={'red'}
            sizeH="normal"
            sizeW="normal"
            margin="5px 55px"
            rounded
          />
        </Filters>
        {this.state.rentalAsset && this.state.rentalAssetModalOpen && (
          <RentalAssetModal
            rentalAsset={this.state.rentalAsset}
            guestsWithOutstandingAssets={guestsWithOutstandingAssets}
            onCancelClick={this.handleOnCloseModal}
          />
        )}
      </TableWrapper>
    )
  }
}
