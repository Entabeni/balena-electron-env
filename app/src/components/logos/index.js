import React from 'react'
import styled, { css } from 'styled-components'

// Context
import { SiteGlobalContext } from 'es-context'

// Account Theme
import { accountTheme } from '../../themes/accounts'

// Style Utils
import { flexCenterItem } from '../utils'

export const LogoSpan = styled.div`
  width: auto;
  height: ${props => (!props.accountLogo ? props.height : `calc(${props.height} + 2em)`)};
  max-width: ${props => (!props.accountLogo ? props.width : `calc(${props.width} + 2em)`)};
  overflow-y: ${props => (props.customerFacing ? 'hidden' : 'auto')};
  max-height: 100%;

  ${flexCenterItem}
`

const StyledSiteLogo = styled.figure`
  width: auto;
  height: 86px;
  text-align: center;
  padding: ${props => props.padding || '1em'};
  margin: ${props => props.margin || '0 0 0 1rem'};

  ${props =>
    props.accountLogo &&
    css`
      max-width: calc(190px + 2em);
    `}

  ${flexCenterItem}
`

const StyledESLogo = styled.figure`
  width: auto;
  height: auto;
  text-align: center;
  padding: 0;
`

export const LogoImg = styled.img.attrs(props => ({
  src: props.theme.logoUrl,
  alt: 'Logo'
}))`
  ${props =>
    !props.accountLogo
      ? css`
          max-height: 100px;
        `
      : css`
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
        `}
`

// Name:  FullColorLogo, TextLogo, SingleColorLogo
export const Logo = ({ accountLogo, name, placement, height, width, padding, margin }) => {
  const { showLogo, siteTheme } = React.useContext(SiteGlobalContext)
  const LogoHeight = placement !== 'header' ? accountTheme[siteTheme].LoginLogoHeight : accountTheme[siteTheme].HeaderLogoHeight
  const LogoWidth = placement !== 'header' ? accountTheme[siteTheme].LoginLogoWidth : accountTheme[siteTheme].HeaderLogoWidth
  if (!showLogo) {
    return null
  }

  return (
    <StyledSiteLogo accountLogo={accountLogo} padding={padding} margin={margin}>
      <LogoSpan accountLogo={accountLogo} width={LogoWidth} height={LogoHeight}>
        <LogoImg accountLogo={accountLogo} />
      </LogoSpan>
    </StyledSiteLogo>
  )
}
export const EntabeniIconLogo = ({ isCustomerFacing }) => {
  const { siteTheme } = React.useContext(SiteGlobalContext)
  const SiteLogo = accountTheme[siteTheme]['EsLogo']

  return (
    <LogoSpan width={isCustomerFacing ? '72px' : '45px'} height={isCustomerFacing ? '72px' : '45px'}>
      <SiteLogo color="red" />
    </LogoSpan>
  )
}

export const EntabeniLogo = ({ name, placement, height, width, padding, margin }) => {
  const { siteTheme } = React.useContext(SiteGlobalContext)
  const SiteLogo = accountTheme[siteTheme][name]
  const LogoHeight = placement !== 'header' ? accountTheme[siteTheme].LoginLogoHeight : accountTheme[siteTheme].HeaderLogoHeight
  const LogoWidth = placement !== 'header' ? accountTheme[siteTheme].LoginLogoWidth : accountTheme[siteTheme].HeaderLogoWidth

  return (
    <StyledSiteLogo padding={padding} margin={margin}>
      <LogoSpan width={LogoWidth} height={LogoHeight}>
        <SiteLogo />
      </LogoSpan>
    </StyledSiteLogo>
  )
}

export const ESLogo = ({ color, size }) => {
  const { siteTheme } = React.useContext(SiteGlobalContext)
  const EsLogo = accountTheme[siteTheme].EsLogo
  return (
    <StyledESLogo>
      <LogoSpan>
        <EsLogo color={color || 'white'} size={size || '60px'} />
      </LogoSpan>
    </StyledESLogo>
  )
}
