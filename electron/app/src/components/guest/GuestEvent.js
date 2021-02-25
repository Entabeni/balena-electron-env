import React, { useState } from 'react'
import { ApolloConsumer } from 'react-apollo'
import { withToastManager } from 'react-toast-notifications'

import { LazyTable, TableRow, TableCellData, Button, EventWizard } from 'es-components'
import { parseDateToFormat } from 'es-libs'
import { GET_EVENT_LINE_ITEMS_BY_GUEST_QUERY, UPDATE_EVENT_LINE_ITEM } from './../../pages/dashboard/schema'

const rowsToShow = 8

// Event line items modal table setup
const eventLineItemsBaseQueryConfig = {
  noResultsMessage: 'There are not matching events to show',
  query: GET_EVENT_LINE_ITEMS_BY_GUEST_QUERY,
  type: 'graphql'
}
const eventLineItemsTableCols = [{ leftAligned: true, text: 'Event' }, { leftAligned: true, text: 'Event Group' }, 'Start Time']
const eventLineItemsCellCustomWidths = { '2': 0.75 }

export const GuestEvent = withToastManager(({ guest, account, toastManager }) => {
  const [useSelectedEvent, setSelectedEvent] = useState()
  const [useSelectedEventLineItemId, setSelectedEventLineItemId] = useState(null)
  const [useProductItemId, setProductItemId] = useState(null)
  const [useAvailableEvents, setAvailableEvents] = useState([])

  const editEvent = (useSelectedEventLineItemId, productItemId, availableEvents) => {
    this.setState({ useSelectedEventLineItemId, productItemId, availableEvents })
  }

  const handleEventsSelected = (event, client) => {
    client
      .mutate({
        mutation: UPDATE_EVENT_LINE_ITEM,
        variables: {
          ...event[useProductItemId],
          id: useSelectedEventLineItemId
        }
      })
      .then(res => {
        setSelectedEventLineItemId(null)
        toastManager.add('Event updated successfully.', { appearance: 'success', autoDismissTimeout: 3000, autoDismiss: true })
      })
  }

  const renderEventsSelection = () => {
    let productItemEvents = [
      {
        productItemId: useProductItemId,
        required: true,
        canCreate: false,
        default: false,
        eventIds: useAvailableEvents.map(event => event.id),
        eventText: 'Choose Event',
        rank: 0
      }
    ]

    return (
      <ApolloConsumer>
        {client => (
          <>
            <Button
              margin="7px 0"
              kind="primary"
              hoverBgColor="red"
              title="Back"
              onClickHandler={() => {
                setSelectedEventLineItemId(null)
                setProductItemId(null)
                setAvailableEvents(null)
              }}
            />
            <EventWizard
              hideHeader={true}
              client={client}
              createdEvent={useSelectedEvent}
              onSelect={handleEventsSelected}
              eventRules={''}
              productItemEvents={productItemEvents}
            />
          </>
        )}
      </ApolloConsumer>
    )
  }

  const renderEventsLineItems = data => {
    const guest = data.pos.guest
    const events = guest.eventLineItems
    return events.map(({ eventName, id, productItemId, event, availableEvents }) => (
      <TableRow key={event.id} className="clickable-row" onClickHandler={() => editEvent(id, productItemId, availableEvents)}>
        <TableCellData leftAligned>{eventName}</TableCellData>
        <TableCellData leftAligned>
          {event.eventEventGroups[0] && event.eventEventGroups[0].eventGroup ? event.eventEventGroups[0].eventGroup.name : ''}
        </TableCellData>
        <TableCellData>{parseDateToFormat(`${event.day} ${event.startTime}`, account)}</TableCellData>
      </TableRow>
    ))
  }

  const renderEventLineItemsTable = () => {
    return (
      <LazyTable
        lightTheme
        cellCustomWidths={eventLineItemsCellCustomWidths}
        headerData={eventLineItemsTableCols}
        onSuccess={data => renderEventsLineItems(data)}
        queryConfig={{ ...eventLineItemsBaseQueryConfig, variables: { id: guest.id } }}
        verticalScroll={rowsToShow}
      />
    )
  }

  if (useSelectedEventLineItemId) {
    return renderEventsSelection()
  } else {
    return renderEventLineItemsTable()
  }
})
