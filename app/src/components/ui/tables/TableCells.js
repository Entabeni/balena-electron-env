import React from 'react'
import styled, { css } from 'styled-components'

const identifyLeftAlignedDataCells = ({ celltype, leftAligned }) => (leftAligned ? (!celltype ? 'data-cell l-a' : `${celltype} l-a`) : celltype || 'data-cell')

const processTextAlignment = ({ leftAligned, textAlign }) => (leftAligned ? 'left' : textAlign || null)

// Custom styled components
const commonStyles = css`
  && {
    ${props => props.color && props.theme[props.color] && `color: ${props.theme[props.color]} !important;`}
    ${props => props.fontsize && `font-size: ${props.fontsize} !important;`}
    ${props => props.padding && `padding: ${props.padding} !important;`}
    ${props => props.paddingright && `padding-right: ${props.paddingright} !important;`}
    ${props => props.textAlign && `text-align: ${props.textAlign} !important;`}
    ${props => props.size && `width: ${props.size} !important;`}
  }
`

const TableCellHeaderTag = styled.th.attrs(props => ({
  className: identifyLeftAlignedDataCells(props),
  textAlign: processTextAlignment(props)
}))`
  ${commonStyles}
`

const TableCellDataTag = styled.td.attrs(props => ({
  className: identifyLeftAlignedDataCells(props),
  textAlign: processTextAlignment(props)
}))`
  ${commonStyles}

  figure {
    vertical-align: middle;
  }

  &.clickable-cell {
    cursor: pointer;

    .fieldContainer {
      margin-bottom: 0;
      width: auto;
    }
  }

  .sort {
    cursor: pointer;
  }

  &.select-cell {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &.action-cell {
    align-items: center;
    display: flex;
    justify-content: ${props => (props.leftAligned && 'flex-start') || 'center'};
    ${props => props.leftAligned && 'padding-left: 2rem !important;'}

    button {
      border-radius: 50% !important;
      min-height: 2.625rem !important;
      min-width: 2.625rem !important;
      padding: 0.5rem !important;
      transition-duration: 150ms;

      & > .icon {
        margin: 0 !important;
      }
    }

    button + button {
      margin-left: 1rem !important;
    }
  }
`

export const TableCellHeader = React.memo(({ children, styles, ...props }) => (
  <TableCellHeaderTag {...styles} {...props}>
    {children}
  </TableCellHeaderTag>
))

export const TableCellData = React.memo(({ children, styles, ...props }) => (
  <TableCellDataTag {...styles} {...props}>
    {children}
  </TableCellDataTag>
))
