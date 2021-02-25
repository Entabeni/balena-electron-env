import React from 'react'
import styled from 'styled-components'

// Components
import { btnRippleEffect, TouchButton } from 'es-components'

const KeyTouchButton = styled(TouchButton)`
  width: 100%;
  height: 100%;
  font-size: 1.2rem;
  color: ${props => props.theme.grey};

  &:before {
    background-color: ${props => props.theme.greyBlackShade};
  }

  &:hover {
    color: ${props => props.theme.red};
    &:before {
      background: ${props => `radial-gradient(${props.theme.greyBlackTint} 10%, ${props.theme.greyBlackShade})`};
    }
  }

  &:after {
    background-color: ${props => props.theme.greyBlackTint};
  }

  &:focus:not(:active) {
    animation: ${props => btnRippleEffect(props.theme.grey, props.theme.red)} 0.5s ease;
  }

  &.delKey {
    grid-column: 2 / span 2;
  }
`

export function DelKeyButton({ keyLabel, onKeyPressedHandler }) {
  return (
    <KeyTouchButton type="button" className="delKey" onClick={() => onKeyPressedHandler()}>
      {keyLabel}
    </KeyTouchButton>
  )
}
