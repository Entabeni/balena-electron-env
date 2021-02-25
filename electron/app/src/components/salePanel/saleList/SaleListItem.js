import React from 'react'

// Utils
import { displayDateFormat, formatCurrency } from 'es-libs'

// Components
import { TableRow, TableCellData, RoundedCheckboxInput } from 'es-components'

export class SaleListItem extends React.Component {
  state = { checkBoxClicked: false }

  onClick = () => {
    const { saleLineItem, onCheckBoxClick } = this.props
    const { checkBoxClicked } = this.state

    if (onCheckBoxClick) {
      onCheckBoxClick(saleLineItem.id)
      this.setState({ checkBoxClicked: !checkBoxClicked })
    }
  }

  render() {
    const { forDate, guests, id, name, quantity, subTotal } = this.props.saleLineItem
    const { checkBoxClicked } = this.state

    return (
      <TableRow id={this.props.id}>
        <TableCellData celltype="select-cell">
          <RoundedCheckboxInput className="table-checkbox" key={id} id={id} field={id} onClickHandler={this.onClick} checked={checkBoxClicked} />
        </TableCellData>
        <TableCellData leftAligned>{name}</TableCellData>
        {this.props.shouldShowDate && <TableCellData>{forDate ? displayDateFormat(forDate) : 'N/A'}</TableCellData>}
        <TableCellData leftAligned>
          {guests && guests.length
            ? guests.map((guest, i) => {
                let guestFullName = guest.fullName
                if (i + 1 < guests.length) {
                  guestFullName += ', '
                }
                return guestFullName
              })
            : null}
        </TableCellData>
        <TableCellData>{`-${quantity}`}</TableCellData>
        <TableCellData textAlign="right" paddingright="2rem">
          {formatCurrency(subTotal)}
        </TableCellData>
      </TableRow>
    )
  }
}
