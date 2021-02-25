import React from 'react'
import styled from 'styled-components'

// Components
import { SelectInput, TextInput } from 'es-components'

const SplitPaymentRowWrapper = styled.article`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1em;
`
const SplitPaymentInputWrapper = styled.div`
  height: 55px;
  & input {
    padding-top: 0px;
  }
`

export function SplitPaymentRow({ filteredPaymentOptions, counter }) {
  return (
    <SplitPaymentRowWrapper>
      <SelectInput
        placeholder="Payment type"
        id={`paymentType-${counter}`}
        field={`paymentType-${counter}`}
        options={filteredPaymentOptions}
        borderRadius="0"
      />
      <SplitPaymentInputWrapper>
        <TextInput id={`summ-${counter}`} field={`summ-${counter}`} placeholder="Enter an amount" autoComplete="off" />
      </SplitPaymentInputWrapper>
    </SplitPaymentRowWrapper>
  )
}
