import React from 'react'
import styled from 'styled-components'

import { Button } from 'es-components'

import { EventCard } from './EventCard'

const EventListContainer = styled.div`
  padding: 1em;
`

export const EventList = ({ events, onEventGroupSelect, onNextClick, onCompleteClick, eventGroupsSelected, productItemEvents, currentEvent, totalEvents }) => {
  return (
    <EventListContainer>
      {events.map(event => (
        <EventCard
          key={event.id}
          event={event}
          onEventGroupSelect={onEventGroupSelect}
          eventGroupsSelected={eventGroupsSelected}
          productItemEvents={productItemEvents}
          currentEvent={currentEvent}
        />
      ))}
      {currentEvent === totalEvents - 1 ? (
        <Button
          title="Complete"
          kind="secondary"
          onClickHandler={onCompleteClick}
          disabled={eventGroupsSelected && productItemEvents[currentEvent].productItemId in eventGroupsSelected ? false : true}
        />
      ) : (
        <Button
          title="Next"
          kind="primary"
          onClickHandler={onNextClick}
          disabled={eventGroupsSelected && productItemEvents[currentEvent].productItemId in eventGroupsSelected ? false : true}
        />
      )}
    </EventListContainer>
  )
}
