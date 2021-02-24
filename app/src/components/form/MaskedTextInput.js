import React from 'react'
import MaskedInput from 'react-input-mask'
import styled, { css } from 'styled-components'
import { asField } from 'informed'

import { getDobInputMask } from 'es-libs'

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
  transition: border 0.2s, font 0.2s;
  position: relative;
`

const FieldMaskedInput = styled(MaskedInput)`
  width: 100%;
  height: ${props => (props.height ? props.height : '55px')};
  padding: ${props => (props.fieldstate.value ? '8px 50px 0 15px' : '0 50px 0 15px')};

  ${sharedFieldStyle}

  &:hover {
    transition: all 0.4s;
    border-color: ${props => props.theme.greyDarkShade};
  }

  &:focus {
    border-color: ${props => props.theme.greyDarkShade};
  }

  border-right: ${props => props.err && `2px solid ${props.theme.red}`} !important;

  ${props =>
    props.borderColor
      ? css`
          border-color: ${props.theme[props.borderColor] || props.borderColor};
        `
      : null}

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
  min-height: ${props => (props.height ? props.height : '50px')};
  position: relative;
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : '1em')};
  margin-top: ${props => (props.marginTop ? props.marginTop : '0')};
`

const FieldLabel = styled.label`
  top: 0;
  left: 15px;
  right: 0;
  bottom: ${props => (props.activeInput ? '35px' : 0)};
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

  ${props =>
    props.layoutType
      ? props.layoutType === 'single-row'
        ? css`
            bottom: 0;
            min-height: 100%;
            padding: 0.85rem 1rem 0.5rem;
            text-align: center;
            transform: translateX(100%);
          `
        : ''
      : ''}
`

export const MaskedTextInput = asField(
  ({ id, label, customError, errorLayout, fieldState, fieldApi, value, showClearButton, marginTop, marginBottom, height, ...props }) => {
    const { setValue, setTouched } = fieldApi
    const errorMsg = customError || fieldState.error
    const { onChange, onBlur, forwardedRef, ...rest } = props

    if (value && value !== 'Invalid Date') {
      fieldState.maskedValue = value
      fieldState.value = value
    } else {
      value = fieldState.value
    }

    const onChangeValue = e => {
      if (e !== '') {
        setValue(e.target.value)
      } else {
        setValue(e)
      }

      if (onChange) {
        onChange(e)
      }
    }

    return (
      <TextFieldContainer marginTop={marginTop} marginBottom={marginBottom} height={height} className="fieldContainer">
        <FieldLabel interBlock htmlFor={id} activeInput={fieldState.value}>
          {label}
        </FieldLabel>
        <FieldMaskedInput
          {...rest}
          id={id}
          interBlock
          height={height}
          mask={getDobInputMask()}
          ref={forwardedRef}
          value={!value && value !== 0 ? '' : value}
          onChange={onChangeValue}
          onBlur={e => {
            setTouched()
            if (onBlur) {
              onBlur(e)
            }
          }}
          fieldstate={fieldState}
          err={errorMsg}
        />
        {customError || errorMsg ? <FieldErrorMsg layoutType={errorLayout}>{errorMsg}</FieldErrorMsg> : null}
      </TextFieldContainer>
    )
  }
)
