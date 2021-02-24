import React from 'react'
import styled, { css } from 'styled-components'

const AssignLayoutWrapper = styled.div`
  background-color: ${props => (props.noBGColor ? 'none' : 'red')};
  border: ${props => (props.addBorder ? `1px solid ${props.theme.greyDark}` : 'none')};
  display: grid;
  height: 100%;
  grid-template-columns: ${props => (props.gridTemplate ? props.gridTemplate : 'auto 1fr')};
  grid-template-rows: 100%;
  margin-bottom: ${props => (props.overflowY ? '0' : '1rem')};
  max-height: 100%;
  ${props => {
    // Specific bugfix for Raspberry Pi based devices running Chromiun web browser (v.72.0.3626.121)
    // Making the whole panels container scrollable only for it, otherwise letting the panels scroll independently
    const isRaspberryPi = /Raspbian Chromium/i.test(window.navigator.userAgent)
    if (isRaspberryPi) {
      return 'overflow-y: scroll !important;'
    } else if (props.overflowY) {
      if (/scroll|auto/i.test(props.overflowY)) {
        return '-webkit-overflow-scrolling: touch;'
      } else {
        return `overflow-y: ${props.overflowY};`
      }
    }
    return ''
  }}
`

export const AssignLayoutLeft = styled.div`
  background-color: ${props => props.theme[props.bgColor] || props.theme.white};
  border-right: ${props => (props.rightBorder ? `1px solid ${props.theme.greyDark}` : 'none')};
  padding: 0.5em;
  width: 100%;
  ${props =>
    props.overflowY &&
    css`
      height: 100%;
      max-height: 100%;
      overflow-y: ${props.overflowY};
      ${props => props.overflowY && /scroll|auto/i.test(props.overflowY) && `-webkit-overflow-scrolling: touch;`}
    `}
`

export const AssignLayoutRight = styled.div`
  background-color: ${props => props.theme[props.bgColor] || props.theme.white};
  padding: 0.5em;
  width: 100%;
  ${props =>
    !props.overflowY
      ? css`
          max-height: 480px;
          overflow: scroll;
        `
      : css`
          height: 100%;
          max-height: 100%;
          overflow-y: ${props.overflowY};
          ${props => props.overflowY && /scroll|auto/i.test(props.overflowY) && `-webkit-overflow-scrolling: touch;`}
        `}
`

export default function AssignLayout({ addBorder, children, noBGColor, gridTemplate, ...props }) {
  return (
    <AssignLayoutWrapper gridTemplate={gridTemplate} noBGColor={noBGColor} addBorder={addBorder} {...props}>
      {children}
    </AssignLayoutWrapper>
  )
}
