import React from 'react'
import styled, { css } from 'styled-components'

// Component
import { ProductModal } from '../'
import { H2, Icon } from 'es-components'

import { displayDateFormat } from 'es-libs'

const MainWrapper = styled.div`
  max-height: 42rem;
  min-height: 42rem;
  padding-bottom: 1rem;
`

const InfoDetailsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 1rem 1rem 1rem 0.15rem;
  ${props =>
    props.margin
      ? css`
          margin: ${props.margin};
        `
      : null}
`

const DetailAttr = styled.p`
  border-bottom: 1px solid ${props => props.theme.grey};
  color: ${props => props.theme.greyDark};
  column-gap: 0.75rem;
  display: grid;
  flex-basis: ${props => (props.fullWidth ? '100%' : '50%')};
  font-size: 1rem;
  grid-template-columns: 24px 110px 1fr;
  grid-auto-flow: row;
  line-height: 1.15rem;
  margin: 0;
  min-height: 4rem;
  padding: 0.75rem 1rem;

  & > .icon {
    align-self: center;
    color: ${props => props.theme.grey};
  }
`

const DetailAttrLabel = styled.span`
  align-self: center;
  font-weight: 700;
`

const DetailAttrValue = styled.span`
  align-self: center;

  & > .fieldContainer {
    margin: 0;
  }

  &.paired-fields {
    display: flex;
    justify-content: space-between;

    & > .fieldContainer {
      width: 45%;
    }
  }

  .serial {
    & + .serial {
      margin-left: 3rem;
    }

    b {
      margin-right: 0.5rem;
    }
  }
