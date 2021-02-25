import React from 'react'

import { Button, TableRow, TableCellData } from 'es-components'

import { displayDateFormat } from 'es-libs'
export const GuestRow = React.memo(
  ({ guest, index, guestSelectHandler, imageButtonLoading, guestSelectedForPictureUpload, setGuestPictureModalOpen, setGuestSelectedForPictureUpload }) => {
    return (
      <TableRow
        id={`guestRow_${index}`}
        key={`tr-gui-${guest.objectID || guest.id}`}
        className="clickable-row"
        onClickHandler={() => guestSelectHandler(guest.objectID || guest.id)}>
        <TableCellData leftAligned>{guest.firstName}</TableCellData>
        <TableCellData leftAligned>{guest.lastName}</TableCellData>
        <TableCellData leftAligned>{guest.email}</TableCellData>
        <TableCellData>{displayDateFormat(guest.dateOfBirth)}</TableCellData>
        <TableCellData>{guest.customerNumber}</TableCellData>
        <TableCellData celltype="action-cell">
          <Button
            kind="primary"
            hoverBgColor="red"
            loading={
              imageButtonLoading &&
              ((guest.objectID && guest.objectID === guestSelectedForPictureUpload.objectID) || (guest.id && guest.id === guestSelectedForPictureUpload.id))
            }
            icon={guest.profilePictureUrl ? 'FaImage' : 'MdAddAPhoto'}
            iconSize="1.25rem"
            onClickHandler={event => {
              event.stopPropagation()
              setGuestPictureModalOpen(true)
              setGuestSelectedForPictureUpload(guest)
            }}
          />
        </TableCellData>
      </TableRow>
    )
  }
)
