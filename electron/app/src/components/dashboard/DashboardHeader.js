import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { gql } from 'apollo-boost'

// Context
import { SiteGlobalContext } from 'es-context'

// Libs
import { auth } from 'es-libs'

// Style Utils
import { flexCenterItem } from '../utils'

// Components
import { EntabeniLogo } from '../logos'
import { Par, Avatar, PrintDetailsModal } from 'es-components'

const GET_GUEST_QUERY = gql`
  query GetGuest($id: String!) {
    pos {
      guest(id: $id) {
        id
        email
        fullName
        profilePictureUrl
      }
    }
  }
`

const GET_ORDER_QUERY = gql`
  query GetOrder($id: String!) {
    pos {
      order(id: $id) {
        id
        number
        orderRunOutTime
      }
    }
  }
`

const Header = styled.header`
  grid-column: 1 / span 3;
  min-height: 60px;
  background-color: ${props => props.theme.white};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1em;
`

const HeaderRightContent = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`

const OrderNumberDisplay = styled.section`
  height: 35px;
  background-color: ${props => props.theme.white};
  padding: 0 15px 0 90px;
  border-radius: 0.6em;
  position: relative;
  overflow: hidden;
  color: ${props => props.theme.greyDarkShade};
  line-height: 0;
  border: 1px solid ${props => `rgba(${props.theme.primaryA}, 0.4)`};

  ${flexCenterItem}

  p {
    line-height: 0;
  }

  .orderKey {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 75px;
    height: 35px;
    background-color: ${props => `rgba(${props.theme.primaryA}, 0.1)`};
    color: ${props => props.theme.primary};
    font-weight: 500;
    border-right: 1px solid ${props => `rgba(${props.theme.primaryA}, 0.4)`};

    ${flexCenterItem}
  }
`

export default function DashboardHeader({ client, orderId, onClosePrintTerminalDetailsModal }) {
  const { checkForTimeOut } = useContext(SiteGlobalContext)
  const [printDetailsOpen, setPrintDetailsOpen] = useState(false)
  const [guest, setGuest] = useState(null)
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const fetchGuestData = async () => {
      const { data } = await client.query({ query: GET_GUEST_QUERY, variables: { id: auth.getAuthenticatedUserId() } })
      if (data && data.pos && data.pos.guest) {
        setGuest(data.pos.guest)
      }
    }
    fetchGuestData()
  }, [])

  useEffect(() => {
    if (orderId && !['outstandingAssets', 'orders', 'sales', 'guests', 'checkIns'].includes(orderId)) {
      const fetchOrderData = async () => {
        const { data } = await client.query({ query: GET_ORDER_QUERY, variables: { id: orderId } })
        if (data && data.pos && data.pos.order) {
          setOrder(data.pos.order)
          checkForTimeOut(data.pos.order)
        }
      }
      fetchOrderData()
    }
  }, [orderId])

  const renderOrderNumber = orderNumber => {
    if (orderNumber) {
      return (
        <OrderNumberDisplay>
          <span className="orderKey">ORDER</span>
          <Par id="orderNumber" color="greyDark">
            {orderNumber.toString().padStart(10, '0')}
          </Par>
        </OrderNumberDisplay>
      )
    } else {
      return null
    }
  }

  const handleUserDetailsClick = () => {
    setPrintDetailsOpen(true)
  }

  const onClosePrintDetailsModal = () => {
    onClosePrintTerminalDetailsModal()
    setPrintDetailsOpen(false)
  }

  return (
    <Header>
      <EntabeniLogo name="TextLogo" placement="header" padding="0.5em 0" margin="0" />
      <HeaderRightContent onClick={handleUserDetailsClick}>
        {renderOrderNumber(order ? order.number : undefined)}
        {<Avatar guest={guest || undefined} />}
      </HeaderRightContent>
      {printDetailsOpen && <PrintDetailsModal onCancelHandler={onClosePrintDetailsModal} />}
    </Header>
  )
}
