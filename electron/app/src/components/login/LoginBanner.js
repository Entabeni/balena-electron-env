import React from 'react'
import styled from 'styled-components'

// Components
import { ESLogo } from '../logos'
import { Par } from 'es-components'
import { bgImageStyles } from 'es-reusable'

// Background
import bgImg from '../../themes/accounts/entabeni/images/Background.jpeg'

const LoginBannerSection = styled.section`
  background: linear-gradient(0deg, rgba(${props => props.theme.secondaryShadeA}, 0.8), rgba(${props => props.theme.secondaryShadeA}, 0.8)),
    url(${props => props.bgImg});
  background-size: cover;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;

  ${bgImageStyles}
`

export const ProductCopy = styled.div`
  position: absolute;
  width: 100%;
  bottom: 1.5em;
  left: 0;
  right: 0;
  padding: 0 2em;

  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
`

export const ProductCopyText = styled(Par)`
  white-space: nowrap;
  padding: 0 1em;
  font-size: ${props => (props.isCustomerFacing ? '1.3em' : '1rem')};
  line-height: 0;
  margin: ${props => (props.isCustomerFacing ? '0 0 0 -0.6em' : '0')};
`

//white-space: nowrap;

export const BreakLine = styled.span`
  width: 100%;
  height: 1px;
  background-color: ${props => props.theme.white};
`

export function LoginBanner() {
  return (
    <LoginBannerSection bgImg={bgImg}>
      <ProductCopy>
        <ESLogo />
        <ProductCopyText color="white">Product of Entabeni Systems</ProductCopyText>
        <BreakLine />
      </ProductCopy>
    </LoginBannerSection>
  )
}
