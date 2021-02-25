import React from 'react'
import styled, { css } from 'styled-components'

// Components
import { Icon } from 'es-components'
import { TouchButton } from 'es-components'

const AssignButton = styled(TouchButton)`
  width: 100%;
  height: 100%;
  font-size: 1.2rem;
  color: ${props => props.theme.white};

  &:before {
    background-color: ${props => `rgba(${props.theme.primaryA}, 0.5)`};
  }

  &:hover {
    &:before {
      background-color: ${props => `rgba(${props.theme.primaryA}, 0.8)`};
    }
  }

  &:after {
    background-color: rgba(5, 5, 5, 0.2);
  }

  ${props =>
    props.infostate === 'active' &&
    css`
      &:before {
        background-color: ${props => `rgba(${props.theme.primaryA}, 1)`};
      }
    `};

  ${props =>
    props.infostate === 'completed' &&
    css`
      &:before {
        background: ${props => props.theme.green};
      }
    `};

  ${props =>
    props.infostate === 'error' &&
    css`
      &:before {
        background: ${props => props.theme.red};
      }
    `};
`

export function AssignItemButton({ icon, iconSize, setInfoState, onClickHandler }) {
  return (
    <AssignButton infostate={setInfoState} type="button" onClick={onClickHandler}>
      <Icon name={icon} size={iconSize} />
    </AssignButton>
  )
}
