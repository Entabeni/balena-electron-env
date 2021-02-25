import React from 'react'
import styled from 'styled-components'

// Componets
import { Button } from 'es-components'

const ButtonWrapper = styled.div`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1.3%;
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 60px;
  padding: 0.5em 0;
`

export function OrderPanelButtons({
  currentStep,
  cancelOrder,
  addDiscount,
  canCompleteOrder,
  completedAllWaivers,
  completeOrder,
  purchaserButtonDisabled,
  orderCompleted,
  completingPayment,
  updateOrderStep,
  updatingOrderStep
}) {
  const cancelOrderBtn = null
  const addDiscountBtn = <Button key="addDiscount" title="ADD DISCOUNT" kind="primary" customWidth="100%" fontSize="1rem" onClickHandler={addDiscount} />
  const addPurchaserBtn = (
    <Button
      key="addPurchaser"
      title="ADD PURCHASER"
      kind="green"
      customWidth="100%"
      disabled={purchaserButtonDisabled}
      fontSize="1rem"
      onClickHandler={() => updateOrderStep('addPurchaser')}
      loading={updatingOrderStep}
    />
  )
  const payBtn = (
    <Button
      key="pay"
      title="PAY"
      kind="green"
      customWidth="100%"
      fontSize="1rem"
      disabled={currentStep === 'signWaivers' && !completedAllWaivers}
      onClickHandler={() => updateOrderStep('addPayment')}
    />
  )
  const completeBtn = (
    <Button
      key="complete"
      title="COMPLETE"
      kind="green"
      customWidth="100%"
      fontSize="1rem"
      loading={completingPayment || orderCompleted}
      disabled={!canCompleteOrder || completingPayment || orderCompleted}
      onClickHandler={completeOrder}
    />
  )
  const buttons = []
  if (currentStep === 'addProducts') {
    buttons.push(...[cancelOrderBtn, addDiscountBtn, addPurchaserBtn])
  } else if (currentStep === 'addPurchaser') {
    buttons.push(...[cancelOrderBtn, payBtn])
  } else if (currentStep === 'signWaivers') {
    buttons.push(...[cancelOrderBtn, payBtn])
  } else if (currentStep === 'addPayment') {
    buttons.push(...[cancelOrderBtn, completeBtn])
  }
  return <ButtonWrapper>{buttons}</ButtonWrapper>
}
