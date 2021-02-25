import React from 'react'
import styled from 'styled-components'

// Componets
import { Button } from 'es-components'

const ButtonWrapper = styled.div`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(4, 24%);
  grid-gap: 1.3%;
  height: auto;
  margin-top: 2rem;
  padding: 0.5em 0;
  width: 100%;
`

const EmptyItem = styled.div`
  width: 100%;
`

export function CheckInsButtons({ onNewSale, onExistingSale, onAddToCurrentOrder, buttonsDisabled }) {
  const emptyItem = <EmptyItem key="empty1" />
  const addToExistingOrderBtn = (
    <Button
      disabled={buttonsDisabled}
      key="addToExistingOrderBtn"
      title="Add To Current Sale"
      kind="secondary"
      customWidth="100%"
      customPadding="1.25rem 1rem"
      fontSize="1.25rem"
      fontWeight="bold"
      onClickHandler={onAddToCurrentOrder}
    />
  )
  const newSaleBtn = (
    <Button
      disabled={buttonsDisabled}
      key="newSale"
      title="New Sale"
      kind="green"
      customWidth="100%"
      customPadding="1.25rem 1rem"
      fontSize="1.25rem"
      fontWeight="bold"
      onClickHandler={onNewSale}
    />
  )
  const existingSaleBtn = (
    <Button
      disabled={buttonsDisabled}
      key="existingSale"
      title="Existing Sale"
      kind="primary"
      customWidth="100%"
      customPadding="1.25rem 1rem"
      fontSize="1.25rem"
      fontWeight="bold"
      onClickHandler={onExistingSale}
    />
  )
  const buttons = []
  buttons.push(...[emptyItem, newSaleBtn, addToExistingOrderBtn, existingSaleBtn])
  return <ButtonWrapper>{buttons}</ButtonWrapper>
}
