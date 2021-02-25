import React from 'react'
import styled from 'styled-components'

import { Button } from 'es-components'
import { displayTimeFormat } from 'es-libs'

const CardContainer = styled.div`
  background-color: ${props => props.theme.white};
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: $white;
  padding: 1em;
  position: relative;
  overflow: hidden;
  box-shadow: 2px 2px 2px rgba(100, 100, 100, 10%);
  border: solid 1px ${props => props.theme.grey};

  &:not(:last-child) {
    margin-bottom: 1em;
  }
`

const CardRow = styled.div`
  display: flex;
  width: 100%;

  button {
    margin-right: 1rem;
  }

  &:first-child {
    margin-bottom: 1em;
  }
`

const CardName = styled.div`
  flex: 1;
`

const CardTime = styled.div`
  width: 70px;
  text-align: right;
`

const CardSpots = styled.div`
  margin-left: 1rem;
  width: 70px;
  text-align: right;
  color: ${props => {
    const spotsLeft = parseFloat(props.spots.split('/')[0], 10)
    const spotsTotal = parseFloat(props.spots.split('/')[1], 10)
    if (spotsLeft / spotsTotal > 0.5) {
      return props.theme.greenShade
    }
    if (spotsLeft / spotsTotal > 0.25) {
      return props.theme.orange
    }
    return props.theme.red
  }};
`

const EventGroupWrapper = styled.div`
  span {
    color: ${props => props.theme.greyShade};
    display: block;
    font-size: 0.825rem;
    margin: 0.5rem 1.15rem 0 0;
    text-align: right;
  }
`

export const EventCard = ({ event, onEventGroupSelect, eventGroupsSelected, productItemEvents, currentEvent }) => {
  return (
    <CardContainer>
      <CardRow>
        <CardName>{event.name}</CardName>
        <CardTime>{displayTimeFormat(event.startTime)}</CardTime>
        <CardSpots spots={event.spots}>{event.spots}</CardSpots>
      </CardRow>
      <CardRow>
        {event.eventEventGroups.map(eventEventGroup => {
          const assignedGuests = JSON.parse(eventEventGroup.guestIds).length
          return (
            <EventGroupWrapper>
              <Button
                key={eventEventGroup.id}
                title={eventEventGroup.eventGroup.name}
                kind={
                  eventGroupsSelected &&
                  productItemEvents[currentEvent].productItemId in eventGroupsSelected &&
                  eventGroupsSelected[productItemEvents[currentEvent].productItemId].eventId === event.id &&
                  eventGroupsSelected[productItemEvents[currentEvent].productItemId].eventGroupId === eventEventGroup.eventGroup.id
                    ? 'primary'
                    : 'greyOutline'
                }
                onClickHandler={() =>
                  onEventGroupSelect({
                    eventId: event.id,
                    eventGroupId: eventEventGroup.eventGroup.id,
                    eventDay: event.day
                  })
                }
              />
              <span>{!assignedGuests ? 'No guests assigned yet' : `${assignedGuests} guest${assignedGuests > 1 ? 's' : ''} already assigned`}</span>
            </EventGroupWrapper>
          )
        })}
      </CardRow>
    </CardContainer>
  )
}
