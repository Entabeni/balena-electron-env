import React from 'react'
import styled from 'styled-components'

// Context
import { FormContext } from 'es-context'
import { validateRequired } from 'es-libs'

// Components
import { TextInput, ErrorMsg } from 'es-components'
import { NumKeyButton } from './NumKeyButton'
import { DelKeyButton } from './DelKeyButton'
import { SubmitButton } from './SubmitButton'

const Keypad = styled.section`
  display: grid;
  box-sizing: border-box;
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: repeat(3, 1fr);
  background-color: ${props => props.theme.greyDarkShade};
  width: 100%;
  height: 260px;
  justify-content: center;
  align-content: center;
  justify-items: center;
  align-items: center;
  grid-gap: 0.1em;
`

export function LoginKeypad({ formApi, ...props }) {
  const [focusedField, setFocusedField] = React.useState('login')
  const [loginField, setLoginField] = React.useState('')
  const [pinField, setPinField] = React.useState('')
  const { loading, error } = React.useContext(FormContext)

  React.useEffect(() => {
    setApiValueHandler()
  }, [loginField, pinField])

  const numKeyPressedHandler = key => {
    if (focusedField === 'login') {
      setLoginField(prevState => prevState + key)
    } else {
      setPinField(prevState => prevState + key)
    }
  }

  const deleteKeyPressedHandler = () => {
    if (focusedField === 'login') {
      if (loginField === '') return
      setLoginField(prevState => prevState.slice(0, -1))
    } else {
      if (pinField === '') return
      setPinField(prevState => prevState.slice(0, -1))
    }
  }

  const loginKeyPressedHandler = e => {
    setLoginField(e.target.value)
  }

  const pinKeyPressedHandler = e => {
    setPinField(e.target.value)
  }

  const activeField = focusedField === 'login' ? loginField : pinField
  const setApiValueHandler = () => formApi.setValue(focusedField, activeField)

  return (
    <>
      {!!error && <ErrorMsg errorMsg={error} />}
      <TextInput
        id="login"
        field="login"
        label="Access Code"
        type="number"
        autoComplete="off"
        onChange={loginKeyPressedHandler}
        onFocus={() => setFocusedField('login')}
        validate={validateRequired}
        validateOnChange
      />
      <TextInput
        id="pin"
        field="pin"
        label="Password"
        type="password"
        autoComplete="off"
        onChange={pinKeyPressedHandler}
        onFocus={() => setFocusedField('pin')}
        validate={validateRequired}
        validateOnChange
      />
      <Keypad>
        {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map(item => (
          <NumKeyButton key={item} keyLabel={item} onKeyPressedHandler={numKeyPressedHandler} />
        ))}
        <DelKeyButton keyLabel="Delete" onKeyPressedHandler={deleteKeyPressedHandler} />
      </Keypad>
      <SubmitButton loading={loading} />
    </>
  )
}
