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
    color: ${props => props.theme.green};
    &:before {
      background: ${props => `radial-gradient(${props.theme.greyBlackTint} 10%, ${props.theme.greyBlackShade})`};
    }
  }

  &:after {
    background-color: ${props => props.theme.greyBlackTint};
  }

  &:focus:not(:active) {
    animation: ${props => btnRippleEffect(props.theme.grey, props.theme.green)} 0.5s ease;
  }
`

export function NumKeyButton({ keyLabel, onKeyPressedHandler }) {
  return (
    <KeyTouchButton type="button" onClick={() => onKeyPressedHandler(keyLabel)}>
      {keyLabel}
    </KeyTouchButton>
  )
}
