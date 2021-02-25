import React, { useCallback } from 'react'
import { Table, LazyTable, SpinLoader } from 'es-components'
import { GuestRow } from './GuestRow'
import { withApollo } from 'react-apollo'
import { GET_GUEST_DETAILS_BY_ID } from '../../pages/dashboard/schema'
const rowsToShow = 10

const tableCols = [
  { leftAligned: true, text: 'First Name' },
  { leftAligned: true, text: 'Last Name' },
  { leftAligned: true, text: 'Email' },
  'Date of Birth',
  'Customer Number',
  { celltype: 'action-cell', text: '' }
]
const cellCustomWidths = { '2': 1.5, '5': 0.75 }
export const GuestTable = withApollo(
  ({
    useFilterString,
    searchText,
    attributesToSearchFor,
    client,
    scanning,
    cardScanTable,
    baseQueryConfig,
    imageButtonLoading,
    useGuestsFromCard,
    guestSelectedForPictureUpload,
    setGuestPictureModalOpen,
    setGuestSelectLoading,
    setGuestSelected,
    setGuestSelectedForPictureUpload
  }) => {
    const guestSelectHandler = guestId => {
      setGuestSelectLoading(true)
      client.query({ query: GET_GUEST_DETAILS_BY_ID, variables: { id: guestId } }).then(result => {
        const { guest } = result.data.pos
        if (guest) {
          setGuestSelectLoading(false)
          setGuestSelected(guest)
        }
      })
    }

    let queryConfig =
      searchText !== '' || useFilterString
        ? {
            ...baseQueryConfig,
            variables: { searchTerm: searchText, filterString: useFilterString, restrictSearchableAttributes: attributesToSearchFor }
          }
        : {}
    const renderGuestsList = data => {
      let allGuests = data

      return allGuests.map((guest, index) => {
        return (
          <GuestRow
            guest={guest}
            index={index}
            guestSelectHandler={guestSelectHandler}
            imageButtonLoading={imageButtonLoading}
            guestSelectedForPictureUpload={guestSelectedForPictureUpload}
            setGuestPictureModalOpen={setGuestPictureModalOpen}
            setGuestSelectedForPictureUpload={setGuestSelectedForPictureUpload}></GuestRow>
        )
      })
    }
    return cardScanTable ? (
      <Table
        lightTheme
        noResultsMessage="No Results"
        headerData={tableCols}
        headerStyles={{ borderTop: true }}
        cellCustomWidths={cellCustomWidths}
        verticalScroll={rowsToShow}>
        {scanning ? (
          <SpinLoader withWrapper size="80px" color="primary" />
        ) : (
          useGuestsFromCard.map((guest, index) => {
            return (
              <GuestRow
                guest={guest}
                index={index}
                guestSelectHandler={guestSelectHandler}
                imageButtonLoading={imageButtonLoading}
                guestSelectedForPictureUpload={guestSelectedForPictureUpload}
                setGuestPictureModalOpen={setGuestPictureModalOpen}
                setGuestSelectedForPictureUpload={setGuestSelectedForPictureUpload}></GuestRow>
            )
          })
        )}
      </Table>
    ) : (
      <LazyTable
        lightTheme
        cellCustomWidths={cellCustomWidths}
        headerData={tableCols}
        onSuccess={renderGuestsList}
        queryConfig={queryConfig}
        verticalScroll={rowsToShow}
      />
    )
  }
)

export default GuestTable
