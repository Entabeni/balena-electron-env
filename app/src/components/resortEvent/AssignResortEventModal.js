import React, { useEffect, useState } from 'react'
import { DateUtils } from 'react-day-picker'
import { parseDate } from 'es-libs'
import { gql } from 'apollo-boost'

import styled from 'styled-components'

import { ResortEventModal, DayPickerCalendar, ResortEventEduCard, SelectInput, SpinLoader } from 'es-components'

const GridContainer = styled.div`
  margin-top: 1em;
  display: grid;
  grid-template-columns: 275px 1fr;
  grid-gap: 1.2rem;
`

const NumTicketsAvailable = styled.div`
  margin-bottom: 1rem;
`

const GET_RESORT_EVENT_AVAILABILITIES = gql`
  query GetProductById($id: String!) {
    pos {
      product(id: $id) {
        id
        allAvailabilities {
          availableForSale
          day
        }
      }
    }
  }
`

export default ({ productSelected, onDateQuantitySelected, onCancelClick, client }) => {
  const [dateSelected, selectDate] = useState(null)
  const [showLoader, setShowLoader] = useState(true)
  const [quantitySelected, selectQuantity] = useState(0)
  const [availabilitiesSorted, setAvailabilitiesSorted] = useState([])

  let availabilitySelected = null
  if (dateSelected) {
    availabilitySelected = availabilitiesSorted.find(availability => DateUtils.isSameDay(parseDate(availability.day), dateSelected))
  }

  useEffect(() => {
    client.query({ query: GET_RESORT_EVENT_AVAILABILITIES, variables: { id: productSelected.id } }).then(result => {
      if (!!result && result.data.pos.product) {
        const { allAvailabilities } = result.data.pos.product
        if (allAvailabilities && allAvailabilities.length > 0) {
          const allAailabilitiesSorted = allAvailabilities ? allAvailabilities.sort((a, b) => parseDate(a.day).getTime() - parseDate(b.day).getTime()) : []
          setAvailabilitiesSorted(allAailabilitiesSorted)
        }
      } else {
        throw new Error('There was an error with the response from the server.')
      }
      setShowLoader(false)
    })
  }, [])

  const renderBody = () => {
    return (
      <GridContainer>
        <DayPickerCalendar
          width="100%"
          initialMonth={availabilitiesSorted.length > 0 ? parseDate(availabilitiesSorted[0].day) : null}
          disabledDays={day => {
            return availabilitiesSorted.length > 0
              ? availabilitiesSorted.findIndex(availability => DateUtils.isSameDay(parseDate(availability.day), day)) === -1
              : false
          }}
          daySelected={dateSelected}
          onDateSelected={day => {
            selectDate(day)
          }}
          days={availabilitiesSorted.map(availability => availability.day)}
        />
        {availabilitySelected ? (
          <div style={{ paddingRight: '1em' }}>
            <NumTicketsAvailable>Number of tickets available: {availabilitySelected.availableForSale}</NumTicketsAvailable>
            {availabilitySelected.availableForSale > 0 && (
              <SelectInput
                id="numberOfTickets"
                field="resortEventQuantity"
                placeholder="Number of tickets"
                onChange={value => selectQuantity(value.value)}
                options={Array(availabilitySelected.availableForSale)
                  .fill()
                  .map((_, index) => {
                    return { label: `${index + 1} Ticket${index + 1 > 1 ? 's' : ''}`, value: index + 1 }
                  })}
              />
            )}
          </div>
        ) : (
          <ResortEventEduCard />
        )}
      </GridContainer>
    )
  }

  return (
    <ResortEventModal
      title={productSelected.name}
      subTitle="Choose a date and quantity of tickets for the event."
      onPrimaryBtnHandler={() => {
        onDateQuantitySelected(dateSelected, quantitySelected)
      }}
      onCancelHandler={onCancelClick}
      primaryBtnTitle="Complete"
      primaryBtnDisabled={availabilitySelected == null || (availabilitySelected != null && availabilitySelected.availableForSale === 0)}>
      {showLoader ? <SpinLoader withWrapper size="80px" color="primary" /> : renderBody()}
    </ResortEventModal>
  )
}
