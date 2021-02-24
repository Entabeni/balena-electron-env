import React from 'react'
import styled from 'styled-components'

// Table components
import { TableRow, TableHeaderElement } from 'es-components'

// Custom styled components
const TableHeadTag = styled.thead`
  tr {
    background-color: ${props => props.theme.white} !important;
    border-bottom: 1px solid ${props => props.theme.grey} !important;
    ${props => props.borderTop && `border-top: 1px solid ${props.theme.grey} !important;`}
  }

  .sort-icon {
    cursor: pointer;
    margin-left: 3px;
    margin-bottom: -2px;

    &.sort-icon-up {
      margin-bottom: -4px;
    }

    &.sort-icon-down {
      margin-bottom: 2px;
    }
  }

  && th {
    color: ${props => props.theme[props.color] || props.color || 'black'};
    font-size: ${props => props.fontSize || '1rem'};
    font-weight: ${props => props.fontWeight || 'inherit'};
    padding: ${props => props.padding || '0.5rem'};
    text-align: ${props => props.textAlign || 'center'};
  }
`

export const TableHead = React.memo(({ children, data, styles, handleSortChange, ...props }) => {
  const renderTableHeadCells = data => {
    if (React.isValidElement(data)) {
      return data
    } else if (Array.isArray(data)) {
      return (
        <TableRow>
          {data.map((item, i) => {
            return <TableHeaderElement handleSortChange={handleSortChange} itemData={item} index={i} />
          })}
        </TableRow>
      )
    }
  }

  return (
    <TableHeadTag {...styles} {...props}>
      {children || (data && renderTableHeadCells(data)) || <TableRow />}
    </TableHeadTag>
  )
})