`

export default function RentalAssetModal({ rentalAsset, onCancelClick, guestsWithOutstandingAssets }) {
  const guest = rentalAsset.outstandingGuest
  let outstandingAssets = []
  if (guest) {
    const guestAssets = guestsWithOutstandingAssets.find(guestAssets => guestAssets.guest.id === guest.id)
    if (guestAssets) {
      outstandingAssets = guestAssets.outstandingAssets
    }
  }

  if (guest && outstandingAssets && outstandingAssets.length) {
    return (
      <ProductModal height="94%" maxHeight="94%" title="Outstanding Rental Asset Info" onCancelHandler={onCancelClick} lightLayout closeIcon>
        <MainWrapper>
          <React.Fragment>
            <H2 color="greyDark" marginTop="1.5rem">
              Related Guest Info
            </H2>
            <InfoDetailsWrapper>
              <DetailAttr>
                <Icon name="FaIdCard" size="1.5rem" />
                <DetailAttrLabel>Full Name</DetailAttrLabel>
                <DetailAttrValue>{guest.fullName || 'N/A'}</DetailAttrValue>
              </DetailAttr>
              <DetailAttr>
                <Icon name="FaAt" size="1.5rem" />
                <DetailAttrLabel>Email</DetailAttrLabel>
                <DetailAttrValue>{guest.email || 'N/A'}</DetailAttrValue>
              </DetailAttr>
              <DetailAttr>
                <Icon name="FaPhone" size="1.5rem" />
                <DetailAttrLabel>Phone</DetailAttrLabel>
                <DetailAttrValue>{guest.phone || 'N/A'}</DetailAttrValue>
              </DetailAttr>
              <DetailAttr>
                <Icon name="FaCalendarDay" size="1.5rem" />
                <DetailAttrLabel>Date of Birth</DetailAttrLabel>
                <DetailAttrValue>{displayDateFormat(guest.dateOfBirth) || 'N/A'}</DetailAttrValue>
              </DetailAttr>
            </InfoDetailsWrapper>
          </React.Fragment>
          <React.Fragment>
            <H2 color="greyDark" marginTop="1.5rem">
              Assets outstanding for <b>{guest.fullName}</b>
            </H2>
            {outstandingAssets.map(outstandingAsset => (
              <InfoDetailsWrapper>
                <DetailAttr>
                  <Icon name="FaHashtag" size="1.5rem" />
                  <DetailAttrLabel>Asset Number</DetailAttrLabel>
                  <DetailAttrValue>{outstandingAsset.assetNumber || 'N/A'}</DetailAttrValue>
                </DetailAttr>
                <DetailAttr>
                  <Icon name="FaSignOutAlt" size="1.5rem" />
                  <DetailAttrLabel>Asset Class</DetailAttrLabel>
                  <DetailAttrValue>{outstandingAsset.assetClassName || 'N/A'}</DetailAttrValue>
                </DetailAttr>
                <DetailAttr>
                  <Icon name="FaRuler" size="1.5rem" />
                  <DetailAttrLabel>Size</DetailAttrLabel>
                  <DetailAttrValue>{outstandingAsset.size || 'N/A'}</DetailAttrValue>
                </DetailAttr>
                <DetailAttr>
                  <Icon name="FaCalendarDay" size="1.5rem" />
                  <DetailAttrLabel>Due Date</DetailAttrLabel>
                  <DetailAttrValue>{outstandingAsset.dueDate ? displayDateFormat(outstandingAsset.dueDate) : 'N/A'}</DetailAttrValue>
                </DetailAttr>
                <DetailAttr fullWidth>
                  <Icon name="FaBarcode" size="1.5rem" />
                  <DetailAttrLabel>Serials</DetailAttrLabel>
                  <DetailAttrValue>
                    {outstandingAsset.serial1 && (
                      <span className="serial">
                        <b>1.</b>
                        {outstandingAsset.serial1 || 'N/A'}
                      </span>
                    )}
                    {outstandingAsset.serial2 && (
                      <span className="serial">
                        <b>2.</b>
                        {outstandingAsset.serial2 || 'N/A'}
                      </span>
                    )}
                    {outstandingAsset.serial3 && (
                      <span className="serial">
                        <b>3.</b>
                        {outstandingAsset.serial3 || 'N/A'}
                      </span>
                    )}
                    {outstandingAsset.serial4 && (
                      <span className="serial">
                        <b>4.</b>
                        {outstandingAsset.serial4 || 'N/A'}
                      </span>
                    )}
                  </DetailAttrValue>
                </DetailAttr>
              </InfoDetailsWrapper>
            ))}
          </React.Fragment>
        </MainWrapper>
      </ProductModal>
    )
  } else {
    return (
      <ProductModal title="Outstanding Rental Asset Info" onCancelHandler={onCancelClick} lightLayout closeIcon>
        <MainWrapper>
          {guest ? (
            <React.Fragment>
              <H2 color="greyDark" marginTop="1.5rem">
                Related Guest Info
              </H2>
              <InfoDetailsWrapper>
                <DetailAttr>
                  <Icon name="FaIdCard" size="1.5rem" />
                  <DetailAttrLabel>Full Name</DetailAttrLabel>
                  <DetailAttrValue>{guest.fullName || 'N/A'}</DetailAttrValue>
                </DetailAttr>
                <DetailAttr>
                  <Icon name="FaAt" size="1.5rem" />
                  <DetailAttrLabel>Email</DetailAttrLabel>
                  <DetailAttrValue>{guest.email || 'N/A'}</DetailAttrValue>
                </DetailAttr>
                <DetailAttr>
                  <Icon name="FaPhone" size="1.5rem" />
                  <DetailAttrLabel>Phone</DetailAttrLabel>
                  <DetailAttrValue>{guest.phone || 'N/A'}</DetailAttrValue>
                </DetailAttr>
                <DetailAttr>
                  <Icon name="FaCalendarDay" size="1.5rem" />
                  <DetailAttrLabel>Date of Birth</DetailAttrLabel>
                  <DetailAttrValue>{displayDateFormat(guest.dateOfBirth) || 'N/A'}</DetailAttrValue>
                </DetailAttr>
              </InfoDetailsWrapper>
            </React.Fragment>
          ) : null}
          <InfoDetailsWrapper>
            <DetailAttr>
              <Icon name="FaHashtag" size="1.5rem" />
              <DetailAttrLabel>Asset Number</DetailAttrLabel>
              <DetailAttrValue>{rentalAsset.assetNumber || 'N/A'}</DetailAttrValue>
            </DetailAttr>
            <DetailAttr>
              <Icon name="FaSignOutAlt" size="1.5rem" />
              <DetailAttrLabel>Asset Class</DetailAttrLabel>
              <DetailAttrValue>{rentalAsset.assetClassName || 'N/A'}</DetailAttrValue>
            </DetailAttr>
            <DetailAttr>
              <Icon name="FaRuler" size="1.5rem" />
              <DetailAttrLabel>Size</DetailAttrLabel>
              <DetailAttrValue>{rentalAsset.size || 'N/A'}</DetailAttrValue>
            </DetailAttr>
            <DetailAttr>
              <Icon name="FaCalendarDay" size="1.5rem" />
              <DetailAttrLabel>Due Date</DetailAttrLabel>
              <DetailAttrValue>{rentalAsset.dueDate ? displayDateFormat(rentalAsset.dueDate) : 'N/A'}</DetailAttrValue>
            </DetailAttr>
            <DetailAttr fullWidth>
              <Icon name="FaBarcode" size="1.5rem" />
              <DetailAttrLabel>Serials</DetailAttrLabel>
              <DetailAttrValue>
                {rentalAsset.serial1 && (
                  <span className="serial">
                    <b>1.</b>
                    {rentalAsset.serial1 || 'N/A'}
                  </span>
                )}
                {rentalAsset.serial2 && (
                  <span className="serial">
                    <b>2.</b>
                    {rentalAsset.serial2 || 'N/A'}
                  </span>
                )}
                {rentalAsset.serial3 && (
                  <span className="serial">
                    <b>3.</b>
                    {rentalAsset.serial3 || 'N/A'}
                  </span>
                )}
                {rentalAsset.serial4 && (
                  <span className="serial">
                    <b>4.</b>
                    {rentalAsset.serial4 || 'N/A'}
                  </span>
                )}
              </DetailAttrValue>
            </DetailAttr>
          </InfoDetailsWrapper>
        </MainWrapper>
      </ProductModal>
    )
  }
}
