import React from 'react'
import styled, { css } from 'styled-components'

// Components
import { Par, Icon } from 'es-components'

const InfoPar = styled(Par)`
  font-size: 0.9rem;
  color: ${props => props.theme.greyDark};
`

const AssignItemInfoList = styled.li`
  padding: 0 20px 0 0;
  margin-bottom: 0.5em;
  position: relative;
  list-style: none;

  .icon {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    color: ${props => props.theme.greyDark};
  }

  ${props =>
    props.infostate === 'active' &&
    css`
      p {
        color: ${props => props.theme.primary};
      }
      .icon {
        color: ${props => props.theme.primary};
      }
    `};

  ${props =>
    props.infostate === 'completed' &&
    css`
      p {
        color: ${props => props.theme.green};
      }
      .icon {
        color: ${props => props.theme.green};
      }
    `};

  ${props =>
    props.infostate === 'error' &&
    css`
      p {
        color: ${props => props.theme.red};
      }
      .icon {
        color: ${props => props.theme.red};
      }
    `};
`

export const AssignItemInfo = ({ text, setInfoState }) => {
  let setIcon = 'IoMdRadioButtonOff'
  switch (setInfoState) {
    case 'active':
      setIcon = 'IoMdRadioButtonOn'
      break
    case 'completed':
      setIcon = 'IoMdCheckmarkCircleOutline'
      break
    case 'error':
      setIcon = 'IoMdCloseCircleOutline'
      break

    default:
      break
  }
  return (
    <AssignItemInfoList infostate={setInfoState}>
      <InfoPar>{text}</InfoPar>
      <Icon name={setIcon} size="15px" />
    </AssignItemInfoList>
  )
}
