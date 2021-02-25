import React from 'react'

import { OrderPanelWrapper } from 'es-components'
import styled from 'styled-components'

export const PageWrap = styled.div`
  height: 100%;
  padding: 130px 40px 110px 40px;
  width: 100%;

  & > div {
    width: 100%;
  }
`
export default function OrderScreen({ currentOrder, currentSale }) {
  return (
    <PageWrap>
      <OrderPanelWrapper order={currentOrder} sale={currentSale} noControls />
    </PageWrap>
  )
}
