import React from 'react'

// Styles
import styled, { css } from 'styled-components'
import { media, rippleEffect, blastBackgroundEffect } from 'es-themes'

// Icons
import { Icon, SpinLoader } from 'es-components'

const borders = css`
  border-top: ${props => (props.borderTop ? `1px solid ${props.theme[props.borderTop]}` : 0)};
  border-right: ${props => (props.borderRight ? `1px solid ${props.theme[props.borderRight]}` : 0)};
  border-left: ${props => (props.borderLeft ? `1px solid ${props.theme[props.borderLeft]}` : 0)};
  border-bottom: ${props => (props.borderBottom ? `1px solid ${props.theme[props.borderBottom]}` : 0)};
`

const StyledIconButton = styled.button`
  z-index: 0;
  padding: 0;
  outline: none;
  cursor: pointer;
  position: relative;
  transition: all 0.6s ease-in-out;
  margin: ${props => props.margin || 0};
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  color: ${props => props.theme[props.color]};
  background: ${props => props.theme[props.backgroundColor] || 'transparent'};

  display: flex;
  justify-content: center;
  align-items: center;

  ${borders}

  ${props =>
    props.absolute &&
    css`
      position: absolute;
      top: ${props => props.top};
      left: ${props => props.left};
      right: ${props => props.right};
      bottom: ${props => props.bottom};
    `}

  &:after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    z-index: -1;
    opacity: 0;
    border-radius: 90%;
    transform: scale(1, 1);
    background-color: ${props => props.theme.greyLight};
  }

  &:hover {
    color: ${props => props.theme[props.hoverColor]};
  }

  &:focus:not(:active) {
    animation: ${props => rippleEffect(props.theme[props.color], props.theme[props.hoverColor])} 0.5s ease;
  }

  &:focus:not(:active)::after {
    animation: ${blastBackgroundEffect} 1s ease;
  }

  /* Media Query */
  ${media.tablet`
    &:hover {
      color: ${props => props.theme[props.color]};
    }
  `}
`

export const IconButton = props => (
  <StyledIconButton {...props} onClick={props.handleOnClick}>
    {props.loading ? <SpinLoader /> : <Icon name={props.name} size={props.iconsSize} />}
  </StyledIconButton>
)
