import React from 'react'
import styled from 'styled-components'

// Components
import { TextInput } from 'es-components'

const SplitPaymentRowWrapper = styled.article`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1em;
`

const CashPaymentLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  height: 54px;
  background-color: ${props => props.theme.greyShade};
  border: 1px solid ${props => props.theme.greyShade};
`

export function CashPaymentRow({ counter }) {
  return (
    <SplitPaymentRowWrapper>
      <CashPaymentLabel>{`Payment ${counter}`}</CashPaymentLabel>
      <TextInput pattern="[0-9*]" type="number" id={`summ-${counter}`} field={`summ-${counter}`} placeholder="Enter an amount" autoComplete="off" />
    </SplitPaymentRowWrapper>
  )
}
