import React from 'react'

// Styles
import styled from 'styled-components'

const LogoIcon = styled.svg`
  width: ${props => props.size};
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  padding: 0;
  margin: 0;
  object-fit: contain;

  & > path {
    fill: ${props => props.theme[props.color]};
  }
`

export const IconLogo = props => (
  <LogoIcon id="es-icon-logo" viewBox="0 0 30 15.3" color={props.color} size={props.size}>
    <path d="M5.7,7.8L0,10.5L11.1,0L18.9,8.4L23.1,4.8l6.9,8.4L23.4,6.9l-3,3l3.6,5.4L10.2,2.4L6,13.2L5.7,7.8z" />
  </LogoIcon>
)
