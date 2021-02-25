import React from 'react'
import styled from 'styled-components'
import { DatePickerInput } from 'es-components'

const InputWrapper = styled.div`
  margin-top: 20px;
`

export class MaskedFromToInput extends React.Component {
  state = {
    fromDateValue: null,
    toDateValue: null
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.fromDateValue !== this.props.fromDateValue) {
      if (nextProps.fromDateValue === null) {
        this.setState({ fromDateValue: null })
      }
    }
    if (nextProps.toDateValue !== this.props.toDateValue) {
      if (nextProps.toDateValue === null) {
        this.setState({ toDateValue: null })
      }
    }
  }

  checkButtonAvailability = () => {
    const { fromDateValue, toDateValue } = this.state
    if (fromDateValue != null && toDateValue != null) {
      this.props.onCheckButtonAvailability(fromDateValue, toDateValue)
    } else {
      this.props.onCheckButtonAvailability(fromDateValue, toDateValue)
    }
  }

  handleInputClick = id => {
    if (id === 'fromDate') {
      this.toDate.hideDatePickerCalendar()
    }
    if (id === 'toDate') {
      this.fromDate.hideDatePickerCalendar()
    }
  }

  onChangeDates = (val, id) => {
    if (id === 'fromDate') {
      this.setState({ fromDateValue: val }, this.checkButtonAvailability)
    }
    if (id === 'toDate') {
      this.setState({ toDateValue: val }, this.checkButtonAvailability)
    }
  }

  render() {
    const { dateToPlaceholder, dateFromPlaceholder } = this.props

    return (
      <InputWrapper>
        <DatePickerInput
          ref={ref => (this.fromDate = ref)}
          onCalendarClick={this.onChangeDates}
          onClick={this.handleInputClick}
          id="fromDate"
          field="fromDate"
          value={this.state.fromDateValue}
          label={dateFromPlaceholder}
          autoComplete="off"
          border="none"
          interBlock
        />
        <DatePickerInput
          ref={ref => (this.toDate = ref)}
          onCalendarClick={this.onChangeDates}
          onClick={this.handleInputClick}
          id="toDate"
          field="toDate"
          value={this.state.toDateValue}
          label={dateToPlaceholder}
          autoComplete="off"
          border="none"
          interBlock
        />
      </InputWrapper>
    )
  }
}
