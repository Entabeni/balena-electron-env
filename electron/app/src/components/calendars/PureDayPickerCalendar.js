import React from 'react'
import styled from 'styled-components'
import DayPicker from 'react-day-picker'

// Styles
import 'react-day-picker/lib/style.css'

const DayPickerWrapper = styled.div`
  display: block;
  z-index: 7777777;
  background-color: ${props => props.theme.greyDark};
  position: absolute;
  border: 2px solid;
  border-color: ${props => props.theme.greyDark};
`

const StyledDayPicker = styled(DayPicker)`
  background-color: ${props => props.theme.white};

  .DayPicker-Day--activeSeason {
    color: ${props => props.theme.white};
    background-color: ${props => `rgba(${props.theme.primaryA}, 0.8)`};

    &:hover,
    &:focus {
      background-color: ${props => `rgba(${props.theme.secondaryA}, 1)`} !important;
    }
  }

  .DayPicker-Day--selected {
    background-color: ${props => `rgba(${props.theme.secondaryA}, 0.8)`} !important;

    &:hover,
    &:focus {
      background-color: ${props => `rgba(${props.theme.secondaryA}, 1)`} !important;
    }
  }
`

export function PureDayPickerCalendar({ onClick, selectedDays, id }) {
  const handleDayClick = day => {
    onClick(day)
  }

  let initial = new Date()
  if (selectedDays && selectedDays[0]) {
    initial = selectedDays[0]
  }

  return (
    <DayPickerWrapper id={id}>
      <StyledDayPicker selectedDays={selectedDays} fixedWeeks showOutsideDays onDayClick={handleDayClick} initialMonth={initial} />
    </DayPickerWrapper>
  )
}
