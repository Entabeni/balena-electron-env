import React from 'react'
import styled, { css, keyframes } from 'styled-components'

import { shadeColor } from '../../../libs/utils'

// Style Utils
import { flexCenterItem } from '../../utils'

// Components
import { Icon, SpinLoader } from 'es-components'

// Set the button kind (Theme color value)
const buttonKindStyle = css`
  color: ${props => {
    switch (props.kind) {
      case 'primaryOutline':
        return props.theme.primary
      case 'secondaryOutline':
        return props.theme.secondary
      case 'tertiaryOutline':
        return props.theme.tertiary
      case 'greyOutline':
        return props.theme.greyBlack
      case 'redOutline':
        return props.theme.red
      case 'greenOutline':
        return props.theme.green
      case 'colorized':
        return props.backgroundColor && shadeColor(-80, props.backgroundColor)
      default:
        return props.theme[props.textcolor] || props.textcolor || props.theme.white
    }
  }};
  ${props => {
    if (props.border) {
      return css`
        border: ${props.border};
      `
    } else {
      return css`
        border-color: ${props => {
          switch (props.kind) {
            case 'primary':
            case 'primaryOutline':
              return props.theme.primary
            case 'secondary':
            case 'secondaryOutline':
              return props.theme.secondary
            case 'tertiary':
            case 'tertiaryOutline':
              return props.theme.tertiary
            case 'grey':
            case 'greyOutline':
              return props.theme.greyBlack
            case 'brownLight':
              return props.theme.brownLight
            case 'lightBlue':
              return props.theme.lightBlue
            case 'red':
            case 'redOutline':
              return props.theme.red
            case 'green':
            case 'greenOutline':
              return props.theme.green
            case 'colorized':
              return props.backgroundColor && shadeColor(-80, props.backgroundColor)
            default:
              return props.theme[props.borderColor] || props.borderColor || props.theme.white
          }
        }};
      `
    }
  }}
  background-color: ${props => {
    switch (props.kind) {
      case 'primary':
        return props.theme.primary
      case 'brownLight':
        return props.theme.brownLight
      case 'lightBlue':
        return props.theme.lightBlue
      case 'secondary':
        return props.theme.secondary
      case 'tertiary':
        return props.theme.tertiary
      case 'grey':
        return props.theme.greyBlack
      case 'red':
        return props.theme.red
      case 'green':
        return props.theme.green
      case 'colorized':
        return props.backgroundColor && shadeColor(40, props.backgroundColor)
      default:
        return props.theme[props.backgroundColor] || props.backgroundColor || props.theme.white
    }
  }};
`

const buttonHoverKindStyle = css`
  color: ${props =>
    props.kind && props.kind === 'colorized' && props.backgroundColor
      ? shadeColor(-80, props.backgroundColor)
      : props.theme[props.hoverTextColor] || props.hoverTextColor || props.theme.white};
  background-color: ${props => {
    switch (props.hoverBgColor || props.kind) {
      case 'primary':
        return props.theme.primaryShade
      case 'secondary':
        return props.theme.secondaryShade
      case 'tertiary':
        return props.theme.tertiaryShade
      case 'grey':
        return props.theme.greyBlackShade
      case 'green':
        return props.theme.greenShade
      case 'red':
        return props.theme.redShade
      case 'lightBlue':
        return props.theme.lightBlueShade
      case 'primaryOutline':
        return props.theme.primary
      case 'secondaryOutline':
        return props.theme.secondary
      case 'tertiaryOutline':
        return props.theme.tertiary
      case 'greyOutline':
        return props.theme.greyBlackShade
      case 'greenOutline':
        return props.theme.green
      case 'redOutline':
        return props.theme.red
      case 'colorized':
        return props.backgroundColor
      default:
        return props.theme[props.hoverBgColor] || props.hoverBgColor || props.theme.white
    }
  }};
  ${props => props.hoverBgColor && `border-color: ${props.theme[props.hoverBgColor] || props.hoverBgColor};`}
  ${props => props.kind && props.kind === 'colorized' && props.backgroundColor && `boder-color: ${shadeColor(-80, props.backgroundColor)};`}
`

