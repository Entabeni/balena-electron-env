import React from 'react'
import styled from 'styled-components'

// Style Utils
import { flexCenterItem } from '../utils'

// Components
import { Icon } from 'es-components'

const ErrorMsgWrapper = styled.p`
  display: block;
  width: 100%;
  height: auto;
  padding: 10px 15px 10px 55px;
  color: ${props => props.theme.redShade};
  background-color: ${props => props.theme.redTint};
  border: 1px solid ${props => props.theme.red};
  margin-bottom: 1em;
  font-size: 0.9rem;
  font-weight: 400;
  position: relative;

  .iconBlock {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 40px;
    color: ${props => props.theme.white};
    background-color: ${props => props.theme.red};
    text-align: center;

    ${flexCenterItem}
  }
`

export const ErrorMsg = ({ errorMsg }) => {
  return (
    <ErrorMsgWrapper>
      <span className="iconBlock">
        <Icon name="IoMdWarning" size="1.3rem" />
      </span>

      {errorMsg}
    </ErrorMsgWrapper>
  )
}
