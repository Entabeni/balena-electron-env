import React from 'react'
import { Query } from 'react-apollo'
import styled from 'styled-components'

import {
  DashboardWrapperSingle,
  SpinLoader,
  MainPanelWrapper,
  Icon,
  Par,
  GuestCheckInsHeader,
  CheckInsGuestsSearch,
  RentalSaleElement,
  GuestRentalSaleList
} from 'es-components'

import { CREATE_ORDER_MUTATION, GET_ALL_RENTAL_SALES_QUERY } from './schema'

const GuestTableWrapper = styled.div`
  grid-row: span 2;
  margin: 0 auto;
  width: 75%;
`

export class AllGuestsCheckinsPage extends React.Component {
  state = {
    search: '',
    guestId: null,
    guestName: null,
    guestPic: null,
    currentOrderId: null,
    saleId: null
  }

  componentDidMount() {
    let { currentOrderId, client } = this.props
    if (!currentOrderId || currentOrderId.length < 15) {
      client
        .mutate({
          mutation: CREATE_ORDER_MUTATION
        })
        .then(res => {
          currentOrderId = res.data.pos.createOrder.id
          this.setState({
            currentOrderId
          })
        })
    } else {
      this.setState({
        currentOrderId
      })
    }
  }

  handleOnSearch = search => {
    this.setState({ search })
  }

  handleOnGuestClick = ({ id: guestId, name: guestName, userImage: guestPic, saleId }) => {
    this.setState({ guestId, guestName, guestPic, saleId })
  }

  renderGuestTable = () => {
    const { search } = this.state

    return (
      <GuestTableWrapper>
        <GuestCheckInsHeader value={search} searchTitle="Search..." onSearch={this.handleOnSearch} />
        <Query query={GET_ALL_RENTAL_SALES_QUERY} variables={{ search }}>
          {({ loading, error, data }) => {
            if (loading)
              return (
                <DashboardWrapperSingle>
                  <SpinLoader withWrapper size="80px" color="primary" />
                </DashboardWrapperSingle>
              )
            if (error) return `Error! ${error.message}`
            let sales = data.pos.allRentalSales
            return sales.length === 0 ? (
              <Par color="grey" lineHeight="1.5" margin="100px 0 0" size="1.75rem" textAlign="center">
                <Icon name="FaInfoCircle" size="3.5rem" />
                <br />
                Sorry, but we could not find any matching results.
                <br />
                Review your search and try again.
              </Par>
            ) : (
              <React.Fragment>
                <Par color="grey" margin="0 0 20px" padding="0 0 0 0.5rem">
                  {`We've found ${sales.length} matching result${sales.length > 1 ? 's' : ''}`}
                </Par>
                {sales.map((sale, i) => {
                  if (sale.todaysRentalSaleLineItems[0] && sale.todaysRentalSaleLineItems[0].guestLineItems[0]) {
                    let profilePictureUrlExtraLarge = null
                    let avatar = null
                    let customerNumber = null
                    let id = null
                    let fullName = 'Deleted'
                    if (sale.todaysRentalSaleLineItems[0].guestLineItems[0].guest) {
                      let guest = sale.todaysRentalSaleLineItems[0].guestLineItems[0].guest
                      profilePictureUrlExtraLarge = guest.profilePictureUrlExtraLarge
                      avatar = guest.avatar
                      customerNumber = guest.customerNumber
                      id = guest.id
                      fullName = guest.fullName
                    }
                    return (
                      <RentalSaleElement
                        rowNum={i}
                        listType="guest"
                        userImage={profilePictureUrlExtraLarge || avatar}
                        customerNumber={customerNumber}
                        key={id}
                        saleId={sale.id}
                        onClick={this.handleOnGuestClick}
                        id={id}
                        name={fullName}
                        saleNumber={sale.number}
                        saleTotal={sale.total}
                      />
                    )
                  }
                })}
              </React.Fragment>
            )
          }}
        </Query>
      </GuestTableWrapper>
    )
  }

  renderGuestsSearch = () => <CheckInsGuestsSearch onSearch={this.handleOnSearch} />

  renderGuestCheckInsList = () => {
    const { guestId, guestName, guestPic, currentOrderId, saleId } = this.state
    const { history, client, onRefreshProducts, allProducts, allCategories, productsLoading, accountFromRequest } = this.props
    return (
      <GuestRentalSaleList
        guestId={guestId}
        guestName={guestName}
        onRefreshProducts={onRefreshProducts}
        allProducts={allProducts}
        accountFromRequest={accountFromRequest}
        productsLoading={productsLoading}
        allCategories={allCategories}
        guestPic={guestPic}
        currentOrderId={currentOrderId}
        client={client}
        saleId={saleId}
        history={history}
        onCancelClick={() => this.handleOnGuestClick({ id: null, name: null, userImage: null })}
      />
    )
  }

  render() {
    const { search, saleId, guestName } = this.state

    return (
      <MainPanelWrapper disableHeader={true} fullHeight={true}>
        <DashboardWrapperSingle>
          {(guestName !== null && saleId !== null && this.renderGuestCheckInsList()) || (search === '' ? this.renderGuestsSearch() : this.renderGuestTable())}
        </DashboardWrapperSingle>
      </MainPanelWrapper>
    )
  }
}
