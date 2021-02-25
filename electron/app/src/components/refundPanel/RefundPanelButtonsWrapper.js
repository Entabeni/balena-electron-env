import React from 'react'
import styled from 'styled-components'

// Componets
import { Button } from 'es-components'

const ButtonWrapper = styled.div`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(4, 20%);
  grid-gap: 6.6%;
  width: 100%;
  height: 60px;
  padding: 0;
  margin-top: 3rem;
`

const EmptyItem = styled.div`
  width: 100%;
`

export function RefundPanelButtonsWrapper({ onCancel, onConfirm, disabled }) {
  const emptyItem = <EmptyItem key="empty1" />
  const emptyItem2 = <EmptyItem key="empty2" />
  const emptyItem3 = <EmptyItem key="empty3" />
  const confirmSelection = (
    <Button
      disabled={disabled}
      key="confirm"
      title="Continue"
      upperCase
      kind="red"
      customWidth="100%"
      fontSize="1rem"
      fontWeight="700"
      onClickHandler={onConfirm}
    />
  )
  const buttons = []
  buttons.push(...[emptyItem, emptyItem2, emptyItem3, confirmSelection])
  return <ButtonWrapper>{buttons}</ButtonWrapper>
}
