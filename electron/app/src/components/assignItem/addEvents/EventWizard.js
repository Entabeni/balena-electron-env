import React from 'react'
import { Query } from 'react-apollo'
import styled from 'styled-components'
import dayjs from 'dayjs'
import classNames from 'classnames'
import { DateUtils } from 'react-day-picker'

import { BasicForm, DayPickerCalendar, EventEduCard, SpinLoader } from 'es-components'
import { parseDate } from 'es-libs'

import { EventList } from './EventList'

import { GET_EVENTS_QUERY } from './schema/eventSchema'

const EventSteps = styled.section`
  display: flex;
  justify-content: stretch;
  align-content: stretch;
  align-items: stretch;
  height: 40px;
`

const EventStep = styled.span`
  color: ${props => props.theme.white};
  font-weight: bold;
  font-size: 0.8em;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: ${props => props.theme.greyTint};
  border-right: 1px solid ${props => props.theme.white};

  &.active {
    background-color: ${props => props.theme.primary};
  }

  &.complete {
    background-color: ${props => props.theme.secondary};
  }
`

const MainContainer = styled.article`
  height: 100%;
  max-height: 100%;
  overflow-y: hidden;
`

const EventContainer = styled.section`
  background-color: ${props => props.theme.greyLight};
  height: calc(100% - 40px);
  max-height: calc(100% - 40px);
  overflow-y: hidden;
`

const EventForm = styled(BasicForm)`
  padding: 0 !important;
  height: 100%;
  max-height: 100% !important;
  min-height: 100% !important;
  overflow-y: hidden;
`

const FormWrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(250px, 280px) 1fr;
  grid-template-rows: 100%;
  height: 100%;
  max-height: 100%;
  overflow-y: hidden;
`

const FormLeft = styled.div`
  border-right 1px solid ${props => props.theme.black};
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`

const FormRight = styled.div`
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`

function daysFilter(event, eventRules, dateSelected, currentEvent) {
  if ((eventRules === 'sameDay' && currentEvent > 0) || (eventRules === 'sequentialDays' && currentEvent > 0)) {
    return DateUtils.isSameDay(parseDate(event.day), dateSelected)
  }
  return true
}

export class EventWizard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentEvent: 0,
      dateSelected: (props.createdEvent && props.createdEvent.day) || null,
      eventGroupsSelected: null
    }
  }

  selectDate = day => {
    this.setState({ dateSelected: day })
  }

  setEvent = event => {
    this.setState({ currentEvent: event })
  }

  selectEventGroup = eventGroup => {
    this.setState({ eventGroupsSelected: eventGroup })
  }

  render() {
    const { productItemEvents, eventRules, onSelect, createdEvent, hideHeader, client } = this.props
    const { currentEvent, dateSelected, eventGroupsSelected } = this.state
    const productItemEventsRequired = productItemEvents.filter(productItem => productItem.required && !productItem.default).sort((a, b) => a.rank - b.rank)
    return (
      <MainContainer>
        {!hideHeader && (
          <EventSteps>
            {productItemEventsRequired.map((productItemEvent, index) => {
              const eventStepClass = classNames({
                active: currentEvent === index,
                complete: currentEvent > index
              })
              return (
                <EventStep key={productItemEvent.productItemId} className={eventStepClass}>
                  {productItemEvent.eventText ? productItemEvent.eventText : `Event ${index + 1}`}
                </EventStep>
              )
            })}
          </EventSteps>
        )}
        <EventContainer>
          <Query query={GET_EVENTS_QUERY} variables={{ eventIds: productItemEventsRequired[currentEvent].eventIds }}>
            {({ loading, error, data }) => {
              if (loading) return <SpinLoader withWrapper="calc(100% - 40px)" size="80px" color="primary" />
              if (error) return `Error! ${error.message}`

              const { allEvents } = data.pos
              if (createdEvent && !allEvents.find(event => event.id === createdEvent.id)) {
                allEvents.push(createdEvent)
              }
              const eventsSorted = allEvents.sort((a, b) => parseDate(a.day).getTime() - parseDate(b.day).getTime())

              return (
                <EventForm>
                  <FormWrapper>
                    <FormLeft>
                      <DayPickerCalendar
                        selectedDay={dateSelected}
                        onDateSelected={day => this.selectDate(day)}
                        days={eventsSorted.filter(event => daysFilter(event, eventRules, dateSelected, currentEvent)).map(event => event.day)}
                        disabledDays={day => {
                          if ((eventRules === 'sameDay' && currentEvent > 0) || (eventRules === 'sequentialDays' && currentEvent > 0)) {
                            return !DateUtils.isSameDay(day, dateSelected)
                          }
                          return eventsSorted.findIndex(event => DateUtils.isSameDay(parseDate(event.day), day)) === -1
                        }}
                      />
                    </FormLeft>
                    <FormRight>
                      {dateSelected ? (
                        <EventList
                          events={eventsSorted.filter(
                            event =>
                              (dayjs(event.day, 'YYYY-MM-DD').format('YYYY-MM-DD') === dayjs(dateSelected).format('YYYY-MM-DD') && !eventGroupsSelected) ||
                              (dayjs(event.day, 'YYYY-MM-DD').format('YYYY-MM-DD') === dayjs(dateSelected).format('YYYY-MM-DD') &&
                                Object.keys(eventGroupsSelected).findIndex(
                                  productItemId =>
                                    productItemId !== productItemEventsRequired[currentEvent].productItemId &&
                                    eventGroupsSelected[productItemId].eventId === event.id
                                ) === -1)
                          )}
                          onEventGroupSelect={eventGroupSelection => {
                            const eventGroupsSelectedCopy = Object.assign({}, eventGroupsSelected)
                            eventGroupsSelectedCopy[productItemEventsRequired[currentEvent].productItemId] = eventGroupSelection
                            this.selectEventGroup(eventGroupsSelectedCopy)
                          }}
                          onNextClick={() => {
                            this.setEvent(currentEvent + 1)
                            if (eventRules === null) {
                              this.selectDate(null)
                            }
                            if (eventRules === 'sequentialDays') {
                              this.selectDate(
                                dayjs(dateSelected)
                                  .add(1, 'day')
                                  .toDate()
                              )
                            }
                          }}
                          onCompleteClick={client ? () => onSelect(eventGroupsSelected, client) : () => onSelect(eventGroupsSelected)}
                          productItemEvents={productItemEventsRequired}
                          eventGroupsSelected={eventGroupsSelected}
                          currentEvent={currentEvent}
                          totalEvents={productItemEventsRequired.length}
                        />
                      ) : (
                        <EventEduCard />
                      )}
                    </FormRight>
                  </FormWrapper>
                </EventForm>
              )
            }}
          </Query>
        </EventContainer>
      </MainContainer>
    )
  }
}
