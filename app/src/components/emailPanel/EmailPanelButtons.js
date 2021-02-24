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

export function EmailPanelButtons({ onCancel, onSendEmail }) {
  const emptyItem = <EmptyItem key="empty1" />
  const secondEmptyItem = <EmptyItem key="empty2" />
  const cancel = <Button key="refund" title="Go back" upperCase kind="primary" customWidth="100%" fontSize="1rem" fontWeight="700" onClickHandler={onCancel} />
  const sendEmail = (
    <Button key="email" title="Send Email" upperCase kind="red" customWidth="100%" fontSize="1rem" fontWeight="700" onClickHandler={onSendEmail} />
  )
  const buttons = []
  buttons.push(...[emptyItem, cancel, sendEmail, secondEmptyItem])
  return <ButtonWrapper>{buttons}</ButtonWrapper>
}
