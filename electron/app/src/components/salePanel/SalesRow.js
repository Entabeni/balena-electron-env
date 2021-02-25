import React from 'react'
import { TableRow, TableCellData, Button } from 'es-components'
import { parseDateToFormat, formatCurrency } from 'es-libs'
export const SalesRow = React.memo(({ sale, index, account, setSaleSelected, showAndLoadEventLineItems }) => {
  return (
    <TableRow key={sale.objectID} id={`salesRow_${index}`}>
      <TableCellData leftAligned>{parseDateToFormat(sale.created, account)}</TableCellData>
      <TableCellData>{sale.number}</TableCellData>
      <TableCellData leftAligned>{sale.guestName ? `${sale.guestName}` : 'N/A'}</TableCellData>
      <TableCellData>{sale.status}</TableCellData>
      <TableCellData textAlign="right" paddingright="3rem">
        {formatCurrency(sale.total)}
      </TableCellData>
      <TableCellData celltype="action-cell">
        <Button
          id={`showSalesInfoButton_${index}`}
          kind="primary"
          hoverBgColor="red"
          icon="FaReceipt"
          iconSize="1.25rem"
          onClickHandler={() => setSaleSelected(sale.objectID)}
        />
        <Button kind="primary" hoverBgColor="red" icon="MdEventNote" iconSize="1.25rem" onClickHandler={() => showAndLoadEventLineItems(sale.objectID)} />
      </TableCellData>
    </TableRow>
  )
})
