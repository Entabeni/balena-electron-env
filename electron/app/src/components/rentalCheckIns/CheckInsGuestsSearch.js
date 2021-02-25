import React, { useState } from 'react'
import { withToastManager } from 'react-toast-notifications'
import { withApollo } from 'react-apollo'

// Components
import { H2, ModalSearchTextInput, Button } from 'es-components'

// Styling
import styled from 'styled-components'
import { flexCenterItem } from '../utils'
const { ipcRenderer } = window.require('electron')

const fieldWidth = '680px'

const SearchFormWrapper = styled.div`
  ${flexCenterItem}
  flex-direction: column;
  grid-row: span 2;
  transform: translateY(50%);
`

const ButtonsWrapper = styled.div`
  ${flexCenterItem}
  justify-content: space-between;
  width: ${fieldWidth};
`

const inputGroupStylingProps = {
  borderRadius: '0',
  marginBottom: '1.5rem',
  padding: '1.25rem',
  width: fieldWidth
}

const searchInputStylingProps = {
  color: 'greyDark',
  fontSize: '1.25rem',
  width: 'calc(100% - 2.25rem)'
}

export const CheckInsGuestsSearchInner = ({ onSearch, client, toastManager }) => {
  const [useSearchString, setSearchString] = useState(null)
  const [scanning, setScanning] = useState(null)

  const onChangeSearch = searchString => {
    setSearchString(searchString)
  }

  const handleScanClicked = () => {
    setScanning(true)
    ipcRenderer.send('scan-button')
    ipcRenderer.once('scan-reply', (event, arg) => {
      if (arg === 'OPEN-ERROR' || arg === 'SCAN-ERROR' || arg === 'NO-SCAN') {
        let text
        setScanning(false)

        switch (arg) {
          case 'OPEN-ERROR':
            text = 'Error connecting to scanner'
            break
          case 'SCAN-ERROR':
            text = 'Error writing to scanner'
            break
          case 'NO-SCAN':
            text = 'Card not detected'
            break
          default:
            text = 'An error occured'
        }
        toastManager.add(text, {
          appearance: 'error',
          autoDismissTimeout: 3000,
          autoDismiss: true
        })
      } else {
        onSearch(arg)
        setScanning(false)
      }
    })
  }

  const onSearchButtonClick = () => {
    if (onSearch) {
      onSearch(useSearchString)
    }
  }

  return (
    <SearchFormWrapper>
      <>
        <H2 size="3rem" marginBottom="spacingLrg">
          Rental Check-Ins
        </H2>
        <ModalSearchTextInput
          onChangeSearchInput={onChangeSearch}
          onEnterClick={() => onSearchButtonClick()}
          searchTitle="Search by first name, last name, date of birth or scan RFID card"
          inputGroupStyling={inputGroupStylingProps}
          styling={searchInputStylingProps}
          bgColor="white"
          value={useSearchString}
          iconSize="2.25rem"
        />
        <ButtonsWrapper>
          <Button
            title="Scan Card"
            sizeW="widest"
            margin="0"
            loading={scanning}
            weight="500"
            fontSize="1.8rem"
            textcolor="white"
            kind="primary"
            borderColor="primary"
            onClickHandler={() => {
              handleScanClicked()
              setSearchString(null)
            }}
          />
          <Button title="Show Check-Ins" sizeW="widest" margin="0" weight="500" fontSize="1.8rem" kind="primary" onClickHandler={() => onSearchButtonClick()} />
        </ButtonsWrapper>
      </>
    </SearchFormWrapper>
  )
}
export const CheckInsGuestsSearch = withApollo(withToastManager(CheckInsGuestsSearchInner))
