import React from 'react'
import styled from 'styled-components'
import DayPicker from 'react-day-picker'

import { parseDate } from 'es-libs'

// Styles
import 'react-day-picker/lib/style.css'

const DayPickerWrapper = styled.div`
  display: block;
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

export class DayPickerCalendar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      daySelected: parseDate(props.selectedDay)
    }
  }

  selectDay = day => {
    this.setState({ daySelected: day })
  }

  handleDayClick = (day, { disabled }) => {
    const { onDateSelected } = this.props

    this.selectDay(day)
    if (!disabled && onDateSelected) {
      onDateSelected(day)
    }
  }

  render() {
    let { initialMonth, days, disabledDays, selectedDay } = this.props
    const { daySelected } = this.state

    const modifiers = {
      activeSeason: days.map(day => parseDate(day))
    }

    if (initialMonth == null) {
      initialMonth = new Date()
    }

    return (
      <DayPickerWrapper>
        <StyledDayPicker
          fixedWeeks
          showOutsideDays
          onDayClick={this.handleDayClick}
          selectedDays={selectedDay || selectedDay === null ? selectedDay : daySelected}
          disabledDays={disabledDays}
          modifiers={modifiers}
          initialMonth={initialMonth}
        />
      </DayPickerWrapper>
    )
  }
}
