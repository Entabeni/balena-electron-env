import React from 'react'
import { withFormState, RadioGroup, Radio } from 'informed'

// Components
import styled from 'styled-components'
import { media } from 'es-themes'

const RadioBtnWrapper = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  flex-direction: ${props => (props.layout ? 'column' : 'row')};
  width: ${props => (props.layout ? '100%' : 'auto')};
  margin-bottom: ${props => props.theme.spacingSml};

  /* Media Query */
  ${media.phone`
    flex-direction: ${props => props.mobileRow || 'column'};
  `}
`

const FieldGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  margin-bottom: ${props => props.theme.spacingSml};
  margin-right: ${props => props.theme.spacingMed};
`

const FieldLabel = styled.label`
  display: inline-block;
  padding: 0 10px;
  color: ${props => props.theme.greyDarkShade};
  font-size: 100%;
  font-weight: 300;
`

const FieldRadio = styled(Radio)`
  outline: 0;
  width: 35px;
  height: 35px;
  min-width: 35px;
  min-height: 35px;
  flex-shrink: 0;
  appearance: none;
  border-style: solid;
  border-width: 0.08rem;
  border-color: ${props => props.theme.greyDarkShade};
  border-radius: 90%;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.primaryTint};
    transition: all 0.2s;
  }

  &:checked {
    position: relative;
    border-color: ${props => props.theme.primary};
    background-color: ${props => props.theme.white};
  }

  &:checked:after {
    content: '';
    display: block;
    width: 25px;
    height: 25px;
    border-radius: 20px;
    transition: background 0.5s;
    background: ${props => props.theme.primary};
    position: absolute;
    top: 4px;
    right: 4px;
    border: 2px solid ${props => props.theme.primaryTint};
  }

  &:disabled,
  &:checked:disabled {
    border-color: ${props => props.theme.disabled};
    background-color: ${props => props.theme.disabledTint};
  }
`

const FieldErrorMsg = styled.small`
  display: block;
  text-align: right;
  margin-top: 0.4rem;
  font-size: 0.7rem;
  font-weight: 300;
  color: ${props => props.theme.red};
`

export const StandardRadio = props => (
  <FieldGroup>
    <FieldRadio id={props.id} value={props.radioValue} />
    <FieldLabel htmlFor={props.id}>{props.label}</FieldLabel>
  </FieldGroup>
)

export const RadioBtnGroup = withFormState(props => {
  return (
    <RadioGroup field={props.fieldGroup} {...props}>
      <RadioBtnWrapper layout={props.stack} mobileRow={props.mobileRow}>
        {props.children}
        {props.formState.errors && props.fieldGroup in props.formState.errors ? (
          <FieldErrorMsg>{props.formState.errors[props.fieldGroup]}</FieldErrorMsg>
        ) : null}
      </RadioBtnWrapper>
    </RadioGroup>
  )
})