// Set the button kind (Theme color value)
const buttonDisabledStyle = css`
  color: ${props => props.theme.greyDark};
  border-color: ${props => props.theme.greyDark};
  background-color: ${props => props.theme.greyLight};
`

const buttonLoadingDisabledStyle = css`
  border-color: ${props => {
    switch (props.kind) {
      case 'primary':
      case 'primaryOutline':
        return props.theme.primary
      case 'secondary':
      case 'secondaryOutline':
        return props.theme.secondary
      case 'tertiary':
      case 'tertiaryOutline':
        return props.theme.tertiary
      case 'grey':
      case 'greyOutline':
        return props.theme.greyBlack
      case 'green':
      case 'greenOutline':
        return props.theme.green
      default:
        return props.theme.greyDark
    }
  }};
  background-color: ${props => {
    switch (props.kind) {
      case 'primary':
        return props.theme.primary
      case 'brownLight':
        return props.theme.brownLight
      case 'lightBlue':
        return props.theme.lightBlue
      case 'secondary':
        return props.theme.secondary
      case 'tertiary':
        return props.theme.tertiary
      case 'grey':
        return props.theme.greyBlack
      case 'green':
        return props.theme.green
      default:
        return props.theme.white
    }
  }};
`

// Set the button kind (Theme color value)
const buttonSizeStyle = css`
  width: auto;
  min-width: ${props => {
    switch (props.sizeW) {
      case 'narrow':
        return '100px'
      case 'wide':
        return '200px'
      case 'extraWide':
        return '350px'
      case 'widest':
        return '300px'
      case 'customerFacingSize':
        return '360px'
      case '50%':
        return '50%'
      case '100%':
        return '100%'
      default:
        return '160px'
    }
  }};
  max-width: ${props => {
    switch (props.sizeW) {
      case 'narrow':
        return '120px'
      case 'normal':
        return '175px'
      case 'wide':
        return '220px'
      case 'extraWide':
        return '350px'
      case 'customerFacingSize':
        return '320px'
      default:
        return '200px'
    }
  }};
  padding: ${props => {
    switch (props.sizeH) {
      case 'extraTall':
        return '1.3rm 1.7em'
      case 'tall':
        return '0.7em 1em'
      case 'short':
        return '0.3em 1em'
      case 'customerFacingSize':
        return '1.1em 1.6em'
      default:
        return '0.5em 1em'
    }
  }};

  min-height: ${props => {
    switch (props.sizeH) {
      case 'extraTall':
        return '70px'
      case 'tall':
        return '50px'
      case 'short':
        return '20px'
      case 'customerFacingSize':
        return '400px'
      default:
        return '40px'
    }
  }};
`

const setCustomHeight = css`
  height: ${props => props.customHeight};
  min-height: ${props => props.customHeight};
  max-height: ${props => props.customHeight};
`

const setCustomWidth = css`
  width: ${props => props.customWidth};
  min-width: ${props => props.customWidth};
  max-width: ${props => props.customWidth};
`

const setCustomPadding = css`
  padding: ${props => props.customPadding};
`

const btnBlastBackgroundEffect = keyframes`
  0% {
    transform: scale(0, 0);
    opacity: 1;
  }
  20% {
    transform: scale(10, 10);
    opacity: 1;
  }
  60% {
    opacity: 0;
    transform: scale(20, 20);
  }
`

