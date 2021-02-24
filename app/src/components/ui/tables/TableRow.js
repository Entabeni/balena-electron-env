import React from 'react'
import styled from 'styled-components'

// Custom styled components
const TableRowTag = styled.tr`
  ${props => props.bgColor && props.theme[props.bgColor] && `background-color: ${props.theme[props.bgColor]};`}
  ${props =>
    props.padding &&
    `th,
      td {
        padding: ${props.padding} !important;
      }

      &&:first-child th,
      &&:first-child td {
        padding-top: 1rem !important;
      }

      &&:last-child th,
      &&:last-child td {
        padding-bottom: 1rem !important;
      }
      `}

  th.data-cell.l-a:first-child,
  td.data-cell.l-a:first-child {
    padding-left: 2.5rem;
  }

  &.clickable-row {
    cursor: pointer;
    transition: all 150ms ease-in;
  }

  &.hoverable-row {
    .fading-icon {
      margin: 0 1rem;
      opacity: 0;
      transition: all 150ms ease-in;
    }
    &:hover .fading-icon {
      opacity: 1;
    }
  }

  &.double-lined-row td {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  ${props =>
    props.hoverableActions &&
    `& td.action-cell button {
      opacity: 0;
      transition: all 250ms ease 0s;
      visibility: hidden;
    }

    &:hover td.action-cell button {
      opacity: 1;
      visibility: visible;
    }
      `}
`

export const TableRow = React.memo(({ children, onClickHandler, styles, ...props }) => (
  <TableRowTag onClick={onClickHandler} {...styles} {...props}>
    {children}
  </TableRowTag>
))
