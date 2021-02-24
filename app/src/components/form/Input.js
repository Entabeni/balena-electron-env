import React from 'react'
import { BasicText, asField } from 'informed'
import styled, { css } from 'styled-components'

const sharedFieldStyle = css`
  display: flex;
  align-items: center;
  outline: 0;
  z-index: 1;
  width: 100%;
  box-shadow: none;
  box-sizing: border-box;
  background-color: transparent;
  font-weight: 400;
  border-style: solid;
  border-width: 0.08rem;
  border-radius: ${props => props.theme.borderRadius};
  ${props =>
    props.borderColor
      ? css`
          border-color: ${props.theme[props.borderColor] || props.borderColor};
        `
      : null}
  transition: border 0.2s, font 0.2s;
  position: relative;
`

const FieldInput = styled(BasicText)`
  width: 100%;
  height: 55px;
  padding: ${props => (props.fieldState.value ? '8px 50px 0 15px' : '0 50px 0 15px')};

  ${sharedFieldStyle}

  &:hover {
    transition: all 0.4s;
    border-color: ${props => props.theme.greyDarkShade};
  }

  &:focus {
    border-color: ${props => props.theme.greyDarkShade};
  }

  border-right: ${props => props.err && `2px solid ${props.theme.red}`} !important;

  &[type='number']::-webkit-inner-spin-button,
  &[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
`

const TextFieldContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  min-height: 50px;
  margin-bottom: ${props => props.theme.spacingSml};
  position: relative;
  margin-bottom: 1.75em;
  ${props => (props.bgColor ? `background-color: ${props.bgColor};` : '')}
`

const FieldLabel = styled.label`
  top: 0;
  left: 15px;
  right: 0;
  bottom: ${props => (props.activeInput ? (props.textArea ? '130px' : '25px') : 0)};
  z-index: 0;
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
  font-size: 0.8rem;
  font-weight: 400;
  background-color: ${props => props.theme.red};
  padding: 3px 10px;
  color: ${props => props.theme.white};
  z-index: 2;
`

export const FieldGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
`

const FieldTextArea = styled.textarea`
  height: 150px;
  padding: 15px;

  ${sharedFieldStyle}

  &:hover {
    transition: all 0.4s;
    border-color: ${props => props.theme.greyDarkShade};
  }

  &:focus {
    border-color: ${props => props.theme.greyDarkShade};
  }

  border-right: ${props => props.err && `2px solid ${props.theme.red}`} !important;
`

export const TextInput = asField(({ id, fieldState, label, customError, value, ...props }) => {
  const errorMsg = customError || fieldState.error

  if (value) {
    fieldState.maskedValue = value
    fieldState.value = value
  }

  return (
    <TextFieldContainer className="fieldContainer" bgColor={props.bgColor}>
      <FieldLabel htmlFor={id} activeInput={fieldState.value != null}>
        {label}
      </FieldLabel>
      <FieldInput id={id} fieldState={fieldState} err={errorMsg} {...props} />
      {errorMsg ? <FieldErrorMsg>{errorMsg}</FieldErrorMsg> : null}
    </TextFieldContainer>
  )
})

export const TextArea = asField(({ fieldState, fieldApi, ...props }) => {
  const { value } = fieldState
  const { setValue, setTouched } = fieldApi
  const { id, label, onChange, onBlur, forwardedRef, borderColor, ...rest } = props

  return (
    <TextFieldContainer className="fieldContainer" bgColor={props.bgColor}>
      <FieldGroup>
        <FieldTextArea
          {...rest}
          id={id}
          ref={forwardedRef}
          borderColor={borderColor}
          value={!value && value !== 0 ? '' : value}
          onChange={e => {
            setValue(e.target.value)
            if (onChange) {
              onChange(e)
            }
          }}
          onBlur={e => {
            setTouched(true)
            if (onBlur) {
              onBlur(e)
            }
          }}
          err={fieldState.error}
          placeholder=""
          activeValue={value && value !== 0}
        />
        <FieldLabel htmlFor={id} activeInput={fieldState.value != null} textArea>
          {label}
        </FieldLabel>
      </FieldGroup>
      {fieldState.error ? <FieldErrorMsg>{fieldState.error}</FieldErrorMsg> : null}
    </TextFieldContainer>
  )
})
