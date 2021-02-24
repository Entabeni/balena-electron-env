import React, { useState } from 'react'
import styled from 'styled-components'

// Component
import { Modal } from '../Modal'
import { H4, Button, H2, Par, RoundedCheckboxInput, DatePickerInput } from 'es-components'
import { displayDateFormat, formatStandartDateForPicker } from 'es-libs'
import { withToastManager } from 'react-toast-notifications'
import { withApollo } from 'react-apollo'
import { GET_GUESTS_BY_CARD_QUERY } from '../../../pages/dashboard/schema'

const PrintModalContainer = styled.div`
  min-height: 100%;
  position: relative;
  padding-top: 80px;
  padding-bottom: 60px;
`

const GuestWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding-right: 1em;
`

const GuestBlock = styled.div`
  background-color: ${props => props.theme.greyTint};
  padding: 0.82em;
  margin-right: 1em;
  box-shadow: 2px 2px 2px rgba(100, 100, 100, 10%);
`

const ModalTitle = styled.header`
  min-width: 400px;
`

const ModalHeader = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 80px;
  padding: 1em 0 1em 1em;
`

const ModalFooter = styled.footer`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  width: 100%;
  padding: 0 1em;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
`

const ShippingInfo = styled.div`
  width: 165px;
  height: auto;
`

const PrintModal = withApollo(
  withToastManager(
    ({
      title,
      subTitle,
      children,
      saleNumber,
      addBorder,
      primaryBtnTitle,
      primaryBtnDisabled,
      onPrimaryBtnHandler,
      secondaryBtnTitle,
      onSecondaryBtnHandler,
      onCancelHandler,
      upperBtnTitle,
      upperBtnLoading,
      hasVerify,
      upperBtnHandler,
      scanWidth,
      colWidth = false,
      upperBtnCheckbox = false,
      toastManager,
      client,
      checkBoxValue,
      shippedAt
    }) => {
      const [hasShipped, setHasShipped] = useState(checkBoxValue)
      const shippedAtValueForPicker = shippedAt != null ? displayDateFormat(shippedAt) : formatStandartDateForPicker(new Date())
      const shippedAtValueForRequest = shippedAt || new Date()
      const [guests, setGuests] = useState([])

      const searchRfid = card => {
        toastManager.add('Card Scanned, Searching...', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 3000 })

        client
          .query({
            query: GET_GUESTS_BY_CARD_QUERY,
            variables: { cardRfid: card }
          })
          .then(res => {
            if (res.data.pos.allGuests) {
              toastManager.add('Search Sucecess', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 3000 })
              const guests = res.data.pos.allGuests.map(({ firstName, lastName }) => {
                return `${firstName} ${lastName}`
              })
              setGuests(guests)
            } else {
              toastManager.add('No Results', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 3000 })
            }
          })
          .catch(err => {
            toastManager.add('An error occured.', { appearance: 'error', autoDismiss: true })
          })
      }
      let modalBaseSetUp = {
        dropShadow: '0 0 20px 0 rgba(0, 0, 0, 0.75)',
        height: 'auto',
        padding: '3rem 4rem',
        width: scanWidth ? '60%' : '80%',
        zIndex: scanWidth ? '2800' : '1800'
      }
      return (
        <Modal {...modalBaseSetUp}>
          <PrintModalContainer>
            <ModalHeader>
              <ModalTitle>
                <H2 id="printModalTitle" color="greyDark" size="2rem" data={saleNumber}>
                  {title}
                </H2>
                <Par color="greyDark" margin="0" size="1.5rem">
                  {subTitle}
                </Par>
              </ModalTitle>
              {upperBtnTitle && upperBtnHandler && upperBtnCheckbox && (
                <ShippingInfo>
                  <RoundedCheckboxInput
                    label={upperBtnTitle}
                    reverse={true}
                    className="filter-search-checkbox"
                    id="hasShipped"
                    onClickHandler={(id, value) => {
                      setHasShipped(!hasShipped)
                      upperBtnHandler(value, shippedAtValueForRequest)
                    }}
                    loading={upperBtnLoading}
                    checked={checkBoxValue || false}
                  />
                  {hasShipped && (
                    <DatePickerInput
                      height="35px"
                      marginTop="15px"
                      marginBottom="1px"
                      onCalendarClick={(val, id, date) => {
                        upperBtnHandler(hasShipped, date)
                      }}
                      onClick={() => {}}
                      id="shippedAt"
                      field="shippedAt"
                      value={shippedAtValueForPicker}
                      autoComplete="off"
                      border="none"
                    />
                  )}
                </ShippingInfo>
              )}
              {hasVerify && (
                <>
                  {guests && guests.length > 0 && (
                    <GuestWrap>
                      {guests.map(guest => (
                        <GuestBlock>
                          <H4 key={guest}>{guest}</H4>
                        </GuestBlock>
                      ))}
                    </GuestWrap>
                  )}
                  {/* <ScanButton searchByCardRfid={rfid => searchRfid(rfid)}>
                    {({ scanning, handleScanCard }) => (
                      <Button
                        margin="0 0 0 0"
                        title="Verify"
                        sizeH="tall"
                        sizeW="widest"
                        kind="tertiary"
                        loading={scanning}
                        onClickHandler={() => handleScanCard()}
                      />
                    )}
                  </ScanButton> */}
                </>
              )}
            </ModalHeader>
            <>{children}</>
            <ModalFooter>
              {secondaryBtnTitle && onSecondaryBtnHandler && (
                <Button title={secondaryBtnTitle} kind="tertiary" rounded onClickHandler={onSecondaryBtnHandler} />
              )}

              {onCancelHandler && <Button title="Cancel" kind="greyOutline" rounded onClickHandler={onCancelHandler} />}
              {onPrimaryBtnHandler && (
                <Button margin="0 0 0 1em" title={primaryBtnTitle} kind="primary" rounded disabled={primaryBtnDisabled} onClickHandler={onPrimaryBtnHandler} />
              )}
            </ModalFooter>
          </PrintModalContainer>
        </Modal>
      )
    }
  )
)

export default PrintModal
