import React from 'react'

// Components
import { H2, Par, Button, RoundedAvatar, RentalSalesPanelWrapper } from 'es-components'

// Styling
import styled from 'styled-components'
import { flexCenterItem } from '../utils'

const layoutWidth = '90%'
const userPicSize = '72px'

const ContentWrapper = styled.div`
  ${flexCenterItem}
  flex-direction: column;
`

const GoBackWrapper = styled.div`
  margin: 1rem 0 2rem;
  width: ${layoutWidth};
`

const ListWrapper = styled.div`
  width: ${layoutWidth};
`

const TitleWrapper = styled.div`
  display: grid;
  grid-column-gap: 20px;
  grid-template-columns: ${userPicSize} auto;
  grid-template-rows: auto;
  margin-bottom: 40px;
  width: ${layoutWidth};
`

const UserNameWrapper = styled.div`
  grid-area: 1 / 2;
`

const InstructionsWrapper = styled.div`
  grid-area: 2 / 2;
`

const UserName = styled.span`
  color: ${props => props.theme.greyBlack};
`

export class GuestRentalSaleList extends React.Component {
  constructor(props) {
    super(props)
    const { onCancelClick, guestName, guestId, guestPic } = this.props
    this.state = {
      guestName,
      guestId,
      guestPic
    }
    this.handleOnCancelClick = onCancelClick
  }

  render() {
    const { guestName, guestId, guestPic } = this.state
    const { history, client, onRefreshProducts, allProducts, allCategories, productsLoading, accountFromRequest, currentOrderId, saleId } = this.props

    return (
      <ContentWrapper>
        <GoBackWrapper>
          <Button
            icon="FaArrowLeft"
            iconSideMargin="0.5rem"
            iconSize="1.25rem"
            key="goBack"
            onClickHandler={this.handleOnCancelClick}
            title="Go back to search results"
            backgroundColor="transparent"
            hoverBgColor="transparent"
            border="none"
            customPadding="0"
            customWidth="220px"
            fontSize="1rem"
            fontWeight="bold"
            hoverTextColor="greyDark"
            textcolor="greyShade"
          />
        </GoBackWrapper>
        <TitleWrapper>
          <RoundedAvatar imageURL={guestPic} inGrid="1 / 1 / span 2 / 2" size={userPicSize} />
          <UserNameWrapper>
            <H2 color="greyDark" size="2.25rem" marginBottom="0">
              <UserName>{guestName}</UserName>'s Sale
            </H2>
          </UserNameWrapper>
        </TitleWrapper>
        <ListWrapper>
          <RentalSalesPanelWrapper
            currentOrderId={currentOrderId}
            onRefreshProducts={onRefreshProducts}
            allProducts={allProducts}
            accountFromRequest={accountFromRequest}
            productsLoading={productsLoading}
            allCategories={allCategories}
            guestId={guestId}
            client={client}
            saleId={saleId}
            history={history}
          />
        </ListWrapper>
      </ContentWrapper>
    )
  }
}
