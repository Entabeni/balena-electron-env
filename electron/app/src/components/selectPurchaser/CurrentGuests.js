import React from 'react'

import { ListGrid, ListItemWrapper, ListItem, Par, RadioInput } from 'es-components'

export const CurrentGuests = ({ currentGuests }) => {
  return (
    <ListGrid
      listTitle="Guest List"
      hideSearch
      listHeaders={[
        { title: 'Name', align: 'left' },
        { title: 'Email', align: 'left' },
        { title: 'Add', align: 'left' }
      ]}
      listColWidths="1fr 1fr 130px">
      {currentGuests.map(guest => {
        if (guest == null) {
          return null
        }
        return (
          <ListItemWrapper key={guest.id} difRowColor>
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
              <RadioInput id={`guest_${guest.id}`} radioValue={guest.id} />
            </ListItem>
          </ListItemWrapper>
        )
      })}
    </ListGrid>
  )
}
