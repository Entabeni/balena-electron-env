import React from 'react'
import styled from 'styled-components'

import { MainPanelWrapper, H4, Par, Button } from 'es-components'

const PaymentsWrapper = styled.article`
  margin: 0;
  padding: 0 0.5em 0.5em 0.5em;
`

const ListWrapper = styled.article`
  margin: 0;
  padding: 0.5em 0 0.5em 0.5em;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
`

export const CompletePage = () => (
  <MainPanelWrapper>
    <PaymentsWrapper>
      <H4>Transaction Successful</H4>
      <Par margin="0.5em 0 1em 0" padding="0 0 1em 0" underline>
        Please select an action below
      </Par>
      <ListWrapper>
        <Button title="Print Receipt" kind="primary" icon="IoMdPrint" sizeH="tall" sizeW="100%" />
        <Button title="Print Access Card(s)" kind="primary" icon="IoMdPrint" sizeH="tall" sizeW="100%" />
        <Button title="Email Receipt" kind="primary" icon="IoIosMail" sizeH="tall" sizeW="100%" />
        <Button title="New Order" kind="secondary" icon="IoIosAdd" sizeH="tall" sizeW="100%" />
      </ListWrapper>
    </PaymentsWrapper>
  </MainPanelWrapper>
)
