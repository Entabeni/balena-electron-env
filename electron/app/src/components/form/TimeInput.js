import React from 'react'
import moment from 'moment'
import styled, { css } from 'styled-components'
import { asField } from 'informed'
import TimePicker from 'rc-time-picker'

// style
import 'rc-time-picker/assets/index.css'

const TextFieldContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  min-height: 50px;
  position: relative;
  margin-bottom: 1em;
`
const sharedFieldStyle = css`
  display: flex;
  align-items: center;
  outline: 0;
  z-index: 1;
  width: 100%;
  box-shadow: none;
  box-sizing: border-box;
  background-color: #f8f8f8;
  font-weight: 400;
  border-width: 0.08rem;
  border-radius: 0px;
  transition: border 0.2s, font 0.2s;
  position: relative;
`

const FieldTimePickerInput = styled(TimePicker)`
  width: 100%;
  height: 55px;
  padding: '0 50px 0 15px';

  ${sharedFieldStyle}

  &:hover {
    transition: all 0.4s;
    border-color: ${props => props.theme.greyDarkShade};
  }

  &:focus {
    border-color: ${props => props.theme.greyDarkShade};
  }

  border-right: ${props => props.err && `2px solid ${props.theme.red}`} !important;

  .rc-time-picker-input {
    font-size: ${props => (props.activeInput ? '0.6rem' : '1rem')};
    padding: 8px 50px 0 15px;
    color: black;
    height: 55px;
    border-radius: 0px;
    background-color: #f8f8f8;
    font-weight: 400;
    align-items: center;
  }
`

const FieldLabel = styled.label`
  top: 0;
  left: 15px;
  right: 0;
  background-color: transparent;
  bottom: ${props => (props.activeInput ? '25px' : 0)};
  z-index: 2;
  font-weight: 300;
  font-size: ${props => (props.activeInput ? '0.6rem' : '1rem')};
  position: absolute;
  display: flex;
  align-items: center;
`

const FieldErrorMsg = styled.small`
  display: block;
  position: absolute;
  right: 0;
  bottom: -12px;
  text-align: right;
  font-size: 0.9rem;
  font-weight: 400;
  background-color: ${props => props.theme.red};
  padding: 3px 10px;
  color: ${props => props.theme.white};
  z-index: 2;
`

export const TimeInput = asField(({ id, label, customError, fieldState, fieldApi, ...props }) => {
  let { value } = fieldState
  if (value == null) {
    value = moment()
      .hour(0)
      .minute(0)
    fieldState.value = value
    fieldState.maskedValue = value
  }
  const { setValue, setTouched } = fieldApi
  const errorMsg = customError || fieldState.error
  const { onChange, onBlur, forwardedRef, ...rest } = props

  // maybe change some values or send them by props
  return (
    <TextFieldContainer className="fieldContainer" activeInput={fieldState.value}>
      <FieldLabel htmlFor={id} activeInput={fieldState.value}>
        {label}
      </FieldLabel>
      <FieldTimePickerInput
        {...rest}
        id={props.id}
        showSecond={false}
        inputReadOnly
        focusOnOpen
        use12Hours
        ref={forwardedRef}
        value={!value && value !== 0 ? '' : value}
        onChange={e => {
          setValue(e)
          if (onChange) {
            onChange(e)
          }
        }}
        onBlur={e => {
          setTouched()
          if (onBlur) {
            onBlur(e)
          }
        }}
        fieldstate={fieldState}
        err={errorMsg}
      />
      {errorMsg ? <FieldErrorMsg>{errorMsg}</FieldErrorMsg> : null}
    </TextFieldContainer>
  )
})
