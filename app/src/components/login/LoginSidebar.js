import React from 'react'
import styled from 'styled-components'

// Components
import { Logo, EntabeniLogo } from '../logos'
import { LoginKeypad } from './keypadForm/LoginKeypad'
import { BasicForm } from 'es-components'

const LoginAside = styled.aside`
  min-height: 100%;
  display: grid;
  box-sizing: border-box;
  grid-template-rows: 1fr auto;
`

const LoginAsideHeader = styled.header`
  width: 100%;
  padding: 1em;

  display: flex;
  align-items: flex-end;
  justify-content: center;
`

export function LoginSidebar({ onSubmitHandler }) {
  return (
    <LoginAside>
      <LoginAsideHeader>
        <Logo name="FullColorLogo" accountLogo={true} padding="0" />
      </LoginAsideHeader>
      <LoginAsideHeader>
        <EntabeniLogo name="FullColorLogo" />
      </LoginAsideHeader>
      <BasicForm dark="true" component={LoginKeypad} onSubmit={values => onSubmitHandler(values)} />
    </LoginAside>
  )
}
