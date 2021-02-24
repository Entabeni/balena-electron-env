import React from 'react'
import styled from 'styled-components'

// Components
import { Icon, btnRippleEffect, TouchButton, SpinLoader } from 'es-components'

// Style Utils
import { flexCenterItem } from '../../utils'

const LoginTouchButton = styled(TouchButton)`
  width: 100%;
  height: 60px;
  margin-top: 1em;
  font-size: 1.2rem;
  color: ${props => props.theme.white};

  &:before {
    background-color: ${props => props.theme.secondary};
  }

  &:after {
    background-color: ${props => props.theme.secondaryShade};
  }

  &:focus:not(:active) {
    animation: ${props => btnRippleEffect(props.theme.white, props.theme.white)} 0.5s ease;
  }
`

const LoginBtnIcon = styled.span`
  background-color: ${props => props.theme.secondaryShade};
  color: ${props => props.theme.white};
  width: 60px;
  height: 60px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;

  ${flexCenterItem}
`

export const SubmitButton = ({ loading }) => {
  return (
    <LoginTouchButton type="submit">
      {loading ? 'LOGGING IN ...' : 'LOG IN'}
      <LoginBtnIcon>{loading ? <SpinLoader /> : <Icon name="IoIosLogIn" size="2rem" />}</LoginBtnIcon>
    </LoginTouchButton>
  )
}
