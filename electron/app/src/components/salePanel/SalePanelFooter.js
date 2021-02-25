import React from 'react'
import styled from 'styled-components'

// Utils
import { formatCurrency } from 'es-libs'

// Components
import { TableRow, TableCellData } from 'es-components'

const sharedCalcRowStyles = { padding: '0.25rem 0.5rem' }
const sharedLabelCellStyles = { color: 'greyDark', size: '77.5%', textAlign: 'right' }
const sharedValuelCellStyles = { fontsize: '1.5rem', paddingright: '2rem', size: '22.5%', textAlign: 'right' }

export function SalePanelFooter({ discount, shippingOption, subTotal, taxTotal, total }) {
  return (
    <React.Fragment>
      {shippingOption != null && shippingOption !== 0 && (
        <TableRow className="custom-layout" styles={sharedCalcRowStyles}>
          <TableCellData celltype="calc-label-cell" styles={sharedLabelCellStyles}>
            Shipping Cost
          </TableCellData>
          <TableCellData celltype="calc-value-cell" styles={sharedValuelCellStyles}>
            {formatCurrency(shippingOption.price)}
          </TableCellData>
        </TableRow>
      )}
      <TableRow className="custom-layout" styles={sharedCalcRowStyles}>
        <TableCellData celltype="calc-label-cell" styles={sharedLabelCellStyles}>
          Subtotal
        </TableCellData>
        <TableCellData celltype="calc-value-cell" styles={sharedValuelCellStyles}>
          {formatCurrency(subTotal)}
        </TableCellData>
      </TableRow>
      {discount && (
        <TableRow className="custom-layout" styles={sharedCalcRowStyles}>
          <TableCellData celltype="calc-label-cell" styles={sharedLabelCellStyles}>
            Discount
          </TableCellData>
          <TableCellData celltype="calc-value-cell" styles={sharedValuelCellStyles}>
            {formatCurrency(discount)}
          </TableCellData>
        </TableRow>
      )}
      <TableRow className="custom-layout" styles={sharedCalcRowStyles}>
        <TableCellData celltype="calc-label-cell" styles={sharedLabelCellStyles}>
          Tax
        </TableCellData>
        <TableCellData celltype="calc-value-cell" styles={sharedValuelCellStyles}>
          {formatCurrency(taxTotal)}
        </TableCellData>
      </TableRow>
      <TableRow className="custom-layout" styles={sharedCalcRowStyles}>
        <TableCellData celltype="calc-label-cell" styles={sharedLabelCellStyles}>
          Total
        </TableCellData>
        <TableCellData celltype="calc-value-cell" styles={sharedValuelCellStyles}>
          {formatCurrency(total)}
        </TableCellData>
      </TableRow>
    </React.Fragment>
  )
}
