import React from 'react'
import styled from 'styled-components'

// Components
import { Par } from 'es-components'

const Header = styled.header`
  background-color: ${props => props.theme.white};
  display: flex;
  flex-direction: column;
  padding: 0;
  border: 1px solid ${props => props.theme.grey};
`

const OrderPaymentTitleSection = styled.section`
  height: 20px;
  width: 100%;
  display: grid;
  box-sizing: border-box;
  grid-template-columns: 1fr 120px 20px;
  align-items: center;

  .title_item {
    padding: 2px 0.5em 0;
  }
  .title_delete {
    padding: 2px 0 0;
    text-align: right;
  }
`

export function OrderPaymentHeader() {
  return (
    <Header>
      <OrderPaymentTitleSection>
        <Par className="title_item" color="greyBlack" size="0.9rem">
          Payment Type
        </Par>
        <Par className="title_total" color="greyBlack" size="0.9rem">
          Payment Amount
        </Par>
        <Par className="title_delete" color="greyBlack" size="0.9rem">
          &nbsp;
        </Par>
      </OrderPaymentTitleSection>
    </Header>
  )
}
