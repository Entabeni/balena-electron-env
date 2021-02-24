import React from 'react'
import styled from 'styled-components'

import { PureDayPickerCalendar, MaskedTextInput } from 'es-components'
import { displayDateFormat, formatStandartDateForPicker } from 'es-libs'

const InputWrapper = styled.div`
  ${props => (props.selfContainer ? 'position: relative;' : '')}
`

export class DatePickerInput extends React.Component {
  state = {
    showDatePicker: false,
    valueForCalendar: null,
    value: this.props.value
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      if (nextProps.value === null) {
        this.setState({ value: null, valueForCalendar: null })
      }
    }
  }

  hideDatePickerCalendar = () => {
    this.setState({ showDatePicker: false })
  }

  showDatePickerCalendar = () => {
    this.setState({ showDatePicker: true }, () => {
      const { onClick } = this.props
      if (onClick && typeof onClick === 'function') {
        onClick(this.props.id)
      }
    })
  }

  onCalendarClick = date => {
    let value = formatStandartDateForPicker(date)
    this.setState({ showDatePicker: false, value, valueForCalendar: date }, () => {
      const { onCalendarClick } = this.props
      if (onCalendarClick && typeof onCalendarClick === 'function') {
        onCalendarClick(value, this.props.id, date)
      }
    })
  }

  render() {
    const {
      id,
      field,
      forwardedRef,
      label,
      initialValue,
      customError,
      errorLayout,
      border,
      height,
      marginTop,
      marginBottom,
      selfContainer,
      onBlur: handleOnBlur,
      onKeyDown: handleOnKeyDown
    } = this.props

    return (
      <InputWrapper selfContainer={selfContainer}>
        <MaskedTextInput
          value={this.state.value}
          initialValue={displayDateFormat(initialValue)}
          forwardedRef={forwardedRef}
          id={id}
          height={height}
          marginTop={marginTop}
          marginBottom={marginBottom}
          field={field}
          label={label}
          autoComplete="off"
          border={border}
          interBlock
          onClick={this.showDatePickerCalendar}
          onBlur={handleOnBlur}
          onKeyDown={handleOnKeyDown}
          customError={customError}
          errorLayout={errorLayout}
        />
        {this.state.showDatePicker && (
          <PureDayPickerCalendar id={`calendar_${id}`} selectedDays={[this.state.valueForCalendar]} onClick={this.onCalendarClick} />
        )}
      </InputWrapper>
    )
  }
}
