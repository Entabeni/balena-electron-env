import React from 'react'
import { asField } from 'informed'
import ReactSelect from 'react-select'

// Components
import styled from 'styled-components'

const SelectFieldContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  min-height: 50px;
  position: relative;
`

const FieldErrorMsg = styled.small`
  display: block;
  position: absolute;
  right: 0;
  bottom: 16px;
  text-align: right;
  font-size: 0.9rem;
  font-weight: 400;
  background-color: ${props => props.theme.red};
  padding: 3px 10px;
  color: ${props => props.theme.white};
  z-index: 2;
`

export const SelectInput = asField(({ id, label, customError, fieldState, fieldApi, multiple, value, ...props }) => {
  const { setValue, setTouched } = fieldApi
  const errorMsg = customError || fieldState.error
  const { onChange, onBlur, initialValue, forwardedRef, isSearchable, ...rest } = props

  if (value) {
    value = props.options.find(opt => opt.value === value)
  } else if (value) {
    const selectorValue = []
    props.options.forEach(option => {
      if (value.indexOf(option.value) !== -1) {
        selectorValue.push(option)
      }
    })
    value = selectorValue
  } else {
    value = fieldState.value
  }

  const sharedStyles = {
    display: 'flex',
    width: '100%',
    flexWrap: 'wrap',
    alignItems: 'center',
    height: 'auto',
    minHeight: '55px',
    borderRadius: '0'
  }

  const standardStyles = {
    container: styles => ({
      ...styles
      /*zIndex: '7'*/
    }),
    control: (styles, state) => ({
      ...styles,
      ...sharedStyles,
      backgroundColor: props.controlBgColor || 'transparent',
      borderColor: props.controlBorderColor || 'hsl(0, 0% , 80%)',
      marginBottom: props.controlMarginBottom || '1.75rem'
    }),
    input: styles => ({
      ...styles,
      color: props.inputColor || 'inherit'
    }),
    menu: styles => ({
      ...styles,
      backgroundColor: props.menuBgColor || 'hsl(0, 0%, 100%)',
      borderRadius: props.menuBorderRadius || '4px',
      marginTop: props.menuMarginTop || '-1.75rem',
      zIndex: '10'
    }),
    option: (styles, state) => {
      return {
        ...styles,
        backgroundColor: state.isFocused ? props.optionBgColorOnFocus || '#DEEBFF' : props.optionBgColor || 'transparent',
        color: state.isFocused ? props.optionColorOnFocus || 'inherit' : props.optionColor || 'inherit'
      }
    } /*
    placeholder: styles => ({
      ...styles,
      color: props.placeholderColor || 'hsl(0, 0%, 50%)'
    }) */,
    singleValue: styles => ({
      ...styles,
      color: props.valueColor || 'hsl(0, 0%, 20%)'
    })
  }

  const onChangeValue = e => {
    setValue(e)
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <SelectFieldContainer>
      <ReactSelect
        {...rest}
        className="react-select-container"
        classNamePrefix="react-select"
        styles={standardStyles}
        id={id}
        ref={forwardedRef}
        isMulti={multiple}
        value={!value && value !== 0 ? (multiple ? [] : '') : value}
        onChange={onChangeValue}
        onBlur={e => {
          setTouched()
          if (onBlur) {
            onBlur(e)
          }
        }}
        fieldstate={fieldState}
        err={errorMsg}
        isSearchable={isSearchable}
        defaultValue={initialValue}
      />
      {errorMsg ? <FieldErrorMsg>{errorMsg}</FieldErrorMsg> : null}
    </SelectFieldContainer>
  )
})
