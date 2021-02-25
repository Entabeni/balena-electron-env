import React from 'react'

// Components
import { TableRow, TableCellData, RoundedCheckboxInput } from 'es-components'

class GuestListItem extends React.Component {
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
    const { firstName, lastName, id } = this.props.saleLineItem
    const { checkBoxClicked } = this.state

    return (
      <TableRow>
        <TableCellData celltype="select-cell">
          <RoundedCheckboxInput className="table-checkbox" key={id} id={id} field={id} onClickHandler={this.onClick} checked={checkBoxClicked} />
        </TableCellData>
        <TableCellData leftAligned>
          {firstName} {lastName}
        </TableCellData>
      </TableRow>
    )
  }
}
export default GuestListItem
