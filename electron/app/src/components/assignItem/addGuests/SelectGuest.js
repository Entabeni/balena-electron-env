import React, { useCallback, useState } from 'react'
import { debounce } from 'debounce'
import { withApollo } from 'react-apollo'
import { withToastManager } from 'react-toast-notifications'
import { GET_GUESTS_BY_CARD_QUERY } from '../../../pages/dashboard/schema'
import { ListGrid, SpinLoader, ListItemWrapper, ListItem, Par, Button } from 'es-components'
import { displayDateFormat, validateAgeVar, getAge, parseDate, algoliaMultiRequestForIndex } from 'es-libs'
const { ipcRenderer } = window.require('electron')

function isGuestDisabled(guest, account, ageVariant, orderSteps) {
  if (ageVariant) {
    if (
      guest.dateOfBirth &&
      validateAgeVar(ageVariant, account.ageCalculationMethod, account.endOfWinterSeasonMonth, account.ageCalculationDate)(displayDateFormat(guest.dateOfBirth))
    ) {
      return true
    }
  } else if (orderSteps && orderSteps.length && orderSteps.findIndex(step => step === 'signWaivers') !== -1) {
    if (guest.dateOfBirth === null || getAge(parseDate(guest.dateOfBirth)) >= parseInt(account.ageOfMajority, 10)) {
      return false
    } else {
      return true
    }
  }
  return false
}

export const SelectGuest = withToastManager(
  withApollo(({ onSelect, ageVariant, account, client, orderSteps, toastManager, ...props }) => {
    const [searchText, setSearchText] = useState('')
    const [allGuests, setAllGuests] = useState([])
    console.log('🚀 ~ file: SelectGuest.js ~ line 32 ~ withApollo ~ allGuests', allGuests)
    const [useSearchError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [scanResult, setScanResult] = useState(false)
    const [scanning, setScanning] = useState(false)

    const handleScanClicked = () => {
      setScanning(true)
      setLoading(true)
      setSearchText('')
      ipcRenderer.send('scan-button')
      ipcRenderer.once('scan-reply', (event, arg) => {
        if (arg === 'OPEN-ERROR' || arg === 'SCAN-ERROR' || arg === 'NO-SCAN') {
          setScanning(false)
          setLoading(false)

          let text
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
          toastManager.add('Card Scanned, Searching...', { appearance: 'success', autoDismissTimeout: 3000, autoDismiss: true })

          client
            .query({
              query: GET_GUESTS_BY_CARD_QUERY,
              variables: {
                cardRfid: arg
              }
            })
            .then(res => {
              setScanning(false)
              setLoading(false)

              if (res.data.pos.allGuests.length) {
                setScanResult(true)
                setAllGuests(res.data.pos.allGuests)
              }
            })
        }
      })
    }
    const handleSearchChange = useCallback(searchText => {
      setScanResult(false)
      setLoading(true)
      setSearchText(searchText)
      const attributesToRetrieve =
        'firstName,objectID,lastName,fullName,email,dateOfBirth,phone,customerNumber,profilePictureUrl,avatar,height,weight,discipline,shoeSize,stance,level,type'

      let querySearchText = ''
      if (searchText) {
        querySearchText = searchText
      }

      const queries = [
        {
          indexName: 'guests',
          params: {
            filters: '',
            hitsPerPage: 300,
            attributesToRetrieve,
            query: querySearchText
          }
        },
        {
          indexName: 'staffUsers',
          params: {
            filters: '',
            hitsPerPage: 300,
            attributesToRetrieve,
            query: querySearchText
          }
        }
      ]

      algoliaMultiRequestForIndex(queries, (err, users) => {
        if (users) {
          setAllGuests(users)
          setLoading(false)
        }
      })
    }, [])

    return (
      <ListGrid
        {...props}
        listTitle="Guest List"
        searchTitle="Filter Guests..."
        onSearchChangeHandler={debounce(handleSearchChange, 1000)}
        hasScanButton
        scanning={scanning}
        handleScanClicked={handleScanClicked}
        listHeaders={[
          { title: 'Name', align: 'left' },
          { title: 'Email', align: 'left' },
          { title: 'Date of birth', align: 'left' },
          { title: 'Customer Number', align: 'left' },
          { title: 'Add', align: 'center' }
        ]}
        listColWidths="2fr 2fr 1fr 1fr 80px">
        {loading && <SpinLoader withWrapper size="80px" color="primary" />}
        {((!scanResult && searchText !== '') || scanResult) &&
          !loading &&
          allGuests.length > 0 &&
          allGuests.map((guest, index) => (
            <ListItemWrapper
              id={`guestItem_${index}`}
              key={guest.objectID || guest.id}
              difRowColor
              onClick={() => (!isGuestDisabled(guest, account, ageVariant, orderSteps) ? onSelect(guest) : null)}>
              <ListItem>
                <Par size="1rem" color="greyDark">
                  {guest.firstName} {guest.lastName}
                </Par>
              </ListItem>
              <ListItem>
                <Par size="1rem" color="greyDark">
                  {guest.email}
                </Par>
              </ListItem>
              <ListItem>
                <Par size="1rem" color="greyDark">
                  {guest.dateOfBirth ? displayDateFormat(guest.dateOfBirth) : 'Not set'}
                </Par>
              </ListItem>
              <ListItem>
                <Par size="1rem" color="greyDark">
                  {guest.customerNumber}
                </Par>
              </ListItem>
              <ListItem align="center">
                {isGuestDisabled(guest, account, ageVariant, orderSteps) ? (
                  <Button kind="redOutline" sizeH="short" customWidth="auto" icon="MdClear" iconSize="1em" rounded onClickHandler={() => null} />
                ) : (
                  <Button
                    id={`addGuestItem_${index}`}
                    kind="greenOutline"
                    sizeH="short"
                    customWidth="auto"
                    icon="IoMdPersonAdd"
                    iconSize="1em"
                    rounded
                    onClickHandler={() => onSelect(guest)}
                  />
                )}
              </ListItem>
            </ListItemWrapper>
          ))}
        {searchText !== '' && !loading && allGuests.length === 0 && (
          <Par margin="1em 7em 20em 15em" color="greyBlack" size="0.9rem">
            No Results
          </Par>
        )}
        {useSearchError && <Par>{useSearchError || 'Error'}</Par>}
        {searchText === '' && !scanResult && !loading && (
          <Par margin="1em 7em 20em 15em" color="greyBlack" size="0.9rem">
            Please use filter to see results.
          </Par>
        )}
      </ListGrid>
    )
  })
)
