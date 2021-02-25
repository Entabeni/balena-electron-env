import React from 'react'
import styled from 'styled-components'

// Components
import { Par, H3 } from 'es-components'
import { formatCurrency } from 'es-libs'

const Footer = styled.footer`
  background-color: ${props => props.theme.grey};
  height: ${props => (props.noControls ? '100px' : '105px')};
  left: 0;
  position: relative;
  right: 0;
`

const FooterItems = styled.ul`
  border-left: 1px solid ${props => props.theme.grey};
  border-right: 1px solid ${props => props.theme.grey};
  box-sizing: border-box;
  height: ${props => (props.noControls ? '100px' : '105px')};
  list-style: none;
  padding-top: 5px;
  width: 100%;

  .footer_subtotal,
  .footer_discount,
  .footer_tax,
  .footer_total {
    padding: 0 calc(20px + 0.5em) 0 0.5em;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .footer_subtotal,
  .footer_discount,
  .footer_shipping_cost,
  .footer_tax {
    height: 25px;
  }

  .footer_space {
    height: 5px;
  }

  .footer_total {
    height: 40px;
    border-top: 1px solid ${props => props.theme.greyDark};
    background-color: ${props => props.theme.white};
    border-bottom: 1px solid ${props => props.theme.grey};
  }
`

export function OrderPanelFooter({ subTotal, shippingOptionPrice, taxTotal, total, noControls }) {
  return (
    <Footer noControls={noControls}>
      <FooterItems noControls={noControls}>
        {shippingOptionPrice && (
          <li className="footer_subtotal">
            <Par color="greyBlack" size="0.9rem">
              Shipping costs:
            </Par>
            <Par color="greyBlack" size="0.9rem">
              {formatCurrency(shippingOptionPrice)}
            </Par>
          </li>
        )}
        <li className="footer_subtotal">
          <Par color="greyBlack" size="0.9rem">
            Subtotal:
          </Par>
          <Par color="greyBlack" size="0.9rem">
            {formatCurrency(subTotal)}
          </Par>
        </li>

        {/* <li className="footer_discount">
          <Par color="greyBlack" size="0.9rem">
            Discount:
          </Par>
          <Par color="greyBlack" size="0.9rem">
            10%
          </Par>
        </li> */}
        <li className="footer_tax">
          <Par color="greyBlack" size="0.9rem">
            Tax:
          </Par>
          <Par color="greyBlack" size="0.9rem">
            {formatCurrency(taxTotal)}
          </Par>
        </li>
        <li className="footer_space" />
        <li className="footer_total">
          <H3 color="greyBlack" size="1.1rem">
            Total:
          </H3>
          <H3 color="greyBlack" size="1.1rem">
            {formatCurrency(total)}
          </H3>
        </li>
      </FooterItems>
    </Footer>
  )
}