const StdButton = styled.button.attrs(({ btnType }) => ({
  type: btnType
}))`
  margin: ${props => props.margin || 0};
  cursor: pointer;
  font-weight: ${props => props.fontWeight || 'normal'};
  font-size: ${props => props.fontSize || 'inhert'};
  border-width: 1px;
  border-style: solid;
  font-family: ${props => props.theme.fontFamily};
  border-radius: ${props => (props.rounded ? '0.3em' : 0)};
  overflow: hidden;
  position: relative;
  z-index: 0;

  ${props => props.upperCase && `text-transform: uppercase;`}

  ${flexCenterItem}
  flex-direction: ${props => (props.positionIcon === 'after' ? 'row-reverse' : 'row')};

  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    z-index: -1;
    opacity: 0;
    border-radius: 90%;
    transform: scale(1, 1);
    background-color: rgba(100, 100, 100, 0.6);
  }

  ${buttonKindStyle}
  ${buttonSizeStyle}

  ${props => props.customHeight && setCustomHeight}
  ${props => props.customWidth && setCustomWidth}
  ${props => props.customPadding && setCustomPadding}

  & > .icon{
    margin: ${props => (props.positionIcon === 'after' ? `0 0 -1px ${props.iconSideMargin || '0.2em'}` : `0 ${props.iconSideMargin || '0.2em'} -1px 0`)};
    ${props =>
      props.floatingIcon &&
      css`
        left: ${props.floatingIcon.left || 'auto'};
        margin: ${props.floatingIcon.margin || '0'};
        position: absolute;
        right: ${props.floatingIcon.right || 'auto'};
      `}
  }

  & .spinLoader{
    ${props =>
      props.floatingIcon &&
      css`
        left: -6.25rem;
        position: relative;
      `}
  }

  &:disabled {
    ${props => (props.loading ? buttonLoadingDisabledStyle : buttonDisabledStyle)}
  }

  &:hover{
    ${buttonHoverKindStyle}
  }

  &:focus:not(:active)::after {
    animation: ${btnBlastBackgroundEffect} 750ms linear 1;
  }

  ${props =>
    props.kind &&
    props.kind === 'colorized' &&
    css`
      &.selected {
        border-width: 4px !important;
        font-weight: bold;

        &::before {
          --darkenedBgColor: ${shadeColor(-80, props.backgroundColor)};

          background-color: var(--darkenedBgColor);
          border: 1px solid var(--darkenedBgColor);
          border-radius: 50%;
          content: '';
          display: block;
          height: 20px;
          opacity: 0;
          position: absolute;
          right: -10px;
          transition: opacity 200ms ease-in-out;
          top: -10px;
          width: 20px;
        }
      }
      &.show-badge {
        overflow: unset !important;

        &::before {
          opacity: 1 !important;
        }
      }
    `}
`

const loaderColor = (kind, bgColor) => {
  switch (kind) {
    case 'primaryOutline':
      return 'primary'
    case 'secondaryOutline':
      return 'secondary'
    case 'tertiaryOutline':
      return 'tertiary'
    case 'greyOutline':
      return 'greyBlack'
    case 'colorized':
      return bgColor && shadeColor(-80, bgColor)
    default:
      return 'white'
  }
}

export function Button({
  title,
  kind,
  backgroundColor,
  hoverBgColor,
  border,
  borderColor,
  btnType,
  customHeight,
  customWidth,
  customPadding,
  margin,
  rounded,
  icon,
  iconSideMargin,
  iconSize,
  textcolor,
  hoverTextColor,
  positionIcon,
  floatingIcon,
  loadingText,
  sizeH,
  sizeW,
  fontSize,
  fontWeight,
  id,
  upperCase,
  onClickHandler,
  loading,
  disabled,
  className
}) {
  const setLoaderColor = loaderColor(kind, backgroundColor)

  return (
    <StdButton
      btnType={btnType || 'button'}
      kind={kind}
      className={className}
      margin={margin}
      id={id}
      rounded={rounded}
      icon={icon}
      iconSideMargin={iconSideMargin}
      positionIcon={positionIcon}
      floatingIcon={floatingIcon}
      sizeH={sizeH}
      sizeW={sizeW}
      textcolor={textcolor}
      backgroundColor={backgroundColor}
      hoverBgColor={hoverBgColor}
      border={border}
      borderColor={borderColor}
      hoverTextColor={hoverTextColor}
      fontSize={fontSize}
      fontWeight={fontWeight}
      upperCase={upperCase}
      onClick={onClickHandler}
      loading={loading}
      customHeight={customHeight}
      customWidth={customWidth}
      customPadding={customPadding}
      disabled={disabled || loading}>
      {loading ? (
        <>
          <SpinLoader className={loadingText && 'spinLoader'} size="23px" color={setLoaderColor} />
          {loadingText && title}
        </>
      ) : (
        <>
          {icon && <Icon name={icon} size={iconSize || '12%'} />}
          {title}
        </>
      )}
    </StdButton>
  )
}
