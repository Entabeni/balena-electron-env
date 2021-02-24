import React from 'react'
import styled from 'styled-components'

// Custom styled components
const TableFootTag = styled.tfoot`
  border-top: 1px solid ${props => props.theme.grey} !important;
  ${props => props.borderBottom && `border-bottom: 1px solid ${props.theme.grey} !important;`}

  && td {
    color: ${props => props.theme[props.color] || props.color || 'black'};
    font-size: ${props => props.fontSize || '1rem'};
    font-weight: ${props => props.fontWeight || 'inherit'};
    padding: ${props => props.padding || '0.5rem'};
    text-align: ${props => props.textAlign || 'center'};
  }
`

export const TableFoot = ({ children, styles, ...props }) => (
  <TableFootTag {...styles} {...props}>
    {children}
  </TableFootTag>
)
