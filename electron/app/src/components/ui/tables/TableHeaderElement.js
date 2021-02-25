import React, { useState, useEffect } from 'react'

// Table components
import { TableCellHeader, Icon } from 'es-components'

export const TableHeaderElement = React.memo(({ handleSortChange, index, itemData }) => {
  const [direction, setDirection] = useState(null)

  useEffect(() => {
    if (Object.prototype.toString.call(itemData) === '[object Object]' && itemData.sortable && itemData.defaultDirection) {
      setDirection(itemData.defaultDirection)
    }
  }, [])

  const onClick = () => {
    if (Object.prototype.toString.call(itemData) === '[object Object]' && itemData.sortable) {
      const { id } = itemData
      let newDirection = null
      if (!direction || direction === 'down') {
        newDirection = 'up'
      } else {
        newDirection = 'down'
      }

      handleSortChange(itemData.id, newDirection)
      setDirection(newDirection)
    }
  }

  let iconName = 'FaSort'
  let additionalClass = ''
  if (direction === 'up') {
    iconName = 'FaSortUp'
    additionalClass = 'sort-icon-up'
  }
  if (direction === 'down') {
    iconName = 'FaSortDown'
    additionalClass = 'sort-icon-down'
  }

  if (typeof itemData === 'string') {
    return <TableCellHeader key={`th-${index}-${itemData}`}>{itemData}</TableCellHeader>
  } else if (Object.prototype.toString.call(itemData) === '[object Object]') {
    const { id, styles, text, sortable, ...props } = itemData
    return (
      <TableCellHeader onClick={onClick} key={`th-${id}-${text}` || `th-${index}-${text}`} {...styles} {...props}>
        {text}
        {sortable && <Icon className={`sort-icon ${additionalClass}`} name={iconName} size="1rem" />}
      </TableCellHeader>
    )
  }
  return null
})
