import React from 'react'
import { Checkbox } from 'informed'
import { asField } from 'informed'
import styled, { css } from 'styled-components'
import { SpinLoader } from 'es-components'

const SpinWrapper = styled.div`
  position: absolute;
  z-index: 2;
  background-color: ${props => props.theme.white};
  border: 1px solid ${props => props.theme.grey};
  border-radius: 50%;
  cursor: pointer;
  height: 28px;
  left: 0;
  margin: 0 !important;
  padding: 0 !important;
  position: absolute;
  top: 0;
  width: 28px;

  &::after {
    border: 3px solid ${props => props.theme.white};
    border-top: none;
    border-right: none;
    content: '';
    height: 8px;
    left: 6px;
    opacity: 0;
    position: absolute;
    top: 7px;
    transform: rotate(-45deg);
    width: 14px;
  }
`
const CheckboxWrapper = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  flex-direction: row;
  width: auto;
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

  &.table-checkbox {
    display: inline-block;
  }

  &:not(.table-checkbox) {
    align-items: center;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
  }

  ${props =>
    props.stack &&
    css`
      flex-direction: column;
      width: 100%;

      input {
        margin-bottom: 1em;
      }
    `}

  ${props =>
    props.round &&
    css`
      position: relative !important;
    `}
`

const FieldLabel = styled.label`
  display: inline-block;
  margin-top: ${props => (props.reverse ? '5px' : '-5px;')}
  padding: 0 2em 0 0.5em;
  color: ${props => props.theme.greyDarkShade};
  font-size: 100%;
  font-weight: 300;

  ${props =>
    props.round &&
    css`
      background-color: ${props.theme.white};
      border: 1px solid ${props.theme.grey};
      border-radius: 50%;
      cursor: pointer;
      height: 28px;
      left: 0;
      margin: 0 !important;
      padding: 0 !important;
      position: absolute;
      top: 0;
      width: 28px;

      &::after {
        border: 3px solid ${props.theme.white};
        border-top: none;
        border-right: none;
        content: '';
        height: 8px;
        left: 6px;
        opacity: 0;
        position: absolute;
        top: 7px;
        transform: rotate(-45deg);
        width: 14px;
      }
    `}

  label + & {
    margin-left: 0.5rem;
  }
`

const FieldCheckbox = styled(Checkbox)`
  outline: 0;
  width: ${props => (props.loading ? '31px' : '25px')}
  height: 25px;
  min-width: ${props => (props.loading ? '31px' : '25px')}
  min-height: 25px;
  flex-shrink: 0;
  checked: checked;
  border-style: solid;
  border-width: 0.08rem;
  border-radius: 0.2em;
  transition: ${props => (props.loading ? 'all 0s' : 'all 0.4s')};

  ${props =>
    props.round &&
    css`
      visibility: hidden;

      &:checked + label {
        background-color: ${props.theme.primary};
        border-color: ${props.theme.primary};
      }

      &:checked + label::after {
        opacity: 1;
      }
    `}
`

export const CheckboxInputOld = props => (
  <FieldGroup>
    <FieldCheckbox field={props.field} id={props.id} />
    <FieldLabel htmlFor={props.id}>{props.label}</FieldLabel>
  </FieldGroup>
)

export const CheckboxInput = asField(
  ({ id, reverse, field, fieldState, label, loading, customError, icon, checked, value, onClickHandler, rounded, className, ...props }) => {
    fieldState.maskedValue = checked
    fieldState.value = checked

    return (
      <FieldGroup round={rounded} className={rounded && `${className} rounded-checkbox`}>
        <FieldCheckbox
          round={rounded}
          loading={loading}
          field={field}
          id={id}
          fieldState={fieldState}
          onChange={() => {
            fieldState.maskedValue = !fieldState.maskedValue
            fieldState.value = !fieldState.value
            if (onClickHandler) {
              onClickHandler(id, fieldState.value)
            }
          }}
        />
        {rounded && loading ? (
          <SpinWrapper>
            <SpinLoader size="14px" color="primary" withWrapper="100%" />
          </SpinWrapper>
        ) : (
          <FieldLabel reverse={reverse} htmlFor={id} round={rounded} />
        )}
        {label && (
          <FieldLabel reverse={reverse} htmlFor={id}>
            {label}
          </FieldLabel>
        )}
      </FieldGroup>
    )
  }
)

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

export const CheckboxInputGroup = ({ children, stack, customError, id }) => {
  const errorMsg = customError
  return (
    <CheckboxWrapper id={id} stack={stack} err={errorMsg}>
      {children}
      {errorMsg ? <FieldErrorMsg>{errorMsg}</FieldErrorMsg> : null}
    </CheckboxWrapper>
  )
}

export const RoundedCheckboxInput = props => <CheckboxInput rounded {...props} />
