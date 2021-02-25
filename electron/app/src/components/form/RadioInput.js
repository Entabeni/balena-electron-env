import React from 'react'
import { withFormState, RadioGroup, Radio } from 'informed'
import styled, { css } from 'styled-components'

const RadioBtnWrapper = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  flex-direction: row;
  width: auto;
  box-sizing: border-box;
  padding: 0.5em;
  position: relative;

  ${props =>
    props.stack &&
    css`
      flex-direction: column;
      width: 100%;

      input {
        margin-bottom: 0.5em;

        &:last-child {
          margin-bottom: 0;
        }
      }
    `}

  ${props =>
    props.err &&
    css`
      border: 1px solid ${props => props.theme.red};
      margin-bottom: 10px;
    `}
`

const FieldGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
`

const FieldLabel = styled.label`
  display: inline-block;
  padding: 0 2em 0 0.5em;
  color: ${props => props.theme.greyDarkShade};
  font-size: 100%;
  font-weight: 300;
`

const FieldRadio = styled(Radio)`
  outline: 0;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  appearance: none;
  border-style: solid;
  border-width: 0.08rem;
  border-radius: 100%;
  transition: all 0.4s;

  &:hover {
    transition: all 0.4s;
  }

  &:checked {
    position: relative;
  }

  &:checked:after {
    content: '';
    display: block;
    width: 25px;
    height: 25px;
    border-radius: 20px;
    transition: background 0.5s;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:disabled,
  &:checked:disabled {
    border-color: ${props => props.theme.greyDark};
    background-color: ${props => props.theme.greyLight};
  }
`

const FieldErrorMsg = styled.small`
  display: block;
  position: absolute;
  right: -1px;
  bottom: -12px;
  text-align: right;
  font-size: 0.9rem;
  font-weight: 400;
  background-color: ${props => props.theme.red};
  padding: 3px 10px;
  color: ${props => props.theme.white};
  z-index: 2;
`

export const RadioInput = props => {
  return (
    <FieldGroup>
      {props.label && props.leftLabel && <FieldLabel htmlFor={props.id}>{props.label}</FieldLabel>}
      <FieldRadio id={props.id} value={props.radioValue} />
      {props.label && !props.leftLabel && <FieldLabel htmlFor={props.id}>{props.label}</FieldLabel>}
    </FieldGroup>
  )
}

export const RadioInputGroup = withFormState(({ stack, children, fieldGroup, fieldState, formState, customError, withoutWrapper, ...props }) => {
  const errorSet = customError || (formState.errors && fieldGroup in formState.errors)
  const errorMsg = customError || formState.errors[fieldGroup]

  return (
    <RadioGroup field={fieldGroup} {...props}>
      {withoutWrapper && <>{children}</>}
      {!withoutWrapper && (
        <RadioBtnWrapper stack={stack} err={errorSet}>
          {children}
          {errorSet ? <FieldErrorMsg>{errorMsg}</FieldErrorMsg> : null}
        </RadioBtnWrapper>
      )}
    </RadioGroup>
  )
})
