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
  margin-top: 2.5rem;
`

export function SalePanelButtons({ receiptPrintLoading = false, sale, onPrintReceiptClick, onPrintCardClick, onEmailClick, onRefundClick }) {
  const refundBtn = <Button key="refund" title="REFUND" kind="red" customWidth="100%" fontSize="1rem" fontWeight="700" onClickHandler={onRefundClick} />
  const emailBtn = <Button key="email" title="EMAIL" kind="primary" customWidth="100%" fontSize="1rem" fontWeight="700" onClickHandler={onEmailClick} />
  const printReceiptBtn = (
    <Button
      key="printReceipt"
      title="PRINT RECEIPT"
      kind="primary"
      customWidth="100%"
      fontSize="1rem"
      fontWeight="700"
      loading={receiptPrintLoading}
      onClickHandler={onPrintReceiptClick}
    />
  )
  const printCardBtn = (
    <Button
      disabled={!sale.accessRecords.length}
      key="printCard"
      title="PRINT CARD(S)"
      kind="primary"
      customWidth="100%"
      fontSize="1rem"
      fontWeight="700"
      onClickHandler={onPrintCardClick}
    />
  )
  const buttons = []
  buttons.push(...[refundBtn, emailBtn, printReceiptBtn, printCardBtn])
  return <ButtonWrapper>{buttons}</ButtonWrapper>
}
